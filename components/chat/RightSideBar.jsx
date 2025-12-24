"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  X,
  ExternalLink,
  Loader2,
  Tag,
  Target,
  Calendar,
  Megaphone,
  BarChart3,
  Trophy,
  Users,
  Rocket,
  Eye,
  Globe,
  Palette, // <--- 1. NUEVO IMPORT
} from "lucide-react";

import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/useContext";

// Importamos los submódulos
import AgentsSidebarPanel from "./sidebar/AgentsPanel";
import InfoRow from "./sidebar/InfoRow";
import CampaignListPanel from "./sidebar/CampaignListPanel";
import {
  getDefaultAgents,
  buildActivityFromAgents,
  getFakeOutputSummary,
} from "./sidebar/sidebar-utils";

export default function RightSidebar({
  isOpen,
  setIsOpen,
  activeContext,
  mode = "campaign", // "campaign" | "brand"
  campaignId,
}) {
  const router = useRouter();
  const { companyData, loading: companyLoading } = useCompany();
  const { token } = useAuth();

  const showCampaignUI = mode === "campaign";
  const [tab, setTab] = useState(showCampaignUI ? "campaign" : "brand");

  // Estado: Campaña Individual
  const [campaign, setCampaign] = useState(null);
  const [campaignLoading, setCampaignLoading] = useState(false);

  // Estado: Lista de Campañas (Cuando no hay ID seleccionado)
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [allCampaignsLoading, setAllCampaignsLoading] = useState(false);

  // Estado de agentes
  const [agents, setAgents] = useState([]);
  const [agentActivity, setAgentActivity] = useState([]);

  // --- LOGICA DE TABS INICIAL ---
  useEffect(() => {
    const t = setTimeout(() => {
      setTab(mode === "campaign" ? "campaign" : "brand");
    }, 0);
    return () => clearTimeout(t);
  }, [mode]);

  // --- PREPARAR COLORES (Lógica segura) ---
  const brandColors = useMemo(() => {
    if (!companyData) return [];
    // Opción A: Viene como array en 'colors'
    if (Array.isArray(companyData.colors) && companyData.colors.length > 0) {
      return companyData.colors;
    }
    // Opción B: Viene como propiedades sueltas
    const colors = [];
    if (companyData.primaryColor) colors.push(companyData.primaryColor);
    if (companyData.secondaryColor) colors.push(companyData.secondaryColor);

    // Opción C: Fallback fake si no hay nada (puedes quitar esto si prefieres que no salga nada)
    if (colors.length === 0) return [];

    return colors;
  }, [companyData]);

  // --- CARGAR DATOS ---
  useEffect(() => {
    if (mode !== "campaign" || !token) return;

    const id = String(campaignId || activeContext || "");
    const isGeneral = !id || id === "general" || id === "undefined";

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!isGeneral) {
          // A. CARGAR UNA SOLA CAMPAÑA
          setCampaignLoading(true);
          const res = await fetch(`${apiUrl}/api/v1/campaigns/${id}`, {
            headers,
          });
          if (res.ok) {
            const data = await res.json();
            setCampaign(data);
          } else {
            setCampaign({ name: "Error loading", id });
          }
          setCampaignLoading(false);
        } else {
          // B. CARGAR TODAS LAS CAMPAÑAS (LISTA)
          setAllCampaignsLoading(true);
          const res = await fetch(`${apiUrl}/api/v1/campaigns`, { headers });
          if (res.ok) {
            const data = await res.json();
            const list = Array.isArray(data) ? data : data.data || []; // Robustez
            setAllCampaigns(list);
            setCampaign(null);

            if (list.length === 0) {
              setTab("brand");
            }
          }
          setAllCampaignsLoading(false);
        }
      } catch (error) {
        console.error("Sidebar fetch error:", error);
        setCampaignLoading(false);
        setAllCampaignsLoading(false);
      }
    };

    fetchData();
  }, [mode, campaignId, activeContext, token]);

  // --- CARGAR AGENTES ---
  const activeCampaignKey = useMemo(
    () => String(campaignId || activeContext || ""),
    [campaignId, activeContext]
  );

  useEffect(() => {
    if (!showCampaignUI || !activeCampaignKey) return;
    const t = setTimeout(() => {
      const defaultList = getDefaultAgents();
      setAgents(defaultList);
      setAgentActivity(buildActivityFromAgents(defaultList));
    }, 0);
    return () => clearTimeout(t);
  }, [showCampaignUI, activeCampaignKey]);

  // --- HANDLERS ---
  const close = () => setIsOpen?.(false);
  const goBrandFullPage = () => {
    router.push("/chat/brand-details");
    close();
  };
  const goCampaignFullPage = () => {
    const id = String(campaignId || activeContext || "");
    if (id && id !== "general") router.push(`/chat/campaign/${id}/edit`);
    close();
  };
  const goAgentFullPage = () => {
    const id = String(campaignId || activeContext || "");
    if (id && id !== "general") router.push(`/chat/campaign/${id}/agents`);
    close();
  };
  const simulateRun = (agentId) => {
    /* ... */
  };
  const simulateReset = (agentId) => {
    /* ... */
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-gray-50 border-l flex flex-col transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } lg:relative lg:translate-x-0`}
    >
      {/* HEADER */}
      <div className="h-16 border-b flex items-center justify-between px-5 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Layout className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-gray-700 truncate">
            {showCampaignUI ? "Context" : "Brand Details"}
          </h3>
        </div>
        <button
          onClick={close}
          className="lg:hidden text-gray-400 hover:bg-gray-100 p-1 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* TABS */}
      {showCampaignUI && (
        <div className="px-4 pt-4">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
            {["campaign", "brand"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 h-9 rounded-lg text-sm font-semibold transition capitalize ${
                  tab === t
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="px-4 pb-4 pt-4 space-y-4 overflow-y-auto flex-1">
        {/* --- PANEL: CAMPAIGN --- */}
        {showCampaignUI && tab === "campaign" && (
          <>
            {/* CASO 1: Viendo una campaña específica */}
            {campaign ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">Campaign</div>
                    <div className="text-base font-semibold text-gray-900 truncate">
                      {campaign.name || "Untitled campaign"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      ID: {campaign.id || campaign._id}
                    </div>
                  </div>
                  <button
                    onClick={goCampaignFullPage}
                    className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Edit
                  </button>
                </div>

                {campaignLoading ? (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <InfoRow
                      icon={Target}
                      label="Objective"
                      value={campaign.objective || "Not set"}
                    />
                    <InfoRow
                      icon={Trophy}
                      label="Primary goal"
                      value={
                        campaign.primaryGoal ||
                        companyData?.primaryGoal ||
                        "Not set"
                      }
                    />
                    <InfoRow
                      icon={BarChart3}
                      label="KPI"
                      value={campaign.primaryKpi || "Not set"}
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Timeframe"
                      value={
                        campaign.timeframe ||
                        companyData?.timeframe ||
                        "Not set"
                      }
                    />
                    <InfoRow
                      icon={Megaphone}
                      label="Primary channel"
                      value={
                        Array.isArray(campaign.channels) &&
                        campaign.channels.length > 0
                          ? campaign.channels[0]
                          : campaign.channel || "Not set"
                      }
                    />
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  This sidebar is read-only. Use Edit to update.
                </div>
              </div>
            ) : (
              // CASO 2: No hay ID seleccionado -> Mostrar lista de campañas (o empty state)
              <CampaignListPanel
                campaigns={allCampaigns}
                isLoading={allCampaignsLoading}
                onCloseSidebar={close}
              />
            )}
          </>
        )}

        {/* --- PANEL: BRAND --- */}
        {(!showCampaignUI || tab === "brand") && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Brand</div>
                <div className="text-base font-semibold text-gray-900 truncate">
                  {companyData?.brandName ||
                    companyData?.businessName ||
                    "Your Brand"}
                </div>
                {companyData?.industry && (
                  <div className="mt-1 text-xs text-gray-500 wrap-break-word">
                    Industry: {companyData.industry}
                  </div>
                )}
              </div>
              <button
                onClick={goBrandFullPage}
                className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Edit
              </button>
            </div>

            {companyLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <InfoRow
                  icon={Users}
                  label="Target audience"
                  value={companyData?.targetAudience || "Not set"}
                />
                <InfoRow
                  icon={Rocket}
                  label="Mission"
                  value={companyData?.mission || "Not set"}
                />
                <InfoRow
                  icon={Eye}
                  label="Vision"
                  value={companyData?.vision || "Not set"}
                />

                {brandColors.length > 0 && (
                  <InfoRow
                    icon={Palette}
                    label="Brand Colors"
                    value={
                      <div className="flex flex-wrap gap-2 mt-1">
                        {brandColors.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-gray-50 border border-gray-200 pr-2 rounded-full"
                          >
                            <div
                              className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                            <span className="text-[10px] font-mono text-gray-600 uppercase">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    }
                  />
                )}
                <InfoRow
                  icon={Trophy}
                  label="Primary goal"
                  value={companyData?.primaryGoal || "Not set"}
                />
                <InfoRow
                  icon={Globe}
                  label="Website"
                  value={companyData?.website || "Not set"}
                />
              </div>
            )}
          </div>
        )}

        {/* --- PANEL: AGENTS --- */}
        {showCampaignUI && tab === "agents" && (
          <AgentsSidebarPanel
            agents={agents}
            activity={agentActivity}
            onRun={simulateRun}
            onReset={simulateReset}
            onViewAll={goAgentFullPage}
          />
        )}
      </div>
    </div>
  );
}
