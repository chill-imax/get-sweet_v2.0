"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  KeyRound,
  Megaphone,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import {
  addCampaignOutput,
  deleteCampaignOutput,
  getCampaignOutputs,
  uid,
  updateCampaignOutput,
} from "./campaignStorage";

const TYPE_META = {
  strategy: {
    label: "Strategy Plan",
    icon: FileText,
    help: "Brand + campaign → plan (ad groups, CTA, angles)",
  },
  keywords: {
    label: "Keywords Pack",
    icon: KeyRound,
    help: "Keywords + match types + negatives",
  },
  rsa_ads: {
    label: "RSA Drafts",
    icon: Megaphone,
    help: "Responsive Search Ads (headlines + descriptions) per ad group",
  },
};

function formatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

function pill(status) {
  const base =
    "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border";
  if (status === "approved") return `${base} bg-green-50 text-green-700 border-green-200`;
  if (status === "ready") return `${base} bg-blue-50 text-blue-700 border-blue-200`;
  return `${base} bg-gray-100 text-gray-700 border-gray-200`; // draft
}

function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

// Simple placeholder payloads (so Output Viewer has something real to show)
function makePlaceholderPayload(type, campaignName = "Untitled campaign") {
  if (type === "strategy") {
    return {
      objective: "Lead Gen",
      cta: "Get Quote",
      plan: [
        { adGroup: "Emergency Plumbing", angles: ["Fast response", "Same-day service"] },
        { adGroup: "Water Heater Repair", angles: ["Affordable fixes", "Trusted technicians"] },
      ],
      notes: `Generated from ${campaignName}.`,
    };
  }

  if (type === "keywords") {
    return {
      adGroups: [
        {
          name: "Emergency Plumbing",
          keywords: [
            { term: "emergency plumber near me", match: "phrase" },
            { term: "24 hour plumber", match: "phrase" },
            { term: "emergency plumbing", match: "exact" },
          ],
          negatives: ["free", "diy", "jobs"],
        },
        {
          name: "Water Heater Repair",
          keywords: [
            { term: "water heater repair", match: "phrase" },
            { term: "water heater service", match: "phrase" },
            { term: "hot water heater repair near me", match: "exact" },
          ],
          negatives: ["manual", "parts", "used"],
        },
      ],
    };
  }

  // rsa_ads
  return {
    adGroups: [
      {
        name: "Emergency Plumbing",
        landingPage: "https://example.com/emergency",
        rsa: {
          headlines: [
            "Emergency Plumber Near You",
            "24/7 Fast Response",
            "Get a Quote in Minutes",
            "Same-Day Service Available",
            "Trusted Local Technicians",
          ],
          descriptions: [
            "Need help now? Book a local technician fast.",
            "Upfront pricing and quick scheduling—get a quote today.",
          ],
          pins: { h1: "Emergency Plumber Near You" },
        },
      },
      {
        name: "Water Heater Repair",
        landingPage: "https://example.com/water-heater",
        rsa: {
          headlines: [
            "Water Heater Repair",
            "Restore Hot Water Fast",
            "Transparent Pricing",
            "Schedule Today",
            "Local Pros You Can Trust",
          ],
          descriptions: [
            "Quick diagnosis and reliable repair from local pros.",
            "Book service today—get hot water back quickly.",
          ],
          pins: {},
        },
      },
    ],
  };
}

