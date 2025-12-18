"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";

// Imports Modulares (Ajusta la ruta según tu estructura)
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
            disabled={isBusy || isLocked}
            onClick={() =>
              openConfirm({
                title: "Reset all sources?",
                body: "This will remove the website, uploaded PDFs, and AI answers from this setup screen.",
                confirmText: "Reset",
                action: resetAllSources,
              })
            }
            className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
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
            onClear={clearAISource}
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
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
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
                className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800"
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
