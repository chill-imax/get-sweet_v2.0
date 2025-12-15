"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";

export default function BrandImportPanel({
  brandStatus = "none", // "none" | "importing" | "draft_ready" | "locked" | "failed"
  onStartImport,
  onJobCreated,
  onDraftReady,
  onConfirmBrand,
  onImportFailed,
  onGoToAIBrandSetup,

  // when user returns from AI page
  aiCompletedSignal = 0,
  onAICompletedHandled,
}) {
  // ----------------------------
  // Local source meta (no history)
  // ----------------------------
  const [sources, setSources] = useState({
    website: { status: "none", url: "", lastUpdatedAt: null, error: null },
    deck: { status: "none", fileName: "", cloudinaryUrl: "", lastUpdatedAt: null, error: null },
    ai: { status: "none", lastUpdatedAt: null }, // "none" | "ready"
  });

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    body: "",
    confirmText: "Confirm",
    action: null,
  });

  const isBusy =
    sources.website.status === "importing" || sources.deck.status === "importing";

  // Mark AI source as added when user comes back from /chat/brand-ai
  useEffect(() => {
    if (!aiCompletedSignal) return;

    setSources((prev) => ({
      ...prev,
      ai: { status: "ready", lastUpdatedAt: new Date().toISOString() },
    }));

    onDraftReady?.();

    // remove query param so refresh doesn't re-trigger
    onAICompletedHandled?.();
  }, [aiCompletedSignal, onDraftReady, onAICompletedHandled]);

  const helperText = useMemo(() => {
    if (brandStatus === "locked")
      return "Brand is confirmed. You can create goals and campaigns.";
    if (brandStatus === "draft_ready")
      return "Draft updated. Review the right panel and confirm to continue.";
    if (isBusy) return "Importing… extracting brand info from your sources.";
    return "Add a website and/or deck. You can also answer AI questions to fill gaps.";
  }, [brandStatus, isBusy]);

  function formatTime(d) {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  }

  function SourceStatusPill({ status }) {
    const map = {
      none: {
        label: "Not added",
        icon: null,
        cls: "bg-gray-100 text-gray-600 border-gray-200",
      },
      importing: {
        label: "Importing…",
        icon: Loader2,
        cls: "bg-blue-50 text-blue-700 border-blue-200",
      },
      ready: {
        label: "Added",
        icon: CheckCircle2,
        cls: "bg-green-50 text-green-700 border-green-200",
      },
      failed: {
        label: "Failed",
        icon: XCircle,
        cls: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const cfg = map[status] || map.none;
    const Icon = cfg.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full border ${cfg.cls}`}
      >
        {Icon ? (
          <Icon
            className={`w-3.5 h-3.5 ${status === "importing" ? "animate-spin" : ""}`}
          />
        ) : null}
        {cfg.label}
      </span>
    );
  }

  function openConfirm({ title, body, confirmText = "Confirm", action }) {
    setConfirm({ open: true, title, body, confirmText, action });
  }

  function closeConfirm() {
    setConfirm({ open: false, title: "", body: "", confirmText: "Confirm", action: null });
  }

  function clearWebsiteSource() {
    setSources((prev) => ({
      ...prev,
      website: { status: "none", url: "", lastUpdatedAt: null, error: null },
    }));
    setWebsiteUrl("");
  }

  function clearDeckSource() {
    setSources((prev) => ({
      ...prev,
      deck: { status: "none", fileName: "", cloudinaryUrl: "", lastUpdatedAt: null, error: null },
    }));
    if (fileRef.current) fileRef.current.value = "";
  }

  function clearAISource() {
    setSources((prev) => ({
      ...prev,
      ai: { status: "none", lastUpdatedAt: null },
    }));
  }

  function resetAllSources() {
    clearWebsiteSource();
    clearDeckSource();
    clearAISource();
    setError("");
    // Optional: you might also want to inform the parent to revert flow:
    // onReset?.()
  }

  // ----------------------------
  // Website import / replace
  // ----------------------------
  async function handleImportFromWebsite() {
    setError("");
    const url = websiteUrl.trim();
    if (!url) return setError("Please enter a website URL.");

    setSources((prev) => ({
      ...prev,
      website: { ...prev.website, status: "importing", url, error: null },
    }));

    onStartImport?.("website");

    try {
      // TODO: wire netlify function
      // const res = await fetch("/.netlify/functions/brand-import-start", { ... })
      // if (!res.ok) throw new Error()
      await new Promise((r) => setTimeout(r, 900));

      setSources((prev) => ({
        ...prev,
        website: {
          ...prev.website,
          status: "ready",
          lastUpdatedAt: new Date().toISOString(),
          error: null,
        },
      }));

      onDraftReady?.();
    } catch (e) {
      const msg = "Failed to import from website. Please try again.";
      setSources((prev) => ({
        ...prev,
        website: { ...prev.website, status: "failed", error: msg },
      }));
      setError(msg);
      onImportFailed?.();
    }
  }

  async function handleReimportWebsite() {
    if (!sources.website.url) return;
    setWebsiteUrl(sources.website.url);
    await handleImportFromWebsite();
  }

  // ----------------------------
  // Deck upload / replace
  // ----------------------------
  async function handleUploadPdf(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return setError("Please upload a PDF file.");

    setSources((prev) => ({
      ...prev,
      deck: { ...prev.deck, status: "importing", fileName: file.name, error: null },
    }));

    onStartImport?.("deck");

    try {
      // TODO:
      // 1) upload to cloudinary => cloudinaryUrl
      // 2) call netlify function with { cloudinaryUrl, fileName }
      // 3) backend extracts and merges

      await new Promise((r) => setTimeout(r, 1200));

      setSources((prev) => ({
        ...prev,
        deck: {
          ...prev.deck,
          status: "ready",
          cloudinaryUrl: prev.deck.cloudinaryUrl || "cloudinary://placeholder",
          lastUpdatedAt: new Date().toISOString(),
          error: null,
        },
      }));

      onDraftReady?.();
    } catch (e) {
      const msg = "Failed to upload or process the PDF. Please try again.";
      setSources((prev) => ({
        ...prev,
        deck: { ...prev.deck, status: "failed", error: msg },
      }));
      setError(msg);
      onImportFailed?.();
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleReplaceDeckClick() {
    fileRef.current?.click();
  }

  const anySourceReady =
    sources.website.status === "ready" ||
    sources.deck.status === "ready" ||
    sources.ai.status === "ready";

  return (
    <div className="h-full flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl">
        {/* Header + Reset */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Import your brand</h1>
            <p className="text-sm text-gray-600 mt-1">{helperText}</p>
          </div>

          <button
            disabled={isBusy || brandStatus === "locked"}
            onClick={() =>
              openConfirm({
                title: "Reset all sources?",
                body: "This will remove the website, deck, and AI answers from this setup screen. (No history is stored.)",
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

        <div className="grid gap-4">
          {/* WEBSITE */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                  <LinkIcon className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">Website URL</p>
                    <SourceStatusPill status={sources.website.status} />
                  </div>
                  <p className="text-xs text-gray-600">
                    Recommended — best for services + contact info
                  </p>
                </div>
              </div>

              {sources.website.status === "ready" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReimportWebsite}
                    disabled={isBusy || brandStatus === "locked"}
                    className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Update
                  </button>

                  <button
                    onClick={() =>
                      openConfirm({
                        title: "Remove website source?",
                        body: "This will remove the website URL and extracted info from the current setup screen.",
                        confirmText: "Remove",
                        action: clearWebsiteSource,
                      })
                    }
                    disabled={isBusy || brandStatus === "locked"}
                    className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ) : null}
            </div>

            {sources.website.url ? (
              <div className="mb-3 text-xs text-gray-700">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-gray-500">URL:</span>{" "}
                    <span className="font-semibold">{sources.website.url}</span>
                  </div>
                  {sources.website.lastUpdatedAt ? (
                    <div className="shrink-0 text-gray-500">
                      Updated {formatTime(sources.website.lastUpdatedAt)}
                    </div>
                  ) : null}
                </div>
                {sources.website.error ? (
                  <div className="mt-2 text-red-600">{sources.website.error}</div>
                ) : null}
              </div>
            ) : null}

            <div className="flex gap-2">
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200"
                disabled={isBusy || brandStatus === "locked"}
              />
              <button
                onClick={handleImportFromWebsite}
                disabled={isBusy || brandStatus === "locked"}
                className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {sources.website.status === "importing" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
                {sources.website.status === "ready" ? "Replace" : "Import"}
              </button>
            </div>
          </div>

          {/* DECK */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      Brand / pitch deck (PDF)
                    </p>
                    <SourceStatusPill status={sources.deck.status} />
                  </div>
                  <p className="text-xs text-gray-600">
                    Best for mission, positioning, voice, differentiators
                  </p>
                </div>
              </div>

              {sources.deck.status === "ready" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReplaceDeckClick}
                    disabled={isBusy || brandStatus === "locked"}
                    className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Update
                  </button>

                  <button
                    onClick={() =>
                      openConfirm({
                        title: "Remove deck source?",
                        body: "This will remove the current PDF from this setup screen. You can upload a new deck anytime.",
                        confirmText: "Remove",
                        action: clearDeckSource,
                      })
                    }
                    disabled={isBusy || brandStatus === "locked"}
                    className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ) : null}
            </div>

            {sources.deck.fileName ? (
              <div className="mb-3 text-xs text-gray-700">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-gray-500">File:</span>{" "}
                    <span className="font-semibold">{sources.deck.fileName}</span>
                  </div>
                  {sources.deck.lastUpdatedAt ? (
                    <div className="shrink-0 text-gray-500">
                      Updated {formatTime(sources.deck.lastUpdatedAt)}
                    </div>
                  ) : null}
                </div>
                {sources.deck.error ? (
                  <div className="mt-2 text-red-600">{sources.deck.error}</div>
                ) : null}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleUploadPdf}
                className="hidden"
                disabled={isBusy || brandStatus === "locked"}
              />

              <button
                onClick={() => fileRef.current?.click()}
                disabled={isBusy || brandStatus === "locked"}
                className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {sources.deck.status === "importing" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {sources.deck.status === "ready" ? "Upload new PDF" : "Upload PDF"}
              </button>

              <p className="text-xs text-gray-600">
                We’ll extract key brand info automatically.
              </p>
            </div>
          </div>

          {/* AI */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">AI questions</p>
                    <SourceStatusPill status={sources.ai.status} />
                  </div>
                  <p className="text-xs text-gray-600">
                    Optional — fill gaps after website/deck import.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onGoToAIBrandSetup}
                  disabled={brandStatus === "locked"}
                  className="h-9 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sources.ai.status === "ready" ? "Update" : "Start"}
                </button>

                {sources.ai.status === "ready" ? (
                  <button
                    onClick={() =>
                      openConfirm({
                        title: "Remove AI answers?",
                        body: "This will clear the AI question results from this setup screen.",
                        confirmText: "Remove",
                        action: clearAISource,
                      })
                    }
                    disabled={brandStatus === "locked"}
                    className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            {sources.ai.lastUpdatedAt ? (
              <div className="mt-3 text-xs text-gray-500">
                Updated {formatTime(sources.ai.lastUpdatedAt)}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          ) : null}

          {/* Confirm */}
          {(brandStatus === "draft_ready" || anySourceReady) && brandStatus !== "locked" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-900">Brand draft ready</p>
                <p className="text-xs text-green-800">
                  Review it in the right panel, then confirm to continue.
                </p>
              </div>
              <button
                onClick={() => onConfirmBrand?.()}
                className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800"
              >
                Confirm brand
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeConfirm} />
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl border border-gray-200 shadow-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{confirm.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{confirm.body}</p>
              </div>
              <button
                onClick={closeConfirm}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeConfirm}
                className="h-9 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const action = confirm.action;
                  closeConfirm();
                  action?.();
                }}
                className="h-9 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
              >
                {confirm.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
