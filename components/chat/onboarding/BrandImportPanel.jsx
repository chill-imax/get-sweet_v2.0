"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import api from "@/app/api/auth/axios"; // ✅ Instancia centralizada

// Contextos
import { useToast } from "@/context/ToastContext";

// Imports Modulares
import { useBrandSources } from "./useBrandSources";
import { buildDraftFromSources } from "./utils";
import ConfirmModal from "./ConfirmModal";
import WebsiteSection from "./WebsiteSection";
import DeckSection from "./DeckSection";
import AISection from "./AISection";

export default function BrandImportPanel({
  brandStatus = "none",
  onStartImport,
  onDraftReady,
  onImportFailed,
  onGoToAIBrandSetup,
  aiCompletedSignal = 0,
  onAICompletedHandled,
  onConfirmBrand,
}) {
  // ❌ const { token } = useAuth(); // Ya no es necesario
  const toast = useToast();

  // Estado local para el loading del botón Reset
  const [isResetting, setIsResetting] = useState(false);

  // Toda la lógica de negocio y contexto vive aquí dentro
  const {
    sources,
    websiteUrl,
    setWebsiteUrl,
    error,
    isBusy,
    fileRef,
    confirm,
    handleImportFromWebsite,
    handleReimportWebsite,
    clearWebsiteSource,
    handleUploadPdfs,
    triggerDeckPicker,
    clearAllDecks,
    removeDeck,
    clearAISource,
    resetAllSources,
    openConfirm,
    closeConfirm,
  } = useBrandSources({
    onStartImport,
    onDraftReady,
    onImportFailed,
    onAICompletedHandled,
    aiCompletedSignal,
  });

  const isLocked = brandStatus === "locked";

  // --- LÓGICA DE RESET COMPLETO (DB + FRONT) ---
  const handleDeepReset = async () => {
    setIsResetting(true);
    try {
      // 1. Limpiar en Base de Datos (Estrategia + Sources)
      // ✅ Axios DELETE
      await api.delete("/api/v1/company/brand-reset");

      // 2. Si el servidor respondió OK (Axios lanza error si no), limpiamos el Frontend
      resetAllSources();

      toast?.success("Brand data cleared successfully");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Error resetting brand data";
      toast?.error(errorMsg);
    } finally {
      setIsResetting(false);
      closeConfirm();
    }
  };

  const anySourceReady =
    sources.website.status === "ready" ||
    sources.decks.some((d) => d.status === "ready") ||
    sources.ai.status === "ready";

  const helperText = useMemo(() => {
    if (brandStatus === "locked")
      return "Brand is confirmed. You can create goals and campaigns.";
    if (brandStatus === "draft_ready")
      return "Draft updated. Click Confirm to review in full-page Brand Details.";
    if (isBusy) return "Importing… extracting brand info from your sources.";
    return "Add a website and/or multiple PDFs. You can also answer AI questions to fill gaps.";
  }, [brandStatus, isBusy]);

  return (
    <div className="h-full flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl">
        {/* Header + Reset */}
        <div className="mb-4 flex items-center justify-between gap-4 ">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 pt-4">
              Import your brand
            </h1>
            <p className="text-sm text-gray-600 mt-1">{helperText}</p>
          </div>

          <button
            disabled={isBusy || isLocked || isResetting}
            onClick={() =>
              openConfirm({
                title: "Reset all brand data?",
                body: "This will delete all saved brand info (Website, PDFs, AI Chat) from the database and clear the current form. This action cannot be undone.",
                confirmText: isResetting ? "Clearing..." : "Reset Everything",
                action: handleDeepReset,
                isDanger: true,
              })
            }
            className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 transition-colors"
          >
            {isResetting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Reset all
          </button>
        </div>

        <div className="grid gap-4 pb-4">
          {/* WEBSITE MODULE */}
          <WebsiteSection
            source={sources.website}
            websiteUrl={websiteUrl}
            setWebsiteUrl={setWebsiteUrl}
            isBusy={isBusy}
            isLocked={isLocked}
            onImport={handleImportFromWebsite}
            onReimport={handleReimportWebsite}
            onClear={clearWebsiteSource}
            openConfirm={openConfirm}
          />

          {/* DECKS/PDF MODULE */}
          <DeckSection
            decks={sources.decks}
            isBusy={isBusy}
            isLocked={isLocked}
            fileRef={fileRef}
            onUpload={handleUploadPdfs}
            onTriggerPicker={triggerDeckPicker}
            onClearAll={clearAllDecks}
            onRemoveOne={removeDeck}
            openConfirm={openConfirm}
          />

          {/* AI MODULE */}
          <AISection
            source={sources.ai}
            isLocked={isLocked}
            onGoToSetup={onGoToAIBrandSetup}
            onClear={clearAISource} // ✅ Esto borra historial de chat
            openConfirm={openConfirm}
          />

          {/* GLOBAL ERROR */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          )}

          {/* CONFIRM ACTION */}
          {(brandStatus === "draft_ready" || anySourceReady) && !isLocked && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <div>
                <p className="text-sm font-semibold text-green-900">
                  Brand draft ready
                </p>
                <p className="text-xs text-green-800">
                  Confirm to review in full-page Brand Details.
                </p>
              </div>
              <button
                onClick={() => {
                  const draft = buildDraftFromSources(sources);
                  onConfirmBrand?.(draft);
                }}
                className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-all shadow-sm hover:shadow-md"
              >
                Confirm brand
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <ConfirmModal confirmState={confirm} onClose={closeConfirm} />
    </div>
  );
}
