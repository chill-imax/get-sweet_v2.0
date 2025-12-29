"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/useContext";
import { useToast } from "@/context/ToastContext";
import { CampaignProvider, useCampaign } from "@/context/CampaignContext"; // 👈 IMPORTANTE

// Componentes Layout
import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import CampaignStatusBanner from "@/components/chat/campaign/CampaignStatusBanner";
import CampaignTabs from "@/components/chat/campaign/CampaignTabs";

// Paneles
import ResultsPanel from "@/components/chat/campaign/ResultsPanel";
import SettingsPanel from "@/components/chat/campaign/SettingsPanel";

// 1. COMPONENTE ENVOLTORIO (WRAPPER)
export default function CampaignPage() {
  const { id } = useParams();
  return (
    <CampaignProvider campaignId={id}>
      <CampaignPageContent campaignId={id} />
    </CampaignProvider>
  );
}

// 2. CONTENIDO REAL DE LA PÁGINA
function CampaignPageContent({ campaignId }) {
  const router = useRouter();
  const { token } = useAuth();
  const toast = useToast();

  // 👇 Consumimos TODO del Contexto (Single Source of Truth)
  const {
    campaign,
    setCampaign,
    loadingInitial,
    refreshData, // Para forzar recargas si es necesario
  } = useCampaign();

  // --- Estados de UI ---
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");

  // Estados de acciones locales
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados de datos adicionales (que no están en el context principal aún)
  const [googleAdsData, setGoogleAdsData] = useState(null);
  const [generatedData, setGeneratedData] = useState(null);
  const [activeGenerationId, setActiveGenerationId] = useState(null);
  const [draftVersion, setDraftVersion] = useState(0);

  // Inputs del Formulario (SettingsPanel)
  const [campaignDetails, setCampaignDetails] = useState({
    name: "",
    objective: "",
    landingUrl: "",
    geo: "",
    language: "English",
    budget: "",
    bidStrategy: "",
    globalNegatives: "",
  });

  // --- A. EFECTO: Sincronizar Contexto -> Formulario Local ---
  useEffect(() => {
    if (campaign) {
      setCampaignDetails({
        name: campaign.name || "",
        objective: campaign.objective || "",
        landingUrl: campaign.landingPageUrl || "",
        geo: campaign.geo || "",
        budget: campaign.budget || "",
        language: campaign.language || "English",
        bidStrategy: campaign.bidStrategy || "",
        globalNegatives: campaign.globalNegatives || "",
      });

      // Cargar datos de generación si existen
      if (
        campaign.activeGenerationId &&
        typeof campaign.activeGenerationId === "object"
      ) {
        setGeneratedData(campaign.activeGenerationId.structure);
        setActiveGenerationId(campaign.activeGenerationId._id);
        setDraftVersion(campaign.activeGenerationId.version);
      }
    }
  }, [campaign]);

  // --- B. EFECTO: Decisión Inteligente de Pestaña Inicial ---
  useEffect(() => {
    if (!loadingInitial && campaign) {
      // Si ya está publicada en Google, vamos directo a Resultados
      if (campaign.googleAdsResourceId) {
        setActiveTab("results");
      } else {
        // Si es borrador, nos quedamos en Settings
        setActiveTab("settings");
      }
    }
  }, [loadingInitial]); // Solo corre cuando termina de cargar la data inicial

  // --- C. CARGA DATOS EMPRESA (Company Profile) ---
  // Esto es ajeno a la campaña, así que lo mantenemos aquí
  useEffect(() => {
    if (!token) return;
    const fetchCompanyData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const rawComp = await res.json();
          const compObj = Array.isArray(rawComp)
            ? rawComp[0]
            : rawComp.data || rawComp;
          if (compObj?.googleAds) setGoogleAdsData(compObj.googleAds);
        }
      } catch (error) {
        console.error("Error fetching company data", error);
      }
    };
    fetchCompanyData();
  }, [token]);

  // --- FUNCIONES DE ACCIÓN (Settings Panel) ---

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

      // Actualizamos el contexto
      const updatedCampaign = await res.json();
      setCampaign((prev) => ({ ...prev, ...updatedCampaign.data }));

      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateDraft = async (feedbackInput) => {
    const feedbackText = typeof feedbackInput === "string" ? feedbackInput : "";
    if (!campaignDetails.landingUrl)
      return toast.warning("Please enter a Landing Page URL first.");

    setIsGenerating(true);
    try {
      await handleSaveSettings(); // Guardamos antes de generar

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userFeedback: feedbackText }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGeneratedData(data.data.structure);
      setActiveGenerationId(data.data._id);
      setDraftVersion(data.data.version);

      // Actualizamos contexto (status cambió a 'review')
      setCampaign((prev) => ({ ...prev, status: "review" }));

      toast.success(`Campaign V${data.data.version} generated!`);
    } catch (error) {
      toast.error("AI failed to generate campaign.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateGroup = async (groupIndex, groupData) => {
    const prompt = `Regenerate ONLY the Ad Group named "${groupData.name}". Keep the others exactly as they were.`;
    await handleGenerateDraft(prompt);
  };

  const handleUpdateGroup = async (groupIndex, updatedGroup) => {
    const newData = JSON.parse(JSON.stringify(generatedData));
    newData.adGroups[groupIndex] = updatedGroup;
    setGeneratedData(newData);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}/generations/${activeGenerationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ structure: newData }),
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveAndPublish = async (targetGroupIndices) => {
    if (!confirm("Are you ready to launch this campaign to Google Ads?"))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetGroupIndices }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.updatedStructure) setGeneratedData(data.updatedStructure);

      // ✅ ACTUALIZACIÓN CRÍTICA DEL CONTEXTO
      // Esto hace que el Banner y el Toggle se activen inmediatamente
      const newStatus = "active";
      setCampaign((prev) => ({
        ...prev,
        status: newStatus,
        googleAdsResourceId: data.googleResourceId,
      }));

      // Cambiar a pestaña resultados tras publicar
      setActiveTab("results");

      toast.success(data.message || "🚀 Updates published to Google Ads!");

      if (
        data.updatedStructure?.adGroups?.every((g) => g.isPublished === true)
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Forzamos una recarga de datos en el contexto para asegurar sincronización
      refreshData();
    } catch (error) {
      console.error("Publish Error:", error);
      toast.error(error.message);
    }
  };

  function handleUnlock() {
    if (confirm("Discard current draft and start over?")) {
      setGeneratedData(null);
      setActiveGenerationId(null);
      setCampaign((prev) => ({ ...prev, status: "planning" }));
    }
  }

  // --- RENDER ---

  // Spinner de carga inicial (Pantalla completa blanca limpia)
  if (loadingInitial) {
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
        setActiveContext={(ctx) =>
          ctx === "general"
            ? router.push("/chat")
            : router.push(`/chat/campaign/${ctx}`)
        }
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        {/* Banner Conectado al Contexto (Sin props de datos) */}
        <CampaignStatusBanner
          // Las props de acción siguen siendo necesarias
          onUnlock={handleUnlock}
          onRegenerate={handleGenerateDraft}
          campaignId={campaignId}
          // Nota: campaign, status, y syncing ahora se leen internamente en el Banner desde el Contexto
        />

        <div className="pt-3">
          <CampaignTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex-1 min-h-0">
          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto">
              <SettingsPanel
                // Datos (SettingsPanel aún requiere props porque maneja el formulario local)
                campaignDetails={campaignDetails}
                setCampaignDetails={setCampaignDetails}
                googleAdsData={googleAdsData}
                generatedData={generatedData}
                activeGenerationId={activeGenerationId}
                // Acciones
                onGenerateDraft={handleGenerateDraft}
                onSave={handleSaveSettings}
                onApprove={handleApproveAndPublish}
                onDiscard={handleUnlock}
                onRegenerateGroup={handleRegenerateGroup}
                onUpdateGroup={handleUpdateGroup}
                isSaving={isSaving}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {activeTab === "results" && (
            <div className="h-full overflow-y-auto">
              {/* ResultsPanel Conectado al Contexto (Sin props) */}
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
