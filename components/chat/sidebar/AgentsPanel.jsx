"use client";

import { ExternalLink } from "lucide-react";
import AgentRow from "./AgentRow";

export default function AgentsSidebarPanel({
  agents,
  activity,
  onRun,
  onReset,
  onViewAll,
}) {
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
        <div className="text-sm font-semibold text-gray-900">
          Recent activity
        </div>
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
