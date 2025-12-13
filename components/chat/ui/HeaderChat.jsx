"use client";

import { Menu, Info } from "lucide-react";

export default function ChatHeader({
  headerTitle,
  activeContext,
  onOpenLeft,
  onOpenRight,
}) {
  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-white">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* BOTÓN PARA ABRIR SIDEBAR IZQUIERDO (solo móvil) */}
        <button
          onClick={onOpenLeft}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* TITULO */}
        <div>
          <h2 className="font-bold text-gray-800 text-sm lg:text-base truncate max-w-[200px]">
            {headerTitle}
          </h2>

          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block mt-1"></span>
            <span className="">online</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {activeContext !== "general" && (
          <span className="hidden lg:inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
            campaign mode
          </span>
        )}

        {/* BOTÓN PARÁ ABRIR SIDEBAR DERECHO (solo móvil) */}
        <button
          onClick={onOpenRight}
          className="lg:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-lg bg-white border border-gray-200 shadow-sm"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
