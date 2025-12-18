"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/useContext";

// Componentes
import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import CampaignStatusBanner from "@/components/chat/campaign/CampaignStatusBanner";
import CampaignTabs from "@/components/chat/campaign/CampaignTabs";

// Paneles
import ChatbotPanel from "@/components/chat/campaign/ChatbotPanel";
import ResultsPanel from "@/components/chat/campaign/ResultsPanel";
import SettingsPanel from "@/components/chat/campaign/SettingsPanel";

export default function CampaignPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const campaignId = String(id);

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chatbot");
  const [loading, setLoading] = useState(true);

  const [campaignDetails, setCampaignDetails] = useState({
    name: "",
    objective: "",
    landingUrl: "",
    geo: "",
    language: "English", // Valor por defecto (no está en BD aún)
    budget: "",
  });

  // AdGroups (Datos falsos locales por ahora, como pediste)
  const [adGroups, setAdGroups] = useState([
    { id: "ag1", name: "Core Service", theme: "Primary offer keywords" },
    { id: "ag2", name: "Competitor / Alt", theme: "Alternatives + comparison" },
  ]);

  // Estado del banner
  const [draftStatus, setDraftStatus] = useState("planning"); // 'planning' es lo que viene de BD
  const [draftLocked, setDraftLocked] = useState(false);
  const [draftVersion, setDraftVersion] = useState(1);

  // ✅ EFECTO: CONECTAR CON LA BD AL CARGAR
  useEffect(() => {
    if (!token || !campaignId) return;

    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Mapeamos los datos de la BD (Backend) al estado del Frontend
          setCampaignDetails({
            name: data.name || "",
            objective: data.objective || "",
            // Nota: En BD se llama 'landingPageUrl', en Front usamos 'landingUrl'
            landingUrl: data.landingPageUrl || "",
            geo: data.geo || "",
            budget: data.budget || "",
            language: "English", // Mantenemos default por ahora
          });

          setDraftStatus(data.status || "planning");
        } else {
          console.error("Error fetching campaign");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId, token]);

  const handleSaveSettings = async () => {
    if (!token || !campaignId) return;

    try {
      setIsSaving(true);

      // 1. Preparamos el payload (Mapeo Frontend -> Backend)
      const payload = {
        name: campaignDetails.name,
        objective: campaignDetails.objective,
        geo: campaignDetails.geo,
        budget: campaignDetails.budget,
        // IMPORTANTE: Frontend usa 'landingUrl', Backend espera 'landingPageUrl'
        landingPageUrl: campaignDetails.landingUrl,
        // language: campaignDetails.language (Si el backend no lo soporta aún, no lo mandes o agrégalo al modelo)
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

      if (res.ok) {
        // Opcional: Mostrar un Toast o notificación de éxito
        alert("Settings saved successfully! ✅");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers Globales ---

  function handleUnlock() {
    setDraftLocked(false);
    setDraftStatus("draft");
  }

  function handleRegenerate() {
    setDraftVersion((v) => v + 1);
    setDraftLocked(false);
    setDraftStatus("draft");
    setActiveTab("settings");
  }

  function handleGenerateDraft() {
    setDraftStatus("approved");
    setDraftLocked(true);
    alert("Draft generated! Flow continues...");
  }

  function applyPatch(patch) {
    setCampaignDetails((prev) => ({ ...prev, ...patch }));
  }

  function addAdGroupFromChat(name) {
    const next = adGroups.length + 1;
    setAdGroups((prev) => [...prev, { id: `ag${next}`, name, theme: "" }]);
  }

  // Si está cargando, mostramos un loader simple o la estructura vacía
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
        {/* 1. Banner Superior */}
        <CampaignStatusBanner
          status={draftStatus}
          provider="Google Ads"
          version={draftVersion}
          locked={draftLocked}
          onUnlock={handleUnlock}
          onRegenerate={handleRegenerate}
        />

        {/* 2. Tabs de Navegación */}
        <div className="pt-3">
          <CampaignTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {/* 3. Área de Contenido Dinámico */}
        <div className="flex-1 min-h-0">
          {activeTab === "chatbot" && (
            <ChatbotPanel
              onApplyPatch={applyPatch}
              onAddAdGroup={addAdGroupFromChat}
            />
          )}

          {activeTab === "results" && (
            <div className="h-full overflow-y-auto">
              <ResultsPanel />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="h-full overflow-y-auto">
              <SettingsPanel
                campaignDetails={campaignDetails}
                setCampaignDetails={setCampaignDetails}
                adGroups={adGroups}
                setAdGroups={setAdGroups}
                onGenerateDraft={handleGenerateDraft}
                onSave={handleSaveSettings}
                isSaving={isSaving}
              />
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
