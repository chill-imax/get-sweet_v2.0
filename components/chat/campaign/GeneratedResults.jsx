"use client";

import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Check,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function GeneratedResults({
  structure,
  viewMode,
  onDiscard,
  onApprove,
}) {
  // Validación de seguridad
  if (!structure) return null;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-10">
      {/* ==================================================
          1. ESTRATEGIA DE IA (HEADER)
         ================================================== */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🧠</span>
          <h3 className="font-bold text-indigo-900">AI Strategy</h3>
        </div>
        <p className="text-sm text-indigo-800 leading-relaxed">
          {structure.campaignStrategy ||
            "Strategy generated based on your inputs."}
        </p>
      </div>

      {/* ==================================================
          2. ESTRUCTURA DE GRUPOS DE ANUNCIOS
         ================================================== */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Generated Structure</h3>

        {structure.adGroups?.map((group, idx) => (
          <AdGroupResultCard key={idx} group={group} viewMode={viewMode} />
        ))}
      </div>

      {/* ==================================================
          3. EXTENSIONES (Solo si existen)
         ================================================== */}
      {structure.extensions?.sitelinks?.length > 0 && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-white">
          <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase">
            Extensions (Sitelinks)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {structure.extensions.sitelinks.map((link, i) => (
              <div
                key={i}
                className="text-xs p-2 bg-gray-50 rounded border border-gray-100"
              >
                <div className="font-semibold text-blue-600 truncate">
                  {link.text}
                </div>
                <div className="text-gray-500 truncate">{link.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================
          4. ACTION BAR (STICKY BOTTOM)
         ================================================== */}
      <div className="sticky bottom-4 z-10 bg-gray-900/95 backdrop-blur text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 mt-8 border border-gray-700">
        <div className="hidden md:block">
          <div className="text-sm font-bold">Review Generated Draft</div>
          <div className="text-xs text-gray-300">
            Does this look ready for Google?
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Botón Descartar */}
          <button
            onClick={onDiscard}
            className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </button>

          {/* Botón Aprobar */}
          <button
            onClick={onApprove}
            className="flex-1 md:flex-none h-10 px-6 rounded-xl bg-green-500 hover:bg-green-400 text-black text-sm font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Check className="w-4 h-4" />
            Approve & Launch
            <ArrowRight className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================================================
// SUB-COMPONENTE: TARJETA DE GRUPO DE ANUNCIOS
// ==================================================
function AdGroupResultCard({ group, viewMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header Desplegable */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Ad Group
          </div>
          <div className="text-base font-bold text-gray-900">{group.name}</div>
          <div className="flex gap-2 mt-2">
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">
              {group.keywords?.length || 0} Keywords
            </span>
            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-200">
              {group.ads?.length || 0} RSA
            </span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Cuerpo del Grupo (Detalles) */}
      {isOpen && (
        <div className="border-t border-gray-100 p-4 space-y-5 bg-gray-50/30 animate-in slide-in-from-top-2">
          {/* A. KEYWORDS */}
          <div>
            <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">
              Targeting (Keywords)
            </h5>
            <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-wrap gap-2">
              {group.keywords.map((kw, k) => (
                <span
                  key={k}
                  className={`text-xs px-2 py-1 rounded border ${
                    kw.matchType === "EXACT"
                      ? "bg-red-50 border-red-100 text-red-700"
                      : kw.matchType === "PHRASE"
                      ? "bg-yellow-50 border-yellow-100 text-yellow-700"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }`}
                >
                  {kw.matchType === "EXACT"
                    ? `[${kw.text}]`
                    : kw.matchType === "PHRASE"
                    ? `"${kw.text}"`
                    : kw.text}
                </span>
              ))}
            </div>
          </div>

          {/* B. ANUNCIOS (PREVIEW) */}
          <div>
            <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">
              Ad Preview (RSA)
            </h5>
            {group.ads.map((ad, a) => (
              <div
                key={a}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm max-w-md"
              >
                {/* Simulación Visual de Google Search */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-black font-bold text-xs">Ad</span>
                  <span className="text-xs text-gray-500">
                    · {ad.finalUrl || "thesweet.ai"}
                  </span>
                </div>
                <div className="text-xl text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight mb-1">
                  {ad.headlines[0]} | {ad.headlines[1] || ad.headlines[2]}
                </div>
                <div className="text-sm text-[#4d5156] leading-snug">
                  {ad.descriptions[0]} {ad.descriptions[1]}
                </div>

                {/* Vista Experta: Mostrar todos los assets */}
                {viewMode === "expert" && (
                  <div className="mt-4 pt-3 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 p-4 rounded-b-xl">
                    <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
                      All Assets (Rotating):
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Headlines:
                        </span>{" "}
                        {ad.headlines.join(" • ")}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Descriptions:
                        </span>{" "}
                        {ad.descriptions.join(" • ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
