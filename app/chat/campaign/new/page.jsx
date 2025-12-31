"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Rocket,
  Check,
  AlertCircle,
} from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import { useAuth } from "@/context/useContext";
import api from "@/app/api/auth/axios"; // ✅ Importación de Axios centralizado

// Componentes Custom
import LocationPicker from "@/components/ui/inputs/LocationPicker";
import { CurrencyInput } from "@/components/ui/inputs/CurrencyInput";
import {
  CAMPAIGN_OBJECTIVES,
  TONE_OPTIONS,
  KPI_OPTIONS,
  CHANNELS,
} from "@/components/utils/campaignOptions";

// --- COMPONENTES UI LOCALES ---
const Label = ({ children, required }) => (
  <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
    {children}
    {required && <span className="text-red-500 text-xs">*</span>}
  </label>
);

const Input = ({ value, onChange, placeholder, required, autoFocus }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    autoFocus={autoFocus}
    className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 transition-all 
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
      className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-gray-900 outline-none focus:ring-2 transition-all appearance-none cursor-pointer
        ${
          required && !value
            ? "border-amber-200 focus:border-amber-400 bg-amber-50/30"
            : "border-gray-200 focus:ring-purple-200"
        }`}
    >
      <option value="" disabled>
        {placeholder || "Select an option"}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.emoji ? `${opt.emoji} ` : ""}
          {opt.label}
        </option>
      ))}
    </select>
    {/* Flechita */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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

export default function NewCampaignPage() {
  const router = useRouter();
  const { token } = useAuth(); // Solo para check rápido de UX, no para headers

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const headerTitle = useMemo(() => "New campaign", []);

  // Form States
  const [name, setName] = useState("");
  const [tone, setTone] = useState("Professional");
  const [objective, setObjective] = useState("");
  const [channels, setChannels] = useState(["Google Search"]);
  const [audience, setAudience] = useState("");
  const [primaryKpi, setPrimaryKpi] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [geo, setGeo] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // VALIDACIÓN: Todos requeridos menos Audience
  const isFormValid =
    name.trim() &&
    tone &&
    objective &&
    primaryKpi &&
    landingUrl.trim() &&
    geo.trim() &&
    budget &&
    channels.length > 0;

  function toggleChannel(id) {
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!isFormValid) return; // Doble check

    setError("");
    if (!token) {
      setError("You must be signed in to create a campaign.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        tone,
        objective,
        channels,
        targetAudience: audience.trim(),
        primaryKpi,
        landingPageUrl: landingUrl.trim(),
        geo: geo.trim(),
        budget: budget.toString(), // Asegurar string
      };

      // ✅ Axios: URL base ya configurada, headers automáticos
      const res = await api.post("/api/v1/campaigns", payload);

      const responseJson = res.data; // Axios entrega el body en .data

      const campaignId = responseJson.data?._id;
      if (!campaignId) {
        throw new Error("Campaign created, but no ID returned from server");
      }

      router.push(`/chat/campaign/${campaignId}`);
    } catch (err) {
      console.error(err);
      // ✅ Manejo de errores de Axios
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error creating campaign. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={"new_campaign"}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => {}}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/chat")}
                className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold">
                <Rocket className="w-4 h-4" />
                Campaign creation
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-semibold text-gray-900">
              Create a new campaign
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Define the core strategy. Don&apos;t worry, you can refine this
              with AI later.
            </p>

            {/* FORMULARIO */}
            <form onSubmit={handleCreate} className="mt-8 space-y-6">
              {/* BLOQUE 1: BASIC INFO */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="grid gap-6">
                  <div>
                    <Label required>Campaign name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Winter Promo 2025"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label required>Tone of Voice</Label>
                      <Select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        options={TONE_OPTIONS}
                        required
                        placeholder="Select tone..."
                      />
                    </div>

                    <div>
                      <Label required>Primary KPI</Label>
                      <Select
                        value={primaryKpi}
                        onChange={(e) => setPrimaryKpi(e.target.value)}
                        options={KPI_OPTIONS}
                        required
                        placeholder="Select main metric..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOQUE 2: OBJETIVO (VISUAL CARDS) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <Label required>Campaign Objective</Label>
                <p className="mb-4 text-xs text-gray-500">
                  Select the main goal for this campaign.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAMPAIGN_OBJECTIVES.map((o) => {
                    const active = objective === o.value;
                    return (
                      <button
                        type="button"
                        key={o.value}
                        onClick={() => setObjective(o.value)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-200 relative ${
                          active
                            ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500 shadow-sm"
                            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {active && (
                          <div className="absolute top-3 right-3 text-purple-600">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{o.emoji}</div>
                          <div>
                            <div
                              className={`text-sm font-semibold ${
                                active ? "text-purple-900" : "text-gray-900"
                              }`}
                            >
                              {o.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {o.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!objective && (
                  <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Selection required
                  </div>
                )}
              </div>

              {/* BLOQUE 3: DETALLES DE ESTRATEGIA */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-800">
                    Strategy Details
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Specifics to help the AI optimize your ads.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label required>Landing URL</Label>
                    <Input
                      value={landingUrl}
                      onChange={(e) => setLandingUrl(e.target.value)}
                      placeholder="https://example.com/offer"
                      required
                    />
                  </div>

                  <div>
                    {/* ✅ LocationPicker */}
                    <LocationPicker
                      value={geo}
                      onChange={(val) => setGeo(val)}
                    />
                  </div>

                  <div>
                    <Label required>Daily Budget</Label>
                    {/* ✅ CurrencyInput */}
                    <CurrencyInput
                      value={budget}
                      onChange={(val) => setBudget(val)}
                      required={true}
                      placeholder="50.00"
                    />
                  </div>

                  <div>
                    <Label>Target Audience (Optional)</Label>
                    <Input
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="e.g. Small business owners"
                    />
                  </div>
                </div>

                {/* Channels */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Label required>Channels</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CHANNELS.map((c) => {
                      const active = channels.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleChannel(c.id)}
                          className={`h-10 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                            active
                              ? "border-purple-500 bg-purple-50 text-purple-900"
                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          {active && <Check className="w-3 h-3" />}
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                  {channels.length === 0 && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Select at least one
                      channel
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              {/* FOOTER CTA */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-gray-100 sticky bottom-0 bg-gray-50 pb-6 z-10">
                <div className="text-xs text-gray-500 hidden sm:block">
                  {!isFormValid ? (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <AlertCircle className="w-3 h-3" /> Fill all required
                      fields *
                    </span>
                  ) : (
                    "Ready to launch workspace 🚀"
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isFormValid} // 🔒 BLOQUEO
                  className={`h-12 px-8 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 ml-auto
                    ${
                      isFormValid
                        ? "bg-purple-600 text-white shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300 hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Start Campaign
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
