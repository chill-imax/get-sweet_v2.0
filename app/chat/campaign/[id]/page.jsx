"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/useContext";
import { useToast } from "@/context/ToastContext";
import { CampaignProvider, useCampaign } from "@/context/CampaignContext";
import api from "@/app/api/auth/axios";

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

  const { campaign, setCampaign, loadingInitial, refreshData } = useCampaign();

  // --- Estados de UI ---
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");

  // Estados de acciones locales
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados de datos adicionales
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
      if (campaign.googleAdsResourceId) {
        setActiveTab("results");
      } else {
        setActiveTab("settings");
      }
    }
  }, [loadingInitial]);

  // --- C. CARGA DATOS EMPRESA (Company Profile) ---
  useEffect(() => {
    if (!token) return;

    const fetchCompanyData = async () => {
      try {
        // ✅ Axios: Sin headers manuales
        const res = await api.get("/api/v1/company/profile");
        const compObj = res.data.data || res.data;
        if (compObj?.googleAds) setGoogleAdsData(compObj.googleAds);
      } catch (error) {
        console.error("Error fetching company data", error);
      }
    };
    fetchCompanyData();
  }, [token]);

  // --- FUNCIONES DE ACCIÓN (Settings Panel) ---

  const handleSaveSettings = async () => {
    if (!campaignId) return;
    setIsSaving(true);
    try {
      const payload = {
        name: campaignDetails.name,
        objective: campaignDetails.objective,
        geo: campaignDetails.geo,
        budget: campaignDetails.budget,
        landingPageUrl: campaignDetails.landingUrl,
        language: campaignDetails.language,
        bidStrategy: campaignDetails.bidStrategy,
        globalNegatives: campaignDetails.globalNegatives,
      };

      // ✅ Axios PATCH
      const res = await api.patch(`/api/v1/campaigns/${campaignId}`, payload);

      // Axios lanza error si status no es 2xx, no hace falta if(!res.ok)
      const updatedCampaign = res.data;

      setCampaign((prev) => ({ ...prev, ...updatedCampaign.data }));
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save settings");
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

      // ✅ Axios POST
      const res = await api.post(`/api/v1/campaigns/${campaignId}/generate`, {
        userFeedback: feedbackText,
      });

      const data = res.data; // data directa de axios

      setGeneratedData(data.data.structure);
      setActiveGenerationId(data.data._id);
      setDraftVersion(data.data.version);

      setCampaign((prev) => ({ ...prev, status: "review" }));
      toast.success(`Campaign V${data.data.version} generated!`);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "AI failed to generate campaign."
      );
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
      // ✅ Axios PATCH (Sin await response porque es optimista/background)
      await api.patch(
        `/api/v1/campaigns/${campaignId}/generations/${activeGenerationId}`,
        { structure: newData }
      );
    } catch (e) {
      console.error("Error updating group:", e);
      // Opcional: Revertir estado si falla
      toast.error("Failed to save changes automatically");
    }
  };

  const handleApproveAndPublish = async (targetGroupIndices) => {
    if (!confirm("Are you ready to launch this campaign to Google Ads?"))
      return;

    try {
      // ✅ Axios POST
      const res = await api.post(`/api/v1/campaigns/${campaignId}/publish`, {
        targetGroupIndices,
      });

      const data = res.data;

      if (data.updatedStructure) setGeneratedData(data.updatedStructure);

      const newStatus = "active";
      setCampaign((prev) => ({
        ...prev,
        status: newStatus,
        googleAdsResourceId: data.googleResourceId,
      }));

      setActiveTab("results");
      toast.success(data.message || "🚀 Updates published to Google Ads!");

      if (
        data.updatedStructure?.adGroups?.every((g) => g.isPublished === true)
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      refreshData();
    } catch (error) {
      console.error("Publish Error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Publish failed"
      );
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
        <CampaignStatusBanner
          onUnlock={handleUnlock}
          onRegenerate={handleGenerateDraft}
          campaignId={campaignId}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="pt-3">
          <CampaignTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex-1 min-h-0">
          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto">
              <SettingsPanel
                campaignDetails={campaignDetails}
                setCampaignDetails={setCampaignDetails}
                googleAdsData={googleAdsData}
                generatedData={generatedData}
                activeGenerationId={activeGenerationId}
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
