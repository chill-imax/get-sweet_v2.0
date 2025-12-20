"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/useContext";
import { useToast } from "@/context/ToastContext";

// Componentes Layout
import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import CampaignStatusBanner from "@/components/chat/campaign/CampaignStatusBanner";
import CampaignTabs from "@/components/chat/campaign/CampaignTabs";

// Paneles
import ResultsPanel from "@/components/chat/campaign/ResultsPanel";
import SettingsPanel from "@/components/chat/campaign/SettingsPanel";

export default function CampaignPage() {
  const toast = useToast();
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const campaignId = String(id);

  // --- Estados de UI ---
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // ✅ Nuevo estado para el loading de IA

  // --- Estados de Datos ---
  const [googleAdsData, setGoogleAdsData] = useState(null);
  const [generatedData, setGeneratedData] = useState(null); // ✅ Aquí guardamos el JSON de la IA
  const [draftVersion, setDraftVersion] = useState(0); // Versión actual (v1, v2...)
  const [draftStatus, setDraftStatus] = useState("planning");

  // Inputs del Usuario
  const [campaignDetails, setCampaignDetails] = useState({
    name: "",
    objective: "",
    landingUrl: "",
    geo: "",
    language: "English",
    budget: "",
    bidStrategy: "", // Nuevo campo experto
    globalNegatives: "", // Nuevo campo experto
  });

  // Ad Groups Manuales (Input para la IA)
  const [adGroups, setAdGroups] = useState([
    { id: "ag1", name: "Core Service", theme: "Primary offer keywords" },
  ]);

  // --- 1. CARGA INICIAL (FETCH) ---
  useEffect(() => {
    if (!token || !campaignId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Carga paralela: Campaña + Perfil de Empresa (Google Ads)
        const [campRes, compRes] = await Promise.all([
          fetch(`${apiUrl}/api/v1/campaigns/${campaignId}`, { headers }),
          fetch(`${apiUrl}/api/v1/company/profile`, { headers }),
        ]);

        // A. Procesar Datos de Campaña
        if (campRes.ok) {
          const data = await campRes.json();

          setCampaignDetails({
            name: data.name || "",
            objective: data.objective || "",
            landingUrl: data.landingPageUrl || "",
            geo: data.geo || "",
            budget: data.budget || "",
            language: data.language || "English",
            // Campos opcionales si ya los guardaste
            bidStrategy: data.bidStrategy || "",
            globalNegatives: data.globalNegatives || "",
          });

          setDraftStatus(data.status || "planning");

          // ✅ IMPORTANTE: Si ya hay una generación activa, cargarla
          if (data.activeGenerationId) {
            // Si el populate trajo el objeto completo
            if (typeof data.activeGenerationId === "object") {
              setGeneratedData(data.activeGenerationId.structure);
              setDraftVersion(data.activeGenerationId.version);
            }
          }
        }

        // B. Procesar Datos de Empresa (Google Ads Token)
        if (compRes.ok) {
          const rawComp = await compRes.json();
          const compObj = Array.isArray(rawComp)
            ? rawComp[0]
            : rawComp.data || rawComp;

          if (compObj?.googleAds) {
            setGoogleAdsData(compObj.googleAds);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading campaign data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [campaignId, token]);

  // --- 2. GUARDAR CONFIGURACIÓN (SAVE) ---
  const handleSaveSettings = async () => {
    if (!token || !campaignId) return;
    setIsSaving(true);

    try {
      const payload = {
        name: campaignDetails.name,
        objective: campaignDetails.objective,
        geo: campaignDetails.geo,
        budget: campaignDetails.budget,
        landingPageUrl: campaignDetails.landingUrl,
        // Opcional: guardar adGroups manuales si tu backend lo soporta
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

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. GENERAR ESTRUCTURA (LA MAGIA DE LA IA) ---
  const handleGenerateDraft = async (feedbackText = "") => {
    if (!campaignDetails.landingUrl) {
      return toast.warning("Please enter a Landing Page URL first.");
    }

    setIsGenerating(true);

    try {
      // Paso A: Aseguramos que los últimos cambios estén guardados
      await handleSaveSettings();

      // Paso B: Llamamos al endpoint de generación
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}/generate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            userFeedback: feedbackText,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Generation failed");

      // Paso C: Actualizamos el estado con el JSON recibido
      const aiStructure = data.data.structure;
      setGeneratedData(aiStructure);
      setDraftVersion(data.data.version);
      setDraftStatus("review"); // Cambiamos estado visual

      toast.success(`Campaign V${data.data.version} generated!`);
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("AI failed to generate campaign. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Handlers de UI ---
  function handleUnlock() {
    // Permite al usuario "descartar" la generación y volver a editar inputs
    setGeneratedData(null);
    setDraftStatus("planning");
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
        {/* 1. Banner Superior (Status) */}
        <CampaignStatusBanner
          status={draftStatus}
          provider="Google Ads"
          version={draftVersion}
          locked={!!generatedData} // Bloqueado si ya hay data generada
          onUnlock={handleUnlock}
          onRegenerate={handleGenerateDraft} // Reutilizamos la función
          campaignId={campaignId}
        />

        {/* 2. Tabs */}
        <div className="pt-3">
          <CampaignTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* 3. Contenido Principal */}
        <div className="flex-1 min-h-0">
          {/* TAB DE SETTINGS (Donde ocurre la acción) */}
          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto">
              <SettingsPanel
                // Datos
                campaignDetails={campaignDetails}
                setCampaignDetails={setCampaignDetails}
                adGroups={adGroups}
                setAdGroups={setAdGroups}
                googleAdsData={googleAdsData}
                generatedData={generatedData} // ✅ Pasamos el Output de la IA
                // Acciones
                onGenerateDraft={handleGenerateDraft} // ✅ Conectado al Backend
                onSave={handleSaveSettings}
                // Estados de Carga
                isSaving={isSaving}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* TAB DE RESULTADOS (Opcional, si quieres una vista separada) */}
          {activeTab === "results" && (
            <div className="h-full overflow-y-auto">
              {/* Aquí podrías reutilizar GeneratedResults si quisieras verlo aislado */}
              <ResultsPanel />
            </div>
          )}
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
