"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, BarChart3, FileText } from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import CampaignStatusBanner from "@/components/chat/campaign/CampaignStatusBanner";

/* ---------------- Tabs ---------------- */

function Tabs({ active, onChange }) {
  const tabs = [
    { id: "chatbot", label: "Campaign AI", icon: MessageSquare },
    { id: "results", label: "Campaign Performance", icon: BarChart3 },
    { id: "settings", label: "Campaign Details", icon: FileText },
  ];

  return (
    <div className="px-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-1 flex">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold transition inline-flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Helpers: simple chat-to-settings parsing ---------------- */

function normalize(str) {
  return (str || "").trim();
}

function parseChatCommand(text) {
  const t = (text || "").toLowerCase();

  // "set objective to leads"
  const objMatch =
    t.match(/objective\s*(to|=)\s*([a-z\s-]+)/i) ||
    t.match(/set\s+objective\s+to\s+([a-z\s-]+)/i);
  const objective = objMatch ? normalize(objMatch[objMatch.length - 1]) : null;

  // "set geo to san mateo county"
  const geoMatch =
    t.match(/geo\s*(to|=)\s*([a-z0-9\s,-]+)/i) ||
    t.match(/set\s+geo\s+to\s+([a-z0-9\s,-]+)/i);
  const geo = geoMatch ? normalize(geoMatch[geoMatch.length - 1]) : null;

  // "budget to $50/day"
  const budgetMatch =
    t.match(/budget\s*(to|=)\s*([a-z0-9$\/\s.-]+)/i) ||
    t.match(/set\s+budget\s+to\s+([a-z0-9$\/\s.-]+)/i);
  const budget = budgetMatch ? normalize(budgetMatch[budgetMatch.length - 1]) : null;

  // "landing page url https://..."
  const urlMatch =
    t.match(/landing\s*(page)?\s*(url)?\s*(to|=)?\s*(https?:\/\/\S+)/i) ||
    t.match(/set\s+landing\s*(page)?\s*(url)?\s+to\s+(https?:\/\/\S+)/i);
  const landingUrl = urlMatch ? normalize(urlMatch[urlMatch.length - 1]) : null;

  // "set language to English"
  const langMatch =
    t.match(/language\s*(to|=)\s*([a-z\s-]+)/i) ||
    t.match(/set\s+language\s+to\s+([a-z\s-]+)/i);
  const language = langMatch ? normalize(langMatch[langMatch.length - 1]) : null;

  // "rename campaign to X"
  const nameMatch =
    t.match(/rename\s+campaign\s+to\s+(.+)/i) ||
    t.match(/campaign\s+name\s*(to|=)\s*(.+)/i);
  const name = nameMatch ? normalize(nameMatch[nameMatch.length - 1]) : null;

  // "add ad group emergency plumbing"
  const addAgMatch =
    t.match(/add\s+ad\s*group\s+(.+)/i) ||
    t.match(/new\s+ad\s*group\s+(.+)/i);
  const addAdGroupName = addAgMatch ? normalize(addAgMatch[addAgMatch.length - 1]) : null;

  return {
    objective,
    geo,
    budget,
    landingUrl,
    language,
    name,
    addAdGroupName,
  };
}

/* ---------------- Chatbot Panel ---------------- */

function ChatbotPanel({
  campaignId,
  campaignDetails,
  adGroups,
  onApplyPatch,
  onAddAdGroup,
}) {
  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Welcome to Campaign AI.\n\n" +
        "Tell me what you’re trying to achieve and I’ll update Campaign Details + Ad Groups automatically.\n\n" +
        "Try:\n" +
        '• “Set geo to San Mateo County”\n' +
        '• “Budget $50/day”\n' +
        '• “Add ad group emergency plumbing”',
    },
  ]);

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    const parsed = parseChatCommand(trimmed);

    const patches = {};
    if (parsed.name) patches.name = parsed.name;
    if (parsed.objective) patches.objective = parsed.objective;
    if (parsed.geo) patches.geo = parsed.geo;
    if (parsed.budget) patches.budget = parsed.budget;
    if (parsed.landingUrl) patches.landingUrl = parsed.landingUrl;
    if (parsed.language) patches.language = parsed.language;

    const didPatch = Object.keys(patches).length > 0;
    const didAddAdGroup = Boolean(parsed.addAdGroupName);

    if (didPatch) onApplyPatch(patches);
    if (didAddAdGroup) onAddAdGroup(parsed.addAdGroupName);

    setIsTyping(true);

    setTimeout(() => {
      const lines = [];

      if (didPatch || didAddAdGroup) {
        lines.push("Done ✅");

        if (didPatch) {
          lines.push("");
          lines.push("Updated campaign details:");
          Object.entries(patches).forEach(([k, v]) => lines.push(`• ${k}: ${v}`));
        }

        if (didAddAdGroup) {
          lines.push("");
          lines.push("Added ad group:");
          lines.push(`• ${parsed.addAdGroupName}`);
          lines.push("  – Theme: (add keywords / intent)");
        }

        lines.push("");
        lines.push("Want me to generate a Google Ads draft next?");
      } else {
        lines.push(
          "Got it. Tell me what to change (objective, geo, budget, landing page, ad groups).\n\n" +
            "Example: “Set objective to lead gen and add ad group clogged drain”."
        );
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", text: lines.join("\n") }]);
    }, 450);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-50">
      {/* Message list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-5">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map((m, idx) => (
            <ChatBubble key={idx} role={m.role} text={m.text} />
          ))}

          {isTyping ? (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                SM
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t bg-white px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Message Campaign AI… (Enter to send, Shift+Enter for new line)"
                  className="w-full min-h-[44px] max-h-[140px] resize-none px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="mt-2 text-[11px] text-gray-500">
                Quick commands: <span className="font-mono">objective</span>,{" "}
                <span className="font-mono">geo</span>,{" "}
                <span className="font-mono">budget</span>,{" "}
                <span className="font-mono">landing url</span>,{" "}
                <span className="font-mono">add ad group</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="h-11 px-5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* -------- Bubble subcomponent -------- */

function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
          SM
        </div>
      ) : null}

      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 border text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-800 border-gray-200"
        }`}
      >
        {text}
      </div>

      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
          You
        </div>
      ) : null}
    </div>
  );
}


/* ---------------- Results ---------------- */

function ResultsPanel() {
  return (
    <div className="px-6 py-4 space-y-4">
      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="text-sm font-semibold text-gray-900">
            Results / Performance
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Coming soon. This tab will show spend, clicks, conversions, CPA,
            ROAS, and an AI summary.
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Spend", "—"],
              ["Clicks", "—"],
              ["Conversions", "—"],
              ["CPA", "—"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4"
              >
                <div className="text-[11px] font-bold text-gray-500 uppercase">
                  {k}
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {v}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Tip: you can ship this tab first with “manual entry” or mock data
            while Google Ads is not connected.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */

function SettingsPanel({
  campaignDetails,
  setCampaignDetails,
  adGroups,
  setAdGroups,
  onGenerateDraft,
}) {
  function addAdGroup() {
    const next = adGroups.length + 1;
    setAdGroups((prev) => [
      ...prev,
      { id: `ag${next}`, name: `Ad Group ${next}`, theme: "" },
    ]);
  }

  function updateAdGroup(id, patch) {
    setAdGroups((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, ...patch } : ag))
    );
  }

  function removeAdGroup(id) {
    setAdGroups((prev) => prev.filter((ag) => ag.id !== id));
  }

  return (
    <div className="px-6 py-4 space-y-4">
      {/* Campaign settings (FULL WIDTH) */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-5">
        <div className="text-sm font-semibold text-gray-900">
          Campaign Details
        </div>
        <div className="text-sm text-gray-600 mt-1">
          High-level info used to shape ad groups and copy.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
              Campaign name
            </div>
            <input
              value={campaignDetails.name}
              onChange={(e) =>
                setCampaignDetails((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g., Winter Lead Gen"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Objective
              </div>
              <input
                value={campaignDetails.objective}
                onChange={(e) =>
                  setCampaignDetails((p) => ({ ...p, objective: e.target.value }))
                }
                placeholder="e.g., leads"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Landing page URL
              </div>
              <input
                value={campaignDetails.landingUrl}
                onChange={(e) =>
                  setCampaignDetails((p) => ({ ...p, landingUrl: e.target.value }))
                }
                placeholder="https://example.com/landing"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Geo
              </div>
              <input
                value={campaignDetails.geo}
                onChange={(e) =>
                  setCampaignDetails((p) => ({ ...p, geo: e.target.value }))
                }
                placeholder="e.g., San Mateo County"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Language
              </div>
              <input
                value={campaignDetails.language}
                onChange={(e) =>
                  setCampaignDetails((p) => ({ ...p, language: e.target.value }))
                }
                placeholder="e.g., English"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Budget (optional)
              </div>
              <input
                value={campaignDetails.budget}
                onChange={(e) =>
                  setCampaignDetails((p) => ({ ...p, budget: e.target.value }))
                }
                placeholder="e.g., $50/day"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              (Front-end only) Save later to backend + load per campaign.
            </div>
            <button
              type="button"
              onClick={() => alert("Save settings (placeholder)")}
              className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
            >
              Save settings
            </button>
          </div>
        </div>
      </div>

      {/* Ad groups (FULL WIDTH) */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">Ad groups</div>
            <div className="text-sm text-gray-600 mt-1">
              Organize keyword themes + messaging angles.
            </div>
          </div>

          <button
            type="button"
            onClick={addAdGroup}
            className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Add ad group
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {adGroups.map((ag) => (
            <div key={ag.id} className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Name
                  </div>
                  <input
                    value={ag.name}
                    onChange={(e) =>
                      updateAdGroup(ag.id, { name: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., Emergency plumbing"
                  />

                  <div className="mt-3 text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Theme / intent
                  </div>
                  <input
                    value={ag.theme}
                    onChange={(e) =>
                      updateAdGroup(ag.id, { theme: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., clogged drain, emergency plumber near me"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeAdGroup(ag.id)}
                  className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onGenerateDraft}
            className="w-full h-11 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700"
          >
            Generate Google Ads draft
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function CampaignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const [activeTab, setActiveTab] = useState("chatbot");

  const campaignId = String(id);

  // Shared campaign state (so chat + settings stay in sync)
  const [campaignDetails, setCampaignDetails] = useState({
    name: `Campaign ${campaignId.slice(0, 6)}`,
    objective: "leads",
    landingUrl: "",
    geo: "",
    language: "English",
    budget: "",
  });

  const [adGroups, setAdGroups] = useState([
    { id: "ag1", name: "Core Service", theme: "Primary offer keywords" },
    { id: "ag2", name: "Competitor / Alt", theme: "Alternatives + comparison" },
  ]);

  // Banner state (so Unlock/Regenerate actually does something)
  const [draftStatus, setDraftStatus] = useState("approved"); // "approved" | "draft" | "locked"
  const [draftLocked, setDraftLocked] = useState(true);
  const [draftVersion, setDraftVersion] = useState(1);

  const headerTitle = useMemo(() => "Campaign", []);

  function handleUnlock() {
    setDraftLocked(false);
    setDraftStatus("draft");
  }

  function handleRegenerate() {
    // pretend we created a new draft version
    setDraftVersion((v) => v + 1);
    setDraftLocked(false);
    setDraftStatus("draft");
    // optionally jump user to settings to review
    setActiveTab("settings");
  }

  function handleGenerateDraft() {
    // placeholder: create draft + lock it
    setDraftStatus("approved");
    setDraftLocked(true);
    alert("Draft generated (placeholder). Next: show draft artifacts + approval flow.");
  }

  function applyPatch(patch) {
    setCampaignDetails((prev) => ({ ...prev, ...patch }));
  }

  function addAdGroupFromChat(name) {
    const next = adGroups.length + 1;
    setAdGroups((prev) => [
      ...prev,
      { id: `ag${next}`, name, theme: "" },
    ]);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={campaignId}
        setActiveContext={(ctx) => {
          if (ctx === "general") router.push("/chat");
          else router.push(`/chat/campaign/${ctx}`);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">

        {/* Status line ABOVE tabs (now wired) */}
        <CampaignStatusBanner
          status={draftStatus}
          provider="Google Ads"
          version={draftVersion}
          locked={draftLocked}
          onUnlock={handleUnlock}
          onRegenerate={handleRegenerate}
        />

        {/* Tabs */}
        <div className="pt-3">
          <Tabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Panel area */}
        <div className="flex-1 min-h-0">
          {activeTab === "chatbot" ? (
            <ChatbotPanel
              campaignId={campaignId}
              campaignDetails={campaignDetails}
              adGroups={adGroups}
              onApplyPatch={applyPatch}
              onAddAdGroup={addAdGroupFromChat}
            />
          ) : activeTab === "results" ? (
            <div className="h-full overflow-y-auto">
              <ResultsPanel />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <SettingsPanel
                campaignDetails={campaignDetails}
                setCampaignDetails={setCampaignDetails}
                adGroups={adGroups}
                setAdGroups={setAdGroups}
                onGenerateDraft={handleGenerateDraft}
              />
            </div>
          )}
        </div>
      </div>

      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={campaignId}
        mode="campaign"
        campaignId={campaignId}
      />
    </div>
  );
}
