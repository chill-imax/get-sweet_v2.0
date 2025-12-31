"use client";

import { Menu, Info } from "lucide-react";

// --- Subcomponente: Pildora de Estado ---
function StatusPill({ status = "none" }) {
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

// --- Componente Principal ---
export default function ChatHeader({
  headerTitle,
  activeContext,
  onOpenLeft,
  onOpenRight,

  // Status Props
  brandStatus,
  onlineLabel = "Agent Online", // Texto por defecto mejorado
  rightBadgeLabel,
  rightActions,
}) {
  // Lógica de Contexto
  const isBrandSetup = activeContext === "brand_ai"; // 👈 Solo aquí mostramos "Online"
  const isCampaign = activeContext !== "general" && !isBrandSetup;

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

          {/* ✅ CONDICIÓN ESTRICTA: Solo mostrar si es Brand Setup y no estamos editando */}
          {isBrandSetup && !rightActions && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">
                {onlineLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Actions or Badges */}
      <div className="flex items-center gap-2">
        {rightActions ? (
          /* MODO EDICIÓN: Botones inyectados (Save, Cancel, etc) */
          <>{rightActions}</>
        ) : (
          /* MODO VISUALIZACIÓN: Badges informativos */
          <>
            {/* Campaign Badge */}
            {isCampaign && (
              <span className="hidden lg:inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                {rightBadgeLabel || "Campaign Mode"}
              </span>
            )}

            {/* Brand Status Pill */}
            {brandStatus && <StatusPill status={brandStatus} />}

            {/* Mobile: Info Button */}
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
