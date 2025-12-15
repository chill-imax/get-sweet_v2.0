// components/chat/RightSideBar.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layout,
  X,
  ExternalLink,
  Loader2,
  Tag,
  Target,
  Brain,
  Search,
  PencilLine,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  RotateCcw,
  Eye,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";

/**
 * RightSidebar
 * - Campaign view: tabs (Campaign | Brand | Agents)
 * - Sidebar is read-only; "Edit" opens full-page views
 * - Campaign data is loaded from localStorage for now
 * - Agent data is front-end only (localStorage) for now
 */
export default function RightSidebar({
  isOpen,
  setIsOpen,
  activeContext,
  mode = "campaign", // "campaign" | "brand"
  campaignId,
}) {
  const router = useRouter();
  const { companyData, loading: companyLoading } = useCompany();

  const showCampaignUI = mode === "campaign";
  const [tab, setTab] = useState(showCampaignUI ? "campaign" : "brand");
  const [campaign, setCampaign] = useState(null);

  const [agents, setAgents] = useState([]);
  const [agentActivity, setAgentActivity] = useState([]);

  // Keep tab sensible if caller changes mode
  useEffect(() => {
    setTab(mode === "campaign" ? "campaign" : "brand");
  }, [mode]);

  // Load campaign from localStorage (front-end only)
  useEffect(() => {
    if (mode !== "campaign") return;

    const id = String(campaignId || activeContext || "");
    if (!id) return;

    try {
      const byIdRaw = localStorage.getItem("campaignsById");
      if (byIdRaw) {
        const byId = JSON.parse(byIdRaw);
        if (byId && byId[id]) {
          setCampaign({ id, ...byId[id] });
          return;
        }
      }

      const listRaw = localStorage.getItem("campaigns");
      if (listRaw) {
        const list = JSON.parse(listRaw);
        const found =
          Array.isArray(list) &&
          list.find((c) => String(c?._id || c?.id) === id);

        if (found) {
          setCampaign({ ...found, id });
          return;
        }
      }

      setCampaign({ id, name: "Untitled campaign" });
    } catch {
      setCampaign({ id, name: "Untitled campaign" });
    }
  }, [mode, campaignId, activeContext]);

  const activeCampaignKey = useMemo(() => {
    const id = String(campaignId || activeContext || "");
    return id || null;
  }, [campaignId, activeContext]);

  // Load agents (front-end only)
  useEffect(() => {
    if (!showCampaignUI) return;
    if (!activeCampaignKey) return;

    const fallbackDefaults = getDefaultAgents();

    try {
      // Option A: single map object
      const mapRaw = localStorage.getItem("agentsByCampaign");
      if (mapRaw) {
        const map = JSON.parse(mapRaw);
        const list = map?.[activeCampaignKey];
        if (Array.isArray(list) && list.length) {
          const normalized = normalizeAgents(list);
          setAgents(normalized);
          setAgentActivity(buildActivityFromAgents(normalized));
          return;
        }
      }

      // Option B: per-campaign key
      const perRaw = localStorage.getItem(
        `agentsByCampaignId:${activeCampaignKey}`
      );
      if (perRaw) {
        const list = JSON.parse(perRaw);
        if (Array.isArray(list) && list.length) {
          const normalized = normalizeAgents(list);
          setAgents(normalized);
          setAgentActivity(buildActivityFromAgents(normalized));
          return;
        }
      }

      setAgents(fallbackDefaults);
      setAgentActivity(buildActivityFromAgents(fallbackDefaults));
    } catch {
      setAgents(fallbackDefaults);
      setAgentActivity(buildActivityFromAgents(fallbackDefaults));
    }
  }, [showCampaignUI, activeCampaignKey]);

  const brandName = useMemo(
    () => companyData?.brandName || "Your brand",
    [companyData]
  );

  const close = () => setIsOpen?.(false);

  const goBrandFullPage = () => {
    router.push("/chat/brand-details");
    close();
  };

  const goCampaignFullPage = () => {
    const id = String(campaignId || activeContext || "");
    if (!id) return;
    router.push(`/chat/campaign/${id}/edit`);
    close();
  };

  const goAgentFullPage = () => {
    const id = String(campaignId || activeContext || "");
    if (!id) return;
    router.push(`/chat/campaign/${id}/agents`);
    close();
  };

  // Demo: simulate an agent run (front-end only)
  const simulateRun = (agentId) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              status: "running",
              lastUpdatedAt: new Date().toISOString(),
              outputSummary: "Working…",
            }
          : a
      )
    );

    setTimeout(() => {
      setAgents((prev) => {
        const next = prev.map((a) =>
          a.id === agentId
            ? {
                ...a,
                status: "completed",
                lastUpdatedAt: new Date().toISOString(),
                lastOutputAt: new Date().toISOString(),
                outputSummary: getFakeOutputSummary(agentId),
              }
            : a
        );
        setAgentActivity(buildActivityFromAgents(next));
        return next;
      });
    }, 900);
  };

  const simulateReset = (agentId) => {
    setAgents((prev) => {
      const next = prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              status: "queued",
              lastUpdatedAt: new Date().toISOString(),
              outputSummary: "",
              lastOutputAt: null,
            }
          : a
      );
      setAgentActivity(buildActivityFromAgents(next));
      return next;
    });
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-gray-50 border-l flex flex-col transition-transform
      ${isOpen ? "translate-x-0" : "translate-x-full"} lg:relative lg:translate-x-0`}
    >
      {/* HEADER */}
      <div className="h-16 border-b flex items-center justify-between px-5 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Layout className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-gray-700 truncate">
            {showCampaignUI ? "Context" : "Brand Details"}
          </h3>
        </div>

        <button
          onClick={close}
          className="lg:hidden text-gray-400 hover:bg-gray-100 p-1 rounded-full"
          aria-label="Close right sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* TABS */}
      {showCampaignUI && (
        <div className="px-4 pt-4">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
            <button
              onClick={() => setTab("campaign")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition ${
                tab === "campaign"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Campaign
            </button>
            <button
              onClick={() => setTab("brand")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition ${
                tab === "brand"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Brand
            </button>
            <button
              onClick={() => setTab("agents")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition ${
                tab === "agents"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Agents
            </button>
          </div>
        </div>
      )}

      {/* CONTENT (keep spacing consistent with right-nav) */}
      <div className="px-4 pb-4 pt-4 space-y-4 overflow-y-auto flex-1">
        {/* CAMPAIGN TAB */}
        {showCampaignUI && tab === "campaign" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Campaign</div>
                <div className="text-base font-semibold text-gray-900 truncate">
                  {campaign?.name || "Untitled campaign"}
                </div>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  ID: {String(campaign?.id || campaignId || activeContext || "")}
                </div>
              </div>

              <button
                onClick={goCampaignFullPage}
                className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <InfoRow
                icon={Target}
                label="Objective"
                value={campaign?.objective || "Not set"}
              />
              <InfoRow
                icon={Tag}
                label="Primary goal"
                value={campaign?.primaryGoal || "Not set"}
              />
              <InfoRow
                label="Success metric"
                value={campaign?.successMetric || "Not set"}
              />
              <InfoRow
                label="Timeframe"
                value={campaign?.timeframe || campaign?.goalTimeframe || "Not set"}
              />
              <InfoRow
                label="Primary channel"
                value={campaign?.channel || "Not set"}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 leading-snug">
                This sidebar is read-only. Use <b>Edit</b> to update campaign
                details in the full-page editor.
              </div>
            </div>
          </div>
        )}

        {/* BRAND TAB */}
        {(!showCampaignUI || tab === "brand") && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Brand</div>
                <div className="text-base font-semibold text-gray-900 truncate">
                  {brandName}
                </div>
                {companyData?.industry ? (
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    Industry: {companyData.industry}
                  </div>
                ) : null}
              </div>

              <button
                onClick={goBrandFullPage}
                className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Edit
              </button>
            </div>

            {companyLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading brand…
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <InfoRow
                  label="Target audience"
                  value={companyData?.targetAudience || "Not set"}
                />
                <InfoRow
                  label="Mission"
                  value={companyData?.mission || "Not set"}
                />
                <InfoRow label="Vision" value={companyData?.vision || "Not set"} />
                <InfoRow
                  label="Primary goal"
                  value={companyData?.primaryGoal || "Not set"}
                />
                <InfoRow
                  label="Website"
                  value={companyData?.website || "Not set"}
                />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 leading-snug">
                Brand details are shared across campaigns. Edit them in the
                full-page brand details screen.
              </div>
            </div>
          </div>
        )}

        {/* AGENTS TAB (moved into subcomponent) */}
        {showCampaignUI && tab === "agents" && (
          <AgentsSidebarPanel
            agents={agents}
            activity={agentActivity}
            onRun={simulateRun}
            onReset={simulateReset}
            onViewAll={goAgentFullPage}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Subcomponent: Agents panel for right sidebar
---------------------------------------------- */
function AgentsSidebarPanel({ agents, activity, onRun, onReset, onViewAll }) {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Agents</div>
            <div className="text-base font-semibold text-gray-900 truncate">
              Agent activity
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Run modules that generate Google Ads assets.
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {agents.map((a) => (
            <AgentRow
              key={a.id}
              agent={a}
              onRun={() => onRun(a.id)}
              onReset={() => onReset(a.id)}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 leading-snug">
            Suggested order: <b>Strategy</b> → <b>Keywords</b> → <b>Copy</b> →
            <b> Policy</b>.
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="text-sm font-semibold text-gray-900">Recent activity</div>
        <div className="mt-3 space-y-2">
          {activity?.length ? (
            activity.slice(0, 6).map((row, idx) => (
              <div
                key={`${row.at}-${idx}`}
                className="text-xs text-gray-600 flex items-center justify-between gap-3"
              >
                <span className="truncate">{row.text}</span>
                <span className="shrink-0 text-gray-400">{row.at}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">
              No activity yet. Run an agent to generate outputs.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------
   Subcomponent: compact agent row (fits sidebar)
---------------------------------------------- */
function AgentRow({ agent, onRun, onReset }) {
  const { Icon, statusPill } = useMemo(() => {
    const iconMap = {
      strategy: Brain,
      keywords: Search,
      copy: PencilLine,
      policy: ShieldCheck,
      optimizer: BarChart3,
    };

    const statusMap = {
      queued: {
        label: "Queued",
        cls: "bg-gray-100 text-gray-700 border-gray-200",
        dot: Clock,
      },
      running: {
        label: "Running",
        cls: "bg-blue-50 text-blue-700 border-blue-200",
        dot: Loader2,
        spin: true,
      },
      completed: {
        label: "Done",
        cls: "bg-green-50 text-green-700 border-green-200",
        dot: CheckCircle2,
      },
      error: {
        label: "Needs input",
        cls: "bg-yellow-50 text-yellow-800 border-yellow-200",
        dot: AlertTriangle,
      },
    };

    const Dot = statusMap[agent.status]?.dot || Clock;
    const dotSpin = Boolean(statusMap[agent.status]?.spin);

    return {
      Icon: iconMap[agent.id] || Brain,
      statusPill: (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full border ${
            statusMap[agent.status]?.cls || statusMap.queued.cls
          }`}
        >
          <Dot className={`w-3.5 h-3.5 ${dotSpin ? "animate-spin" : ""}`} />
          {statusMap[agent.status]?.label || "Queued"}
        </span>
      ),
    };
  }, [agent.id, agent.status]);

  return (
    <div className="border border-gray-200 rounded-2xl p-3 bg-white">
      {/* HEADER + CONTENT */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-gray-700" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {agent.name}
                </div>
                {statusPill}
              </div>

              {agent.description && (
                <div className="text-xs text-gray-600 mt-0.5 truncate">
                  {agent.description}
                </div>
              )}
            </div>
          </div>

          {/* OUTPUT */}
          {agent.outputSummary ? (
            <div className="mt-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-800">Last output</span>
                {agent.lastOutputAt && (
                  <span className="text-gray-400">
                    {formatMiniTime(agent.lastOutputAt)}
                  </span>
                )}
              </div>
              <div className="mt-1">{agent.outputSummary}</div>
            </div>
          ) : (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5" />
              No output yet
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onRun}
            disabled={agent.status === "running"}
            className="h-9 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run
          </button>

          <button
            onClick={onReset}
            className="h-9 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => alert("View output (placeholder)")}
            className="h-9 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-gray-700" />
        </div>
      ) : (
        <div className="w-9 h-9 shrink-0" />
      )}

      <div className="min-w-0">
        <div className="text-[11px] font-bold text-gray-500 uppercase">
          {label}
        </div>
        <div className="text-sm text-gray-800 break-words">{value}</div>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function getDefaultAgents() {
  const now = new Date().toISOString();
  return [
    {
      id: "strategy",
      name: "Strategy Agent",
      description: "Turns brand + campaign into a plan",
      status: "queued",
      lastUpdatedAt: now,
      outputSummary: "",
    },
    {
      id: "keywords",
      name: "Keyword Agent",
      description: "Builds keyword themes + clusters",
      status: "queued",
      lastUpdatedAt: now,
      outputSummary: "",
    },
    {
      id: "copy",
      name: "Copy Agent",
      description: "Writes headlines + descriptions",
      status: "queued",
      lastUpdatedAt: now,
      outputSummary: "",
    },
    {
      id: "policy",
      name: "Policy Agent",
      description: "Flags Google Ads policy risks",
      status: "queued",
      lastUpdatedAt: now,
      outputSummary: "",
    },
    {
      id: "optimizer",
      name: "Optimizer Agent",
      description: "Suggests structure + experiments",
      status: "queued",
      lastUpdatedAt: now,
      outputSummary: "",
    },
  ];
}

function normalizeAgents(list) {
  if (!Array.isArray(list)) return getDefaultAgents();
  return list.map((a) => ({
    id: a?.id || a?._id || cryptoSafeId(),
    name: a?.name || "Agent",
    description: a?.description || "",
    status: a?.status || "queued",
    lastUpdatedAt: a?.lastUpdatedAt || null,
    outputSummary: a?.outputSummary || "",
    lastOutputAt: a?.lastOutputAt || null,
  }));
}

function buildActivityFromAgents(list) {
  try {
    const format = (d) =>
      new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const rows = (Array.isArray(list) ? list : [])
      .filter((a) => a?.lastUpdatedAt)
      .sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
      .slice(0, 8)
      .map((a) => ({
        text: `${a.name} • ${a.status}`,
        at: format(a.lastUpdatedAt),
      }));

    return rows.length ? rows : [];
  } catch {
    return [];
  }
}

function formatMiniTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function getFakeOutputSummary(agentId) {
  switch (agentId) {
    case "strategy":
      return "Objective: Lead Gen • 2 ad groups • CTA: Get Quote";
    case "keywords":
      return "5 clusters • 42 keywords • top: “near me”, “same-day”";
    case "copy":
      return "12 headlines • 6 descriptions • 3 CTA variants";
    case "policy":
      return "No major violations • 2 warnings w/ rewrites";
    case "optimizer":
      return "Budget split suggestion + 2 experiments";
    default:
      return "Output generated.";
  }
}

function cryptoSafeId() {
  try {
    return globalThis.crypto?.randomUUID?.() || `id_${Math.random().toString(16).slice(2)}`;
  } catch {
    return `id_${Math.random().toString(16).slice(2)}`;
  }
}
