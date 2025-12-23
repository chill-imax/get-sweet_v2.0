"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Check,
  Globe,
  AlertCircle,
} from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import ConnectGoogleAdsBtn from "@/components/chat/campaign/ConnectGoogleAdsBtn";
import LocationPicker from "@/components/ui/inputs/LocationPicker";
import LanguagePicker from "@/components/ui/inputs/LanguagePicker";
import { useAuth } from "@/context/useContext";
import {
  CAMPAIGN_OBJECTIVES,
  TIMEFRAMES,
  PRIMARY_GOALS,
} from "@/components/utils/campaignOptions";
import { CurrencyInput } from "@/components/ui/inputs/CurrencyInput";

// --- COMPONENTES UI LOCALES ---
const Label = ({ children, required }) => (
  <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
    {children}
    {required && <span className="text-red-500 text-xs">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, required }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full h-11 px-3 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 transition-all 
      ${
        required && !value
          ? "border-amber-200 focus:border-amber-400 bg-amber-50/30"
          : "border-gray-200 focus:ring-purple-200"
      }`}
  />
);

const Select = ({ value, onChange, options, required, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full h-11 px-3 rounded-xl border bg-white text-sm text-gray-900 outline-none focus:ring-2 transition-all appearance-none cursor-pointer
        ${
          required && !value
            ? "border-amber-200 focus:border-amber-400 bg-amber-50/30"
            : "border-gray-200 focus:ring-purple-200"
        }`}
    >
      <option value="" disabled>
        {placeholder || "Select option"}
      </option>
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
    {/* Flechita SVG */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
);

// --- CONSTANTES ---
const CHANNEL_OPTIONS = [
  "Google Search",
  "Website",
  "Email",
  "Social",
  "YouTube",
  "Display",
];
const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Bold",
  "Witty",
  "Urgent",
  "Empathetic",
  "Direct",
];
const STATUS_OPTIONS = [
  "planning",
  "draft",
  "active",
  "paused",
  "completed",
  "archived",
];

