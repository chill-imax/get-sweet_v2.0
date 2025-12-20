"use client";

import { useState } from "react";
import { Loader2, Save, Layers, Cpu, Sparkles, RefreshCw } from "lucide-react";
import ConnectGoogleAdsBtn from "@/components/chat/campaign/ConnectGoogleAdsBtn";
import AdGroupsReview from "@/components/chat/campaign/AdGroupsReview";
import GeneratedResults from "@/components/chat/campaign/GeneratedResults"; // 👈 Asegúrate de importar este

const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <div className="text-[11px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
      {label}
    </div>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-200 transition-all"
    />
  </div>
);

export default function SettingsPanel({
  campaignDetails,
  setCampaignDetails,
  adGroups,
  setAdGroups,
  generatedData,
  onGenerateDraft,
  onSave,
  isSaving,
  googleAdsData,
  isGenerating,
}) {
  const [viewMode, setViewMode] = useState("simple"); // 'simple' | 'expert'

  const handleDetailChange = (key, value) => {
    setCampaignDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="px-6 py-6 space-y-6 pb-24 max-w-4xl mx-auto">
      {/* --- HEADER + TOGGLE DE MODO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Setup</h1>
          <p className="text-gray-500 text-sm">
            Configure your AI agent strategy.
          </p>
        </div>

        {/* 🎚️ UI TOGGLE (Simple vs Expert) */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner self-start md:self-auto">
          <button
            onClick={() => setViewMode("simple")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              viewMode === "simple"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Layers className="w-4 h-4" />
            Simple
          </button>
          <button
            onClick={() => setViewMode("expert")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              viewMode === "expert"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Expert
          </button>
        </div>
      </div>

      {/* --- BLOQUE 1: CAMPAIGN SETTINGS --- */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-base font-semibold text-gray-900">
              Campaign Configuration
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Core settings that define your campaign strategy.
            </div>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="h-10 px-5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-5">
          <InputField
            label="Campaign name"
            value={campaignDetails.name}
            onChange={(e) => handleDetailChange("name", e.target.value)}
            placeholder="e.g., Q4 Lead Generation"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Objective"
              value={campaignDetails.objective}
              onChange={(e) => handleDetailChange("objective", e.target.value)}
              placeholder="e.g., Leads / Sales"
            />
            <InputField
              label="Landing page URL"
              value={campaignDetails.landingUrl}
              onChange={(e) => handleDetailChange("landingUrl", e.target.value)}
              placeholder="https://yourbusiness.com/offer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InputField
              label="Geo Location"
              value={campaignDetails.geo}
              onChange={(e) => handleDetailChange("geo", e.target.value)}
              placeholder="e.g., New York, NY"
            />
            <InputField
              label="Language"
              value={campaignDetails.language}
              onChange={(e) => handleDetailChange("language", e.target.value)}
              placeholder="e.g., English"
            />
            <InputField
              label="Daily Budget"
              value={campaignDetails.budget}
              onChange={(e) => handleDetailChange("budget", e.target.value)}
              placeholder="e.g., 50"
            />
          </div>

          {/* 🔒 CAMPOS SOLO VISIBLES EN MODO EXPERTO */}
          {viewMode === "expert" && (
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mt-4 animate-in fade-in slide-in-from-top-2">
              <div className="text-xs font-bold text-indigo-800 uppercase mb-3 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Advanced Settings
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Bid Strategy"
                  value={campaignDetails.bidStrategy || "Max Conversions"}
                  onChange={(e) =>
                    handleDetailChange("bidStrategy", e.target.value)
                  }
                  placeholder="e.g. Target CPA"
                />
                <InputField
                  label="Negative Keywords (Global)"
                  value={campaignDetails.globalNegatives || ""}
                  onChange={(e) =>
                    handleDetailChange("globalNegatives", e.target.value)
                  }
                  placeholder="comma, separated, values"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- BLOQUE 2: INTEGRATIONS --- */}
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <div className="text-base font-semibold text-gray-900">
            Platform Integrations
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Connect your ad accounts to sync generated assets directly.
          </div>
        </div>
        <ConnectGoogleAdsBtn googleAdsData={googleAdsData} />
      </div>

      {/* --- BLOQUE 3: LA LÓGICA DE GENERACIÓN --- */}

      {/* CONDICIONAL A: Si NO hay data generada (o está vacía), 
          mostramos el formulario para crear grupos (Input) 
      */}
      {!generatedData && (
        <AdGroupsReview
          adGroups={adGroups}
          setAdGroups={setAdGroups}
          onGenerateDraft={onGenerateDraft}
          viewMode={viewMode} // 👈 Pasamos el lente simple/experto
          isGenerating={isGenerating} // 👈 Pasamos el loading al botón interno
        />
      )}

      {/* CONDICIONAL B: Si YA hay data generada, 
          ocultamos el input y mostramos el resultado (Output) 
      */}
      {generatedData && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          {/* Header de la sección de resultados */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Generated Campaign
            </h2>
            {/* Botón para Regenerar (Volver a llamar a la IA) */}
            <button
              onClick={onGenerateDraft}
              disabled={isGenerating}
              className="text-xs text-gray-500 hover:text-purple-600 flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg bg-white transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`}
              />
              Regenerate
            </button>
          </div>

          {/* Componente visualizador del JSON (Keywords, Ads, Extensions) */}
          <GeneratedResults structure={generatedData} viewMode={viewMode} />
        </div>
      )}
    </div>
  );
}
