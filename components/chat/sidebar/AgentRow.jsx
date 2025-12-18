"use client";

import { useMemo } from "react";
import { Play, RotateCcw, Eye, ChevronRight, Brain, Clock } from "lucide-react";
import {
  formatMiniTime,
  AGENT_ICONS,
  AGENT_STATUS_CONFIG,
} from "./sidebar-utils";

export default function AgentRow({ agent, onRun, onReset }) {
  const { Icon, statusPill } = useMemo(() => {
    // Obtener configuración visual desde utils o defaults
    const StatusConfig =
      AGENT_STATUS_CONFIG[agent.status] || AGENT_STATUS_CONFIG.queued;
    const AgentIcon = AGENT_ICONS[agent.id] || Brain;
    const Dot = StatusConfig.dot || Clock;
    const dotSpin = Boolean(StatusConfig.spin);

    return {
      Icon: AgentIcon,
      statusPill: (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full border ${StatusConfig.cls}`}
        >
          <Dot className={`w-3.5 h-3.5 ${dotSpin ? "animate-spin" : ""}`} />
          {StatusConfig.label}
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
