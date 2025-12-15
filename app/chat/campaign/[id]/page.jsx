"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, BarChart3, Settings as SettingsIcon } from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import CampaignStatusBanner from "@/components/chat/campaign/CampaignStatusBanner";

function Tabs({ active, onChange }) {
  const tabs = [
    { id: "chatbot", label: "Chatbot", icon: MessageSquare },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: SettingsIcon },
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

function ChatbotPanel({ campaignId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `You're in campaign chat for ${campaignId}. Ask me to generate ad groups, keyword themes, or landing-page suggestions.`,
    },
  ]);

  function onSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    // placeholder assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Got it. Next I’d generate: (1) 2–4 ad groups, (2) keywords + match types, (3) 10–15 headlines, (4) descriptions, (5) extensions. Want lead-gen or conversions emphasis?",
        },
      ]);
    }, 200);
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 ${
                m.role === "user"
                  ? "bg-purple-50 border-purple-100"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="text-[11px] font-bold uppercase text-gray-500 mb-1">
                {m.role === "user" ? "You" : "Sweet Manager"}
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-white px-6 py-4">
        <div className="max-w-4xl flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sweet Manager about this campaign…"
            className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            onClick={onSend}
            className="h-11 px-5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultsPanel() {
  return (
    <div className="px-6 py-4 space-y-4">
      <div className="max-w-4xl">
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

function SettingsPanel({ campaignId }) {
  // placeholder state; later load from DB by campaignId
  const [name, setName] = useState(`Campaign ${String(campaignId).slice(0, 6)}`);
  const [objective, setObjective] = useState("leads");
  const [landingUrl, setLandingUrl] = useState("");
  const [geo, setGeo] = useState("");
  const [language, setLanguage] = useState("English");
  const [budget, setBudget] = useState("");

  // very simple ad group placeholders
  const [adGroups, setAdGroups] = useState([
    { id: "ag1", name: "Core Service", theme: "Primary offer keywords" },
    { id: "ag2", name: "Competitor / Alt", theme: "Alternatives + comparison" },
  ]);

  function addAdGroup() {
    const next = adGroups.length + 1;
    setAdGroups((prev) => [
      ...prev,
      { id: `ag${next}`, name: `Ad Group ${next}`, theme: "" },
    ]);
  }

  function updateAdGroup(id, patch) {
    setAdGroups((prev) => prev.map((ag) => (ag.id === id ? { ...ag, ...patch } : ag)));
  }

  function removeAdGroup(id) {
    setAdGroups((prev) => prev.filter((ag) => ag.id !== id));
  }

  return (
    <div className="px-6 py-4 space-y-4">
      {/* Campaign settings */}
      <div className="max-w-4xl bg-white border border-gray-200 rounded-2xl p-5">
        <div className="text-sm font-semibold text-gray-900">Campaign settings</div>
        <div className="text-sm text-gray-600 mt-1">
          High-level info used to shape ad groups and copy.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
              Campaign name
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g., leads"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Landing page URL
              </div>
              <input
                value={landingUrl}
                onChange={(e) => setLandingUrl(e.target.value)}
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
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                placeholder="e.g., San Mateo County"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Language
              </div>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., English"
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                Budget (optional)
              </div>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
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

      {/* Ad groups */}
      <div className="max-w-4xl bg-white border border-gray-200 rounded-2xl p-5">
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
                    onChange={(e) => updateAdGroup(ag.id, { name: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., Emergency plumbing"
                  />

                  <div className="mt-3 text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Theme / intent
                  </div>
                  <input
                    value={ag.theme}
                    onChange={(e) => updateAdGroup(ag.id, { theme: e.target.value })}
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
            onClick={() => alert("Generate ads draft from ad groups (placeholder)")}
            className="w-full h-11 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700"
          >
            Generate Google Ads draft
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const [activeTab, setActiveTab] = useState("chatbot");

  const activeContext = String(id);
  const headerTitle = useMemo(() => "Campaign", []);

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={(ctx) => {
          if (ctx === "general") router.push("/chat");
          else router.push(`/chat/campaign/${ctx}`);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
          rightBadgeLabel="campaign mode"
        />

        {/* Status line ABOVE tabs */}
        <CampaignStatusBanner
          status="approved"
          provider="Google Ads"
          onUnlock={() => console.log("unlock")}
          onRegenerate={() => console.log("regenerate")}
        />

        {/* Tabs */}
        <div className="pt-3">
          <Tabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Panel area */}
        <div className="flex-1 min-h-0">
          {activeTab === "chatbot" ? (
            <ChatbotPanel campaignId={activeContext} />
          ) : activeTab === "results" ? (
            <div className="h-full overflow-y-auto">
              <ResultsPanel />
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <SettingsPanel campaignId={activeContext} />
            </div>
          )}
        </div>
      </div>

      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={activeContext}
        mode="campaign"
        campaignId={activeContext}
      />
    </div>
  );
}
