import {
  Brain,
  Search,
  PencilLine,
  ShieldCheck,
  BarChart3,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function getDefaultAgents() {
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

export function normalizeAgents(list) {
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

export function buildActivityFromAgents(list) {
  try {
    const format = (d) =>
      new Date(d).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
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

export function formatMiniTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function getFakeOutputSummary(agentId) {
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

export function cryptoSafeId() {
  try {
    return (
      globalThis.crypto?.randomUUID?.() ||
      `id_${Math.random().toString(16).slice(2)}`
    );
  } catch {
    return `id_${Math.random().toString(16).slice(2)}`;
  }
}

// Configuración visual de iconos y estados para los agentes
export const AGENT_ICONS = {
  strategy: Brain,
  keywords: Search,
  copy: PencilLine,
  policy: ShieldCheck,
  optimizer: BarChart3,
};

export const AGENT_STATUS_CONFIG = {
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
