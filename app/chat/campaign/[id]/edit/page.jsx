"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";

function safeJsonParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function readLocalCampaign(id) {
  const byIdRaw = localStorage.getItem("campaignsById");
  const byId = safeJsonParse(byIdRaw, {});
  if (byId && byId[id]) return { id, ...byId[id] };

  const listRaw = localStorage.getItem("campaigns");
  const list = safeJsonParse(listRaw, []);
  if (Array.isArray(list)) {
    const found = list.find((c) => String(c?._id || c?.id) === id);
    if (found) return { id, ...found };
  }

  return { id, name: "Untitled campaign" };
}

function upsertLocalCampaign(campaign) {
  const id = String(campaign.id);

  const byIdRaw = localStorage.getItem("campaignsById");
  const campaignsById = safeJsonParse(byIdRaw, {});
  campaignsById[id] = { ...campaign, id };
  localStorage.setItem("campaignsById", JSON.stringify(campaignsById));

  const listRaw = localStorage.getItem("campaigns");
  const list = safeJsonParse(listRaw, []);
  const idx = Array.isArray(list)
    ? list.findIndex((c) => String(c?._id || c?.id) === id)
    : -1;

  const normalized = { ...campaign, id };
  if (idx >= 0) list[idx] = normalized;
  else list.unshift(normalized);

  localStorage.setItem("campaigns", JSON.stringify(list));
}

export default function CampaignEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const campaignId = String(id);

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const headerTitle = useMemo(() => "Edit campaign", []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    id: campaignId,
    name: "",
    objective: "",
    landingUrl: "",
    channel: "Google Search",
    geo: "",
    language: "English",
    budget: "",
    timeframe: "Next 30 days",
    primaryGoal: "",
    successMetric: "",
  });

  useEffect(() => {
    const c = readLocalCampaign(campaignId);
    setForm((p) => ({
      ...p,
      ...c,
      id: campaignId,
    }));
    setLoading(false);
  }, [campaignId]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  async function handleSave(e) {
    e.preventDefault();
    setToast(null);

    if (!form.name.trim()) {
      setToast({ type: "error", message: "Campaign name is required." });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        objective: (form.objective || "").trim(),
        landingUrl: (form.landingUrl || "").trim(),
        geo: (form.geo || "").trim(),
        budget: (form.budget || "").trim(),
        primaryGoal: (form.primaryGoal || "").trim(),
        successMetric: (form.successMetric || "").trim(),
        timeframe: (form.timeframe || "").trim(),
        updatedAt: new Date().toISOString(),
      };

      upsertLocalCampaign(payload);

      setToast({ type: "success", message: "Saved." });
      setTimeout(() => setToast(null), 1500);

      // optional: go back to campaign page after save
      // router.push(`/chat/campaign/${campaignId}`);
    } catch (e2) {
      console.error(e2);
      setToast({ type: "error", message: "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
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
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={campaignId}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            <button
              onClick={() => router.push(`/chat/campaign/${campaignId}`)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to campaign
            </button>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-6">
              <div className="text-xl font-semibold text-gray-900">
                Campaign settings
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Update metadata that agents use to generate Google Search ads.
              </div>

              {toast ? (
                <div
                  className={`mt-4 text-sm rounded-xl p-3 border ${
                    toast.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {toast.message}
                </div>
              ) : null}

              <form onSubmit={handleSave} className="mt-5 space-y-5">
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Campaign name
                  </div>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., Winter Lead Gen"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Objective
                    </div>
                    <input
                      value={form.objective}
                      onChange={(e) => setField("objective", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="e.g., Lead gen"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Landing page URL
                    </div>
                    <input
                      value={form.landingUrl}
                      onChange={(e) => setField("landingUrl", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="https://example.com/landing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Channel
                    </div>
                    <select
                      value={form.channel}
                      onChange={(e) => setField("channel", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <option>Google Search</option>
                      <option>YouTube (later)</option>
                      <option>Performance Max (later)</option>
                      <option>Display (later)</option>
                    </select>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Geo
                    </div>
                    <input
                      value={form.geo}
                      onChange={(e) => setField("geo", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="e.g., San Mateo County"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Budget
                    </div>
                    <input
                      value={form.budget}
                      onChange={(e) => setField("budget", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="e.g., $50/day"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Primary goal
                    </div>
                    <input
                      value={form.primaryGoal}
                      onChange={(e) => setField("primaryGoal", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="e.g., Get quote requests"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Success metric
                    </div>
                    <input
                      value={form.successMetric}
                      onChange={(e) => setField("successMetric", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="e.g., 30 leads/month at <$40 CPL"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/chat/campaign/${campaignId}`)}
                    className="h-11 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save changes
                  </button>
                </div>

                <div className="text-xs text-gray-500 leading-snug">
                  Stored locally for now. When you add backend later, swap `localStorage` for fetch calls.
                </div>
              </form>
            </div>
          </div>
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
