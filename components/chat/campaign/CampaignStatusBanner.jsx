"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Lock, Unlock, Loader2 } from "lucide-react";
import api from "@/app/api/auth/axios";
import { useCampaign } from "@/context/CampaignContext"; // ✅ Usamos el hook
import CampaignStatusToggle from "./CampaignStatusToggle";

export default function CampaignStatusBanner({
  provider = "Google Ads",
  onUnlock,
  deleteLabel = "Delete campaign",
}) {
  const router = useRouter();

  // 1. Traemos también googleStatus e isSyncing del contexto
  const { campaign, googleStatus, isSyncing } = useCampaign();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!campaign) return null;

  const safeId = campaign._id;
  const isLocked =
    campaign.status === "approved" || campaign.status === "locked";

  // 🔥 LÓGICA DE VISIBILIDAD DEL SWITCH 🔥
  // Solo mostramos el Master Switch si:
  // 1. La campaña tiene un ID de Google (fue publicada).
  // 2. Y ADEMÁS: Ya tenemos un status real de Google (googleStatus !== null)
  //    O estamos sincronizando (isSyncing) para evitar parpadeos.
  //
  // Si desconectas la cuenta: el sync fallará, googleStatus quedará null e isSyncing false.
  // Resultado: El botón desaparece.
  const showMasterSwitch =
    campaign.googleAdsResourceId && (googleStatus !== null || isSyncing);

  const handleDelete = async () => {
    if (!safeId) {
      setErr("Error: Campaign ID missing");
      return;
    }
    setBusy(true);
    setErr("");

    try {
      await api.delete(`/api/v1/campaigns/${safeId}`);
      router.push("/chat/brand-ai");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to delete";
      setErr(errorMsg);
      setBusy(false);
    }
  };

  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            {/* LADO IZQUIERDO: Título */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {provider} campaign
                </div>
              </div>
              {err && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {err}
                </div>
              )}
            </div>

            {/* LADO DERECHO: Acciones */}
            <div className="shrink-0 flex items-center gap-2">
              {/* 👇 TOGGLE CORREGIDO (Usa la nueva variable showMasterSwitch) */}
              {showMasterSwitch && (
                <div className="mr-2 border-r border-gray-200 pr-4 animate-in fade-in duration-300">
                  <CampaignStatusToggle campaign={campaign} />
                </div>
              )}

              {/* Botón Unlock */}
              {isLocked && (
                <button
                  type="button"
                  onClick={onUnlock}
                  className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Unlock
                </button>
              )}

              {/* Botón Eliminar */}
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="h-9 px-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> {deleteLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {confirmOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !busy && setConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-700" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900">
                  Delete campaign?
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  This will permanently delete the campaign and its drafts.
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmOpen(false)}
                className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleDelete}
                className="h-9 px-4 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60 inline-flex items-center gap-2"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
