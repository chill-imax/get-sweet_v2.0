"use client";

import { useState, useEffect } from "react";
import api from "@/app/api/auth/axios"; // ✅ Instancia centralizada
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";

export default function AdGroupToggle({ campaignId, adGroup, onRefresh }) {
  // ❌ const { token } = useAuth(); // Ya no es necesario
  const toast = useToast();

  // Estado local para respuesta instantánea (Optimistic UI)
  const [internalStatus, setInternalStatus] = useState(adGroup.status);
  const [loading, setLoading] = useState(false);

  // Sincronizar si llegan datos nuevos del padre
  useEffect(() => {
    setInternalStatus(adGroup.status);
  }, [adGroup.status]);

  const isEnabled = internalStatus === "ENABLED";

  const handleToggle = async () => {
    if (loading) return;

    // 1. Cambio visual inmediato (Optimistic)
    const originalStatus = internalStatus;
    const newStatus = isEnabled ? "PAUSED" : "ENABLED";
    setInternalStatus(newStatus);
    setLoading(true);

    try {
      // 2. Petición al Backend con Axios
      await api.patch(`/api/v1/campaigns/${campaignId}/adgroups/status`, {
        adGroupResourceName: adGroup.id,
        status: newStatus,
      });

      // Axios no lanza error si es 2xx, así que asumimos éxito aquí
      toast.success(
        `Ad Group ${newStatus === "ENABLED" ? "activated" : "paused"}`
      );

      // 3. Recargar datos en segundo plano
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      // Rollback visual si falla
      setInternalStatus(originalStatus);

      const errorMsg =
        error.response?.data?.message || "Failed to update status";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
          ${isEnabled ? "bg-emerald-500" : "bg-gray-300"}
          ${loading ? "opacity-70 cursor-wait" : ""}
        `}
        title={isEnabled ? "Click to Pause" : "Click to Enable"}
      >
        <span className="sr-only">Toggle Ad Group</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center
            ${isEnabled ? "translate-x-4" : "translate-x-0"}
          `}
        >
          {loading && (
            <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
          )}
        </span>
      </button>

      {/* Etiqueta de texto simple al lado */}
      <span
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isEnabled ? "text-emerald-600" : "text-gray-400"
        }`}
      >
        {isEnabled ? "ON" : "OFF"}
      </span>
    </div>
  );
}
