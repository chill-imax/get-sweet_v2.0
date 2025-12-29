"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/useContext";
import { useToast } from "@/context/ToastContext";

const CampaignContext = createContext();

export function CampaignProvider({ children, campaignId }) {
  const { token } = useAuth();
  const toast = useToast();

  // Estados Globales de la Campaña
  const [campaign, setCampaign] = useState(null); // Datos de Mongo
  const [googleStatus, setGoogleStatus] = useState(null); // "ENABLED", "PAUSED" (Google)
  const [analyticsData, setAnalyticsData] = useState(null); // Datos de gráficos

  // Estados de Carga
  const [loadingInitial, setLoadingInitial] = useState(true); // Carga de Mongo
  const [isSyncing, setIsSyncing] = useState(false); // Carga de Google

  // 1. Cargar Datos Básicos (Mongo)
  const fetchCampaign = useCallback(async () => {
    if (!token || !campaignId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCampaign(data);
        // Si ya está publicada, lanzamos la sincronización con Google automáticamente
        if (data.googleAdsResourceId) {
          syncGoogleData(data.googleAdsResourceId);
        } else {
          setLoadingInitial(false); // Si es borrador, terminamos aquí
        }
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setLoadingInitial(false);
    }
  }, [campaignId, token]);

  // 2. Sincronizar con Google (Analytics + Status)
  const syncGoogleData = useCallback(
    async (resourceId) => {
      setIsSyncing(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns/${campaignId}/analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();

        if (json.success && json.data) {
          setAnalyticsData(json.data);
          // Extraer el status real
          const realStatus = json.data.overview?.status || "UNKNOWN";
          setGoogleStatus(realStatus);

          // Actualizar el objeto campaign localmente para consistencia
          setCampaign((prev) => ({
            ...prev,
            status: realStatus === "ENABLED" ? "active" : "paused",
          }));
        }
      } catch (error) {
        console.warn("⚠️ Background sync failed:", error);
      } finally {
        setIsSyncing(false);
        setLoadingInitial(false);
      }
    },
    [campaignId, token]
  );

  // 3. Función para forzar actualización (ej: al hacer toggle)
  const refreshData = () => {
    if (campaign?.googleAdsResourceId) {
      syncGoogleData(campaign.googleAdsResourceId);
    } else {
      fetchCampaign();
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        setCampaign,
        googleStatus,
        analyticsData,
        loadingInitial,
        isSyncing,
        refreshData,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export const useCampaign = () => useContext(CampaignContext);
