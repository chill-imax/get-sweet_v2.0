"use client";

import { useState, useEffect } from "react";
import api from "@/app/api/auth/axios"; // ✅ Instancia centralizada
import { useToast } from "@/context/ToastContext";
import { Loader2, Play, Pause, Info } from "lucide-react";

export default function CampaignStatusToggle({
  campaign,
  onStatusChange,
  externalStatus,
}) {
  // ❌ const { token } = useAuth(); // Ya no es necesario
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Lógica de estado inicial y reactivo
  const calculateIsActive = () => {
    const statusToCheck = externalStatus || campaign?.status;
    return (
      statusToCheck === "active" ||
      statusToCheck === "published" ||
      statusToCheck === "ENABLED"
    );
  };

  const [isEnabled, setIsEnabled] = useState(calculateIsActive());

  // 👂 Sincronizar cuando cambia el estado externo (Google)
  useEffect(() => {
    setIsEnabled(calculateIsActive());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.status, externalStatus]);

  const handleToggle = async () => {
    if (!campaign.googleAdsResourceId) {
      toast.error("Publish the campaign first.");
      return;
    }

    const newStatus = !isEnabled ? "ENABLED" : "PAUSED";

    // Optimistic UI (Cambio visual inmediato)
    const originalState = isEnabled;
    setIsEnabled(!isEnabled);
    setLoading(true);

    try {
      // ✅ Axios PATCH
      const res = await api.patch(`/api/v1/campaigns/${campaign._id}/status`, {
        status: newStatus,
      });

      const data = res.data;

      toast.success(data.message);
      if (onStatusChange) onStatusChange(data.newStatus);
    } catch (error) {
      // ❌ Rollback si falla
      setIsEnabled(originalState);

      const errorMsg = error.response?.data?.message || "Error updating status";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden md:block">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          Master Switch
        </div>
        <div
          className={`text-sm font-bold flex items-center justify-end gap-1.5 ${
            isEnabled ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {isEnabled ? "RUNNING" : "PAUSED"}
          <span className="relative flex h-2 w-2">
            {isEnabled && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isEnabled ? "bg-emerald-500" : "bg-amber-500"
              }`}
            ></span>
          </span>
        </div>
      </div>

      <div className="relative group">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`
            relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm
            ${
              isEnabled
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gray-200 hover:bg-gray-300"
            }
            ${loading ? "opacity-70 cursor-wait" : ""}
          `}
        >
          <span
            className={`pointer-events-none h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              isEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : isEnabled ? (
              <Pause className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            ) : (
              <Play className="w-3 h-3 text-gray-400 fill-gray-400 ml-0.5" />
            )}
          </span>
        </button>

        <div className="absolute right-0 top-full mt-3 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
          <div className="font-bold mb-1 flex items-center gap-2 text-gray-200">
            <Info className="w-3 h-3" /> Google Ads Master Control
          </div>
          <p className="text-gray-300 leading-relaxed">
            {isEnabled
              ? "Your campaign is LIVE. Switching this off will instantly pause all ad groups."
              : "Your campaign is PAUSED. Switching this on will reactivate your approved ads."}
          </p>
        </div>
      </div>
    </div>
  );
}
