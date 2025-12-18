"use client";

import { Loader2, Save } from "lucide-react";

// ✅ 1. Definimos el componente Helper AFUERA para evitar re-renders innecesarios
const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
      {label}
    </div>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200"
    />
  </div>
);

export default function SettingsPanel({
  campaignDetails,
  setCampaignDetails,
  adGroups,
  setAdGroups,
  onGenerateDraft,
  onSave, // ✅ Recibimos la función de guardar
  isSaving, // ✅ Recibimos el estado de carga
}) {
  // --- Lógica de AdGroups (Local por ahora) ---
  function addAdGroup() {
    const next = adGroups.length + 1;
    setAdGroups((prev) => [
      ...prev,
      { id: `ag${next}`, name: `Ad Group ${next}`, theme: "" },
    ]);
  }

  function updateAdGroup(id, patch) {
    setAdGroups((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, ...patch } : ag))
    );
  }

  function removeAdGroup(id) {
    setAdGroups((prev) => prev.filter((ag) => ag.id !== id));
  }

  // Helper para simplificar el onChange
  const handleDetailChange = (key, value) => {
    setCampaignDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="px-6 py-4 space-y-4 pb-20">
      {/* --- CAMPAIGN SETTINGS --- */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        {/* Header con botón Save pequeño (visible en desktop) */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              Campaign Details
            </div>
            <div className="text-sm text-gray-600 mt-1">
              High-level info used to shape ad groups and copy.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="Campaign name"
            value={campaignDetails.name}
            onChange={(e) => handleDetailChange("name", e.target.value)}
            placeholder="e.g., Winter Lead Gen"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Objective"
              value={campaignDetails.objective}
              onChange={(e) => handleDetailChange("objective", e.target.value)}
              placeholder="e.g., leads"
            />
            <InputField
              label="Landing page URL"
              value={campaignDetails.landingUrl}
              onChange={(e) => handleDetailChange("landingUrl", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Geo"
              value={campaignDetails.geo}
              onChange={(e) => handleDetailChange("geo", e.target.value)}
              placeholder="e.g., San Mateo County"
            />
            <InputField
              label="Language"
              value={campaignDetails.language}
              onChange={(e) => handleDetailChange("language", e.target.value)}
              placeholder="e.g., English"
            />
            <InputField
              label="Budget (optional)"
              value={campaignDetails.budget}
              onChange={(e) => handleDetailChange("budget", e.target.value)}
              placeholder="e.g., $50/day"
            />
          </div>

          {/* Footer con botón Save principal */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              Changes affect future AI drafts.
            </div>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  Save settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- AD GROUPS (Local UI Only for now) --- */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">Ad groups</div>
            <div className="text-sm text-gray-600 mt-1">
              Organize keyword themes + messaging angles.
            </div>
          </div>
          <button
            type="button"
            onClick={addAdGroup}
            className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Add ad group
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {adGroups.map((ag) => (
            <div key={ag.id} className="border border-gray-200 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Name
                  </div>
                  <input
                    value={ag.name}
                    onChange={(e) =>
                      updateAdGroup(ag.id, { name: e.target.value })
                    }
                    className="w-full h-11 px-3 mb-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., Emergency plumbing"
                  />
                  <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Theme / Intent
                  </div>
                  <input
                    value={ag.theme}
                    onChange={(e) =>
                      updateAdGroup(ag.id, { theme: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g., clogged drain, emergency"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAdGroup(ag.id)}
                  className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onGenerateDraft}
            className="w-full h-11 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700"
          >
            Generate Google Ads draft
          </button>
        </div>
      </div>
    </div>
  );
}