export default function CampaignResultsFeed({ campaignId, campaignName }) {
  const router = useRouter();
  const [outputs, setOutputs] = useState([]);

  const sorted = useMemo(() => {
    const list = Array.isArray(outputs) ? outputs : [];
    return [...list].sort((a, b) => {
      const at = new Date(a?.createdAt || 0).getTime();
      const bt = new Date(b?.createdAt || 0).getTime();
      return bt - at;
    });
  }, [outputs]);

  function refresh() {
    const list = getCampaignOutputs(String(campaignId));
    setOutputs(list);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  function createOutput(type) {
    const now = new Date().toISOString();
    const outputId = uid(type);
    const meta = TYPE_META[type] || { label: "Output" };

    const payload = makePlaceholderPayload(type, campaignName);

    const summary =
      type === "strategy"
        ? "Objective: Lead Gen • 2 ad groups • CTA: Get Quote"
        : type === "keywords"
        ? "2 ad groups • 6 keywords • negatives included"
        : "2 ad groups • RSAs drafted • pins suggested";

    addCampaignOutput(String(campaignId), {
      outputId,
      type,
      title: meta.label,
      status: "draft", // draft | ready | approved
      createdAt: now,
      updatedAt: now,
      summary,
      payload: deepClone(payload),
    });

    refresh();
  }

  function openOutput(outputId) {
    router.push(`/chat/campaign/${campaignId}/outputs/${outputId}`);
  }

  function approve(outputId) {
    updateCampaignOutput(String(campaignId), outputId, {
      status: "approved",
      updatedAt: new Date().toISOString(),
    });
    refresh();
  }

  function regenerate(output) {
    // MVP: “regenerate” just updates summary + timestamp + sets status to ready
    updateCampaignOutput(String(campaignId), output.outputId, {
      status: "ready",
      updatedAt: new Date().toISOString(),
      summary: `${output.summary} (refreshed)`,
    });
    refresh();
  }

  function remove(outputId) {
    if (!confirm("Delete this output?")) return;
    deleteCampaignOutput(String(campaignId), outputId);
    refresh();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b bg-white">
        <div className="max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Campaign results</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                Latest outputs
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Generate drafts, review them, and approve before publishing.
              </div>
            </div>

            <button
              onClick={refresh}
              className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <CreateButton
              title="Strategy"
              subtitle="Plan ad groups + CTA"
              icon={FileText}
              onClick={() => createOutput("strategy")}
            />
            <CreateButton
              title="Keywords"
              subtitle="Match types + negatives"
              icon={KeyRound}
              onClick={() => createOutput("keywords")}
            />
            <CreateButton
              title="RSA Ads"
              subtitle="Headlines + descriptions"
              icon={Megaphone}
              onClick={() => createOutput("rsa_ads")}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-3xl space-y-4">
          {sorted.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-sm font-semibold text-gray-900">No outputs yet</div>
              <div className="text-sm text-gray-600 mt-1">
                Click Strategy / Keywords / RSA Ads above to create your first drafts.
              </div>
            </div>
          ) : (
            sorted.map((o) => {
              const meta = TYPE_META[o.type] || {};
              const Icon = meta.icon || FileText;

              return (
                <div
                  key={o.outputId}
                  className="bg-white border border-gray-200 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {o.title || meta.label || "Output"}
                            </div>
                            <span className={pill(o.status)}>
                              {o.status === "approved"
                                ? "Approved"
                                : o.status === "ready"
                                ? "Ready"
                                : "Draft"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {o.updatedAt ? `Updated ${formatTime(o.updatedAt)}` : ""}
                          </div>
                        </div>
                      </div>

                      {meta.help ? (
                        <div className="text-xs text-gray-600 mt-2">
                          {meta.help}
                        </div>
                      ) : null}

                      {o.summary ? (
                        <div className="mt-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-3">
                          {o.summary}
                        </div>
                      ) : null}
                    </div>

                    <div className="shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => openOutput(o.outputId)}
                        className="h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </button>

                      <button
                        onClick={() => regenerate(o)}
                        className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>

                      <button
                        onClick={() => remove(o.outputId)}
                        className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-red-700 hover:bg-red-50 inline-flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {o.status !== "approved" ? (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => approve(o.outputId)}
                        className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 inline-flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                      Approved outputs are ready to publish once Google Ads is connected.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function CreateButton({ title, subtitle, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{title}</div>
            <div className="text-xs text-gray-600 mt-0.5">{subtitle}</div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
