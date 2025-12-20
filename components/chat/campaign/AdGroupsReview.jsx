"use client";

import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";

export default function AdGroupsReview({
  adGroups,
  setAdGroups,
  onGenerateDraft,
  viewMode,
  isGenerating, // 👈 Recibimos el estado de carga
}) {
  // ... (Tus funciones locales addAdGroup, removeAdGroup, updateAdGroup siguen igual)
  function addAdGroup() {
    const next = adGroups.length + 1;
    setAdGroups((prev) => [
      ...prev,
      { id: `ag${Date.now()}`, name: `Ad Group ${next}`, theme: "" },
    ]);
  }

  function removeAdGroup(id) {
    setAdGroups((prev) => prev.filter((ag) => ag.id !== id));
  }

  function updateAdGroup(id, patch) {
    setAdGroups((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, ...patch } : ag))
    );
  }

  function updateExpertField(id, field, value) {
    updateAdGroup(id, { [field]: value });
  }

  // Helper para deshabilitar inputs
  const isDisabled = isGenerating;

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all ${
        isDisabled ? "opacity-70 pointer-events-none" : "hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Ad groups Structure
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Define keyword themes & intent.
          </div>
        </div>
        <button
          type="button"
          onClick={addAdGroup}
          disabled={isDisabled} // 🔒
          className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
          Add Group
        </button>
      </div>

      {/* Lista de Grupos */}
      <div className="space-y-3">
        {adGroups.map((ag) => (
          <div
            key={ag.id}
            className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-white transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Nombre */}
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Group Name
                  </div>
                  <input
                    value={ag.name}
                    disabled={isDisabled} // 🔒
                    onChange={(e) =>
                      updateAdGroup(ag.id, { name: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm disabled:bg-gray-100"
                  />
                </div>
                {/* Tema */}
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Theme / Intent
                  </div>
                  <input
                    value={ag.theme}
                    disabled={isDisabled} // 🔒
                    onChange={(e) =>
                      updateAdGroup(ag.id, { theme: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm disabled:bg-gray-100"
                  />
                </div>
              </div>
              <button
                onClick={() => removeAdGroup(ag.id)}
                disabled={isDisabled} // 🔒
                className="mt-6 text-gray-400 hover:text-red-600 disabled:text-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* VISTA EXPERTA */}
            {viewMode === "expert" && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Manual Keywords */}
                  <div>
                    <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">
                      Manual Keywords
                    </div>
                    <textarea
                      disabled={isDisabled} // 🔒
                      className="w-full p-2 text-xs border border-indigo-100 rounded-lg bg-indigo-50/50 focus:bg-white outline-none resize-none h-20 font-mono disabled:opacity-50"
                      placeholder="+plumber +near +me"
                      value={ag.manualKeywords || ""}
                      onChange={(e) =>
                        updateExpertField(
                          ag.id,
                          "manualKeywords",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {/* Negatives */}
                  <div>
                    <div className="text-[10px] font-bold text-red-600 uppercase mb-1">
                      Group Negatives
                    </div>
                    <textarea
                      disabled={isDisabled} // 🔒
                      className="w-full p-2 text-xs border border-red-100 rounded-lg bg-red-50/50 focus:bg-white outline-none resize-none h-20 font-mono disabled:opacity-50"
                      placeholder="free, cheap, diy"
                      value={ag.negativeKeywords || ""}
                      onChange={(e) =>
                        updateExpertField(
                          ag.id,
                          "negativeKeywords",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Generar - BOTÓN CON SPINNER */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <button
          onClick={onGenerateDraft}
          disabled={isGenerating} // 🔒 Evita doble click
          className={`w-full h-12 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all 
            ${
              isGenerating
                ? "bg-gray-300 cursor-wait"
                : viewMode === "expert"
                ? "bg-gray-900 hover:bg-gray-800 hover:shadow-lg"
                : "bg-linear-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:from-purple-700 hover:to-indigo-700"
            }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Google Ads Structure...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {viewMode === "expert"
                ? "Generate Detailed Structure"
                : "Generate Campaign Draft"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
