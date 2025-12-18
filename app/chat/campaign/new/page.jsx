"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Rocket,
  Target,
  Megaphone,
  Globe2,
  Mail,
  Smartphone,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import { useAuth } from "@/context/useContext";

const TONES = ["Professional", "Friendly", "Bold", "Urgent (Sales)"];

const OBJECTIVES = [
  {
    id: "Awareness", // Ajustado a Mayúscula para coincidir con backend enum
    title: "Awareness",
    desc: "Reach new people and increase brand visibility.",
    icon: Megaphone,
  },
  {
    id: "Lead generation",
    title: "Lead generation",
    desc: "Capture leads for sales or follow-up.",
    icon: Target,
  },
  {
    id: "Conversions",
    title: "Conversions",
    desc: "Drive purchases, bookings, or signups.",
    icon: CreditCard,
  },
  {
    id: "Retention",
    title: "Retention",
    desc: "Re-engage customers and improve repeat actions.",
    icon: ShieldCheck,
  },
];

const CHANNELS = [
  { id: "Website", label: "Website", icon: Globe2 }, // IDs ajustados para ser más legibles en backend
  { id: "Email", label: "Email", icon: Mail },
  { id: "Social", label: "Social", icon: Smartphone },
];

function CampaignCreationHelpCard() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <div className="font-semibold text-gray-800">What happens next?</div>
      <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
        <li>We create the campaign in your backend (status: planning).</li>
        <li>
          You’re redirected to{" "}
          <span className="font-mono">/chat/campaign/[id]</span>.
        </li>
        <li>The AI Strategy Agent will analyze your choices.</li>
        <li>The middle screen becomes your campaign workspace.</li>
      </ul>
      <div className="mt-3 text-xs text-gray-500 leading-snug">
        Don&apos;t worry about perfection. You can edit everything later with
        the AI.
      </div>
    </div>
  );
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [isLeftOpen, setIsLeftOpen] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [tone, setTone] = useState("Professional");
  const [objective, setObjective] = useState("Lead generation"); // Default válido
  const [channels, setChannels] = useState(["Website"]);
  const [audience, setAudience] = useState("");
  const [primaryKpi, setPrimaryKpi] = useState("");

  // Optional placeholders
  const [landingUrl, setLandingUrl] = useState("");
  const [geo, setGeo] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const headerTitle = useMemo(() => "New campaign", []);

  function toggleChannel(id) {
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  // ✅ LÓGICA CORREGIDA AQUÍ
  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a campaign name.");
      return;
    }
    if (!token) {
      setError("You must be signed in to create a campaign.");
      return;
    }

    setLoading(true);
    try {
      // 1. Preparar el Payload (Mapeo correcto Frontend -> Backend)
      const payload = {
        name: name.trim(),
        tone,
        objective,
        channels,
        targetAudience: audience.trim(), // Backend espera 'targetAudience'
        primaryKpi: primaryKpi.trim(),
        landingPageUrl: landingUrl.trim(), // Backend espera 'landingPageUrl'
        geo: geo.trim(),
        budget: budget.trim(),
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // Fallback seguro

      const res = await fetch(`${apiUrl}/api/v1/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // ✅ CORRECCIÓN: Usamos 'payload', no 'formData'
      });

      const responseJson = await res.json(); // ✅ CORRECCIÓN: Capturamos la respuesta

      if (!res.ok) {
        throw new Error(responseJson.message || "Failed to create campaign");
      }

      // 2. Extraer ID de la respuesta estructurada: { success: true, data: { _id: "..." } }
      const campaignId = responseJson.data?._id;

      if (!campaignId) {
        throw new Error("Campaign created, but no ID returned from server");
      }

      // 3. Redirección exitosa
      router.push(`/chat/campaign/${campaignId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT NAV */}
      <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />

      {/* CENTER */}
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
                className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold">
                <Rocket className="w-4 h-4" />
                Campaign creation
              </div>
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Create a campaign
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              This is a full-page flow. Start small now; expand later.
            </p>

            {/* FORM */}
            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              {/* Basics */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Campaign name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Winter Promo 2025"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
                      >
                        {TONES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Primary KPI (optional)
                      </label>
                      <input
                        value={primaryKpi}
                        onChange={(e) => setPrimaryKpi(e.target.value)}
                        placeholder="e.g., Leads/week, CAC, ROAS"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Target className="w-4 h-4 text-purple-600" />
                  Objective
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Pick one — we’ll tailor strategy + tasks around it.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OBJECTIVES.map((o) => {
                    const Icon = o.icon;
                    const active = objective === o.id;
                    return (
                      <button
                        type="button"
                        key={o.id}
                        onClick={() => setObjective(o.id)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                          active
                            ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                            : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                              active
                                ? "bg-white border-purple-200 text-purple-600 shadow-sm"
                                : "bg-gray-50 border-gray-200 text-gray-500"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div
                              className={`text-sm font-semibold ${
                                active ? "text-purple-900" : "text-gray-900"
                              }`}
                            >
                              {o.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {o.desc}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audience + Channels */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Target audience (optional)
                    </label>
                    <input
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="e.g., Homeowners in SF, SaaS marketers"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                    <p className="mt-2 text-xs text-gray-400">
                      If blank, we’ll use your brand profile audience.
                    </p>
                  </div>

                  <div>
                    <div className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Channels (optional)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {CHANNELS.map((c) => {
                        const Icon = c.icon;
                        const active = channels.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleChannel(c.id)}
                            className={`h-11 rounded-xl border text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all ${
                              active
                                ? "border-purple-500 bg-purple-50 text-purple-900"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                active ? "text-purple-600" : "text-gray-400"
                              }`}
                            />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      You can change this later.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra placeholders */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 opacity-90 hover:opacity-100 transition-opacity">
                <div className="text-sm font-semibold text-gray-800">
                  Optional setup details
                </div>
                <p className="mt-1 text-sm text-gray-500 mb-4">
                  These help the AI generate better content.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Landing URL
                    </label>
                    <input
                      value={landingUrl}
                      onChange={(e) => setLandingUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Geo / Location
                    </label>
                    <input
                      value={geo}
                      onChange={(e) => setGeo(e.target.value)}
                      placeholder="e.g., Bay Area, Global"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Budget
                    </label>
                    <input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g., $50/day"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 hidden sm:block">
                  After creation, you’ll land in the campaign workspace.
                </div>

                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="h-12 px-6 rounded-xl bg-purple-600 text-white text-sm font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-2 ml-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Campaign…
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

            <div className="mt-10">
              <CampaignCreationHelpCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