export default function CampaignEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const campaignId = String(id);

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const headerTitle = useMemo(() => "Edit campaign", []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [googleAdsData, setGoogleAdsData] = useState(null);

  // ESTADO DEL FORMULARIO
  const [form, setForm] = useState({
    name: "",
    objective: "",
    landingUrl: "",
    channels: [],
    geo: "",
    budget: "",
    targetAudience: "",
    primaryKpi: "leads",
    tone: "Professional",
    status: "planning",
    primaryGoal: "",
    successMetric: "",
    timeframe: "",
    language: "English", // Agregado campo idioma
  });

  // SNAPSHOT PARA DIRTY CHECKING
  const [originalForm, setOriginalForm] = useState(null);

  // ========================================================================
  // 1. CARGA DE DATOS
  // ========================================================================
  useEffect(() => {
    if (!token || !campaignId) return;

    const loadAllData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const [campRes, compRes] = await Promise.all([
          fetch(`${apiUrl}/api/v1/campaigns/${campaignId}`, { headers }),
          fetch(`${apiUrl}/api/v1/company/profile`, { headers }),
        ]);

        const campData = await campRes.json();

        let companyData = { primaryGoal: "", successMetric: "", timeframe: "" };
        if (compRes.ok) {
          const rawComp = await compRes.json();
          const compObj = Array.isArray(rawComp)
            ? rawComp[0]
            : rawComp.data || rawComp;
          if (compObj) {
            companyData = {
              primaryGoal: compObj.primaryGoal || "",
              successMetric: compObj.successMetric || "",
              timeframe: compObj.timeframe || "",
            };
            if (compObj.googleAds) setGoogleAdsData(compObj.googleAds);
          }
        }

        const loadedForm = {
          name: campData.name || "",
          objective: campData.objective || "",
          landingUrl: campData.landingPageUrl || "",
          channels: Array.isArray(campData.channels)
            ? campData.channels
            : ["Google Search"],
          geo: campData.geo || "",
          budget: campData.budget || "",
          targetAudience: campData.targetAudience || "",
          primaryKpi: campData.primaryKpi || "leads",
          tone: campData.tone || "Professional",
          status: campData.status || "planning",
          language: campData.language || "English",
          primaryGoal: companyData.primaryGoal,
          successMetric: companyData.successMetric,
          timeframe: companyData.timeframe,
        };

        setForm(loadedForm);
        setOriginalForm(JSON.parse(JSON.stringify(loadedForm))); // Snapshot inicial
      } catch (err) {
        console.error("❌ Error loading data:", err);
        setToast({ type: "error", message: "Failed to load data" });
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [campaignId, token]);

  // ========================================================================
  // VALIDACIONES & DIRTY CHECKING
  // ========================================================================

  // 1. Campos obligatorios no vacíos
  const isFormValid =
    form.name?.trim() &&
    form.objective &&
    form.landingUrl?.trim() &&
    form.geo?.trim() &&
    form.budget &&
    form.language;

  // 2. ¿Hay cambios respecto al original?
  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  // 3. ¿Podemos guardar?
  const canSave = isFormValid && hasChanges && !saving;

  // ========================================================================
  // HANDLERS
  // ========================================================================
  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const toggleChannel = (channel) => {
    setForm((prev) => {
      const current = prev.channels || [];
      return current.includes(channel)
        ? { ...prev, channels: current.filter((c) => c !== channel) }
        : { ...prev, channels: [...current, channel] };
    });
  };

  async function handleSave(e) {
    e.preventDefault();
    if (!canSave) return; // Doble check de seguridad

    setToast(null);
    setSaving(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const campaignPayload = {
        name: form.name,
        objective: form.objective,
        landingPageUrl: form.landingUrl,
        geo: form.geo,
        budget: form.budget,
        channels: form.channels,
        targetAudience: form.targetAudience,
        primaryKpi: form.primaryKpi,
        tone: form.tone,
        status: form.status,
        language: form.language, // No olvidar idioma
      };

      const companyPayload = {
        primaryGoal: form.primaryGoal,
        successMetric: form.successMetric,
        timeframe: form.timeframe,
      };

      await Promise.all([
        fetch(`${apiUrl}/api/v1/campaigns/${campaignId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(campaignPayload),
        }),
        fetch(`${apiUrl}/api/v1/company/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(companyPayload),
        }),
      ]);

      setToast({ type: "success", message: "Changes saved successfully!" });

      // ✅ ACTUALIZAR SNAPSHOT AL NUEVO ESTADO
      setOriginalForm(JSON.parse(JSON.stringify(form)));

      setTimeout(() => setToast(null), 2500);
    } catch (e2) {
      console.error(e2);
      setToast({ type: "error", message: "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={campaignId}
        setActiveContext={(ctx) =>
          ctx === "general"
            ? router.push("/chat")
            : router.push(`/chat/campaign/${ctx}`)
        }
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={campaignId}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <button
              onClick={() => router.push(`/chat/campaign/${campaignId}`)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to campaign
            </button>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold text-gray-900">
                  Campaign Settings
                </div>
                {/* Indicador de estado */}
                <div className="text-sm flex items-center gap-2">
                  {!isFormValid ? (
                    <span className="text-amber-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> Incomplete
                    </span>
                  ) : hasChanges ? (
                    <span className="text-purple-600 flex items-center gap-1 font-medium animate-pulse">
                      Unsaved changes
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>
              </div>

              {toast && (
                <div
                  className={`mt-4 text-sm rounded-xl p-3 border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
                    toast.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      toast.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {toast.message}
                </div>
              )}

              <form onSubmit={handleSave} className="mt-6 space-y-8">
                {/* --- 1. CORE DETAILS --- */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Core Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label required>Campaign Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label required>Objective</Label>
                      <Select
                        value={form.objective}
                        onChange={(e) => setField("objective", e.target.value)}
                        options={CAMPAIGN_OBJECTIVES} // ✅ Usando lista estandarizada
                        placeholder="Select objective..."
                        required
                      />
                    </div>
                    <div>
                      <Label required>Landing Page URL</Label>
                      <Input
                        value={form.landingUrl}
                        onChange={(e) => setField("landingUrl", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* --- 2. CONFIGURATION --- */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <LocationPicker
                        value={form.geo}
                        onChange={(val) => setField("geo", val)}
                      />
                    </div>

                    <div>
                      <LanguagePicker
                        value={form.language}
                        onChange={(val) => setField("language", val)}
                      />
                    </div>

                    <div>
                      <Label required>Budget daily (USD)</Label>
                      <CurrencyInput
                        value={form.budget}
                        onChange={(val) => setField("budget", val)}
                        required={true}
                        placeholder="50.00"
                      />
                    </div>

                    <div>
                      <Label>Target Audience</Label>
                      <Input
                        value={form.targetAudience}
                        onChange={(e) =>
                          setField("targetAudience", e.target.value)
                        }
                        placeholder="e.g. Small business owners"
                      />
                    </div>

                    <div>
                      <Label>Status</Label>
                      <Select
                        value={form.status}
                        onChange={(e) => setField("status", e.target.value)}
                        options={STATUS_OPTIONS}
                      />
                    </div>
                  </div>

                  {/* Channels */}
                  <div>
                    <Label>Channels</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {CHANNEL_OPTIONS.map((opt) => {
                        const isSelected = form.channels.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleChannel(opt)}
                            className={`h-9 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                              isSelected
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* --- 3. INTEGRATIONS --- */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Integrations
                  </h3>
                  <ConnectGoogleAdsBtn googleAdsData={googleAdsData} />
                </div>

                {/* --- 4. GOALS (GLOBAL) --- */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
                    <Globe className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-indigo-800 leading-snug">
                      <strong>Global Brand Goals:</strong> Updating these fields
                      will affect your entire Company Profile.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Primary Goal</Label>
                      <Select
                        value={form.primaryGoal}
                        onChange={(e) =>
                          setField("primaryGoal", e.target.value)
                        }
                        options={PRIMARY_GOALS} // ✅ Utils
                      />
                    </div>
                    <div>
                      <Label>Success Metric</Label>
                      <Input
                        value={form.successMetric}
                        onChange={(e) =>
                          setField("successMetric", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Timeframe</Label>
                      <Select
                        value={form.timeframe}
                        onChange={(e) => setField("timeframe", e.target.value)}
                        options={TIMEFRAMES} // ✅ Utils
                      />
                    </div>
                  </div>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="pt-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white pb-4 z-10">
                  <button
                    type="button"
                    onClick={() => router.push(`/chat/campaign/${campaignId}`)}
                    className="h-11 px-6 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSave} // 🔒 BLOQUEO INTELIGENTE
                    title={
                      !isFormValid
                        ? "Fill all required fields *"
                        : !hasChanges
                        ? "No changes detected"
                        : "Save Changes"
                    }
                    className={`h-11 px-6 rounded-xl text-white text-sm font-semibold inline-flex items-center gap-2 shadow-lg transition-all 
                        ${
                          canSave
                            ? "bg-gray-900 hover:bg-gray-800 hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        }`}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={campaignId}
        mode="campaign"
        campaignId={campaignId}
      />
    </div>
  );
}
