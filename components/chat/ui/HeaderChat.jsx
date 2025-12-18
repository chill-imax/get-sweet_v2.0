"use client";

import { Menu, Info } from "lucide-react";

function StatusPill({ status = "none" }) {
  // status: "none" | "importing" | "draft_ready" | "locked" | "failed"
  const map = {
    none: { label: "Not set", cls: "bg-gray-50 text-gray-700 border-gray-200" },
    importing: {
      label: "Importing…",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    draft_ready: {
      label: "Draft ready",
      cls: "bg-amber-50 text-amber-800 border-amber-200",
    },
    locked: {
      label: "Confirmed",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    failed: {
      label: "Needs review",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const cfg = map[status] || map.none;

  return (
    <span
      className={`hidden lg:inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${cfg.cls}`}
      title={`Brand status: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}

export default function ChatHeader({
  headerTitle,
  activeContext,
  onOpenLeft,
  onOpenRight,

  // Status Props
  brandStatus,
  showOnline = true,
  onlineLabel = "online",
  rightBadgeLabel,
  rightActions,
}) {
  const isCampaign = activeContext !== "general";

  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-white z-20 relative">
      {/* LEFT: Menu & Titles */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile: open left sidebar */}
        <button
          onClick={onOpenLeft}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title + subtitle */}
        <div className="min-w-0">
          <h2 className="font-bold text-gray-800 text-sm lg:text-base truncate max-w-50 sm:max-w-md">
            {headerTitle}
          </h2>

          {/* Solo mostramos el estado online si NO estamos en modo edición  */}
          {!rightActions && showOnline ? (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block mt-1" />
              <span>{onlineLabel}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* RIGHT: Actions or Badges */}
      <div className="flex items-center gap-2">
        {rightActions ? (
          /* CASO A: Estamos editando. Mostramos los botones inyectados (Save/Cancel) */
          <>{rightActions}</>
        ) : (
          /* CASO B: Estamos navegando normal. Mostramos Badges y Pills */
          <>
            {/* Campaign badge */}
            {isCampaign ? (
              <span className="hidden lg:inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                {rightBadgeLabel || "campaign mode"}
              </span>
            ) : null}

            {/* Brand approval/status */}
            {brandStatus ? <StatusPill status={brandStatus} /> : null}

            {/* Mobile: open right sidebar (Info) */}
            <button
              onClick={onOpenRight}
              className="lg:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-lg bg-white border border-gray-200 shadow-sm"
              aria-label="Open details panel"
            >
              <Info className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
