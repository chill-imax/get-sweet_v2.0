"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import { useAuth } from "@/context/useContext";

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

  // 1. Agregamos 'timeframe' al estado inicial
  const [form, setForm] = useState({
    name: "",
    objective: "",
    landingUrl: "",
    channel: "Google Search",
    geo: "",
    language: "English",
    budget: "",
    primaryGoal: "",
    successMetric: "",
    timeframe: "",
  });

  useEffect(() => {
    if (!token || !campaignId) return;

    const loadAllData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // 1. Fetch Campaña
        const campRes = await fetch(
          `${apiUrl}/api/v1/campaigns/${campaignId}`,
          { headers }
        );
        const campData = await campRes.json();
        console.log("📦 DATOS CAMPAÑA (Backend):", campData);

        // 2. Fetch Company Data (Defaults)
        let companyDefaults = {
          primaryGoal: "",
          successMetric: "",
          timeframe: "",
        };

        try {
          // Intentamos obtener el perfil de la empresa
          const compRes = await fetch(`${apiUrl}/api/v1/company`, { headers });

          if (compRes.ok) {
            const rawCompData = await compRes.json();
            console.log("🏢 DATOS EMPRESA (Crudos):", rawCompData);

            // Lógica para encontrar el objeto correcto sin importar cómo lo envíe el backend
            // Puede venir como: { data: {...} }, [{...}], o directo {...}
            const compObj = Array.isArray(rawCompData)
              ? rawCompData[0]
              : rawCompData.data || rawCompData;

            if (compObj) {
              console.log("✅ EMPRESA PROCESADA:", compObj);

              // Asignamos asegurando que no sean undefined
              companyDefaults.primaryGoal = compObj.primaryGoal || "";
              companyDefaults.successMetric = compObj.successMetric || "";
              companyDefaults.timeframe = compObj.timeframe || "";
            }
          } else {
            console.warn("⚠️ Error al cargar empresa:", compRes.status);
          }
        } catch (err) {
          console.error("❌ Error fetch empresa:", err);
        }

        console.log("✨ DEFAULTS CALCULADOS:", companyDefaults);

        // 3. Set Form con lógica de prioridad
        setForm({
          name: campData.name || "",
          objective: campData.objective || "",
          landingUrl: campData.landingPageUrl || "",

          channel:
            campData.channels && campData.channels.length > 0
              ? campData.channels[0]
              : "Google Search",

          geo: campData.geo || "",
          language: campData.language || "English",
          budget: campData.budget || "",

          // --- AQUÍ ESTÁ LA MAGIA ---
          // Si campaign tiene valor -> úsalo.
          // Si no, usa el de la empresa.
          primaryGoal: campData.primaryGoal || companyDefaults.primaryGoal,

          // successMetric o primaryKpi (legacy)
          successMetric:
            campData.successMetric ||
            campData.primaryKpi ||
            companyDefaults.successMetric,

          timeframe: campData.timeframe || companyDefaults.timeframe,
        });
      } catch (err) {
        console.error("❌ Error General:", err);
        setToast({ type: "error", message: "Failed to load data" });
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [campaignId, token]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  async function handleSave(e) {
    e.preventDefault();
    setToast(null);

    if (!form.name.trim()) {
      setToast({ type: "error", message: "Campaign name is required." });
      return;
    }

    setSaving(true);
    try {
      // Payload para el backend
      const payload = {
        name: form.name.trim(),
        objective: form.objective.trim(),
        landingPageUrl: form.landingUrl.trim(),
        geo: form.geo.trim(),
        budget: form.budget.trim(),
        channels: [form.channel], // Enviamos como array

        // Guardamos los valores editados
        primaryGoal: form.primaryGoal.trim(),
        successMetric: form.successMetric.trim(),
        timeframe: form.timeframe.trim(),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      setToast({ type: "success", message: "Saved successfully." });
      setTimeout(() => setToast(null), 2000);
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
        setActiveContext={(ctx) => {
          if (ctx === "general") router.push("/chat");
          else router.push(`/chat/campaign/${ctx}`);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={campaignId}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            <button
              onClick={() => router.push(`/chat/campaign/${campaignId}`)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to campaign
            </button>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xl font-semibold text-gray-900">
                Campaign settings
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Update metadata that agents use to generate ads.
              </div>

              {toast && (
                <div
                  className={`mt-4 text-sm rounded-xl p-3 border flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${
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

              <form onSubmit={handleSave} className="mt-6 space-y-6">
                {/* --- BASIC INFO --- */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                    Campaign name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                      Objective
                    </label>
                    <input
                      value={form.objective}
                      onChange={(e) => setField("objective", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                      Landing page URL
                    </label>
                    <input
                      value={form.landingUrl}
                      onChange={(e) => setField("landingUrl", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                      Channel
                    </label>
                    <select
                      value={form.channel}
                      onChange={(e) => setField("channel", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
                    >
                      <option value="Google Search">Google Search</option>
                      <option value="Website">Website</option>
                      <option value="Email">Email</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                      Geo
                    </label>
                    <input
                      value={form.geo}
                      onChange={(e) => setField("geo", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                      Budget
                    </label>
                    <input
                      value={form.budget}
                      onChange={(e) => setField("budget", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                {/* --- GOALS SECTION --- */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="mb-3 text-sm font-semibold text-gray-900">
                    Goals & Success
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                        Primary goal
                      </label>
                      <input
                        value={form.primaryGoal}
                        onChange={(e) =>
                          setField("primaryGoal", e.target.value)
                        }
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="e.g., Increase Leads"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                        Success metric
                      </label>
                      <input
                        value={form.successMetric}
                        onChange={(e) =>
                          setField("successMetric", e.target.value)
                        }
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="e.g., 30 sales/month"
                      />
                    </div>

                    {/* ✅ Nuevo Campo Timeframe */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase mb-1 block">
                        Timeframe
                      </label>
                      <input
                        value={form.timeframe}
                        onChange={(e) => setField("timeframe", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="e.g., Q1 2025"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-gray-400 italic">
                    {/* Feedback visual si estamos usando datos de la empresa */}
                    {form.primaryGoal && form.successMetric && form.timeframe
                      ? "Campaign specific goals loaded."
                      : "Showing defaults from Company Data where available."}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => router.push(`/chat/campaign/${campaignId}`)}
                    className="h-11 px-6 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-6 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save changes
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
