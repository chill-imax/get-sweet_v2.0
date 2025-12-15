"use client";

import { useMemo, useRef, useState } from "react";
import { Upload, Link as LinkIcon, Sparkles, FileText, Loader2 } from "lucide-react";

export default function BrandImportPanel({
  brandStatus = "none", // "none" | "importing" | "draft_ready" | "locked"
  onStartImport,
  onDraftReady,
  onConfirmBrand,
}) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [useAIMode, setUseAIMode] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const isBusy = brandStatus === "importing";

  const helperText = useMemo(() => {
    if (brandStatus === "locked") return "Brand is confirmed. You can create goals and campaigns.";
    if (brandStatus === "draft_ready") return "Brand draft is ready. Review and confirm to continue.";
    if (brandStatus === "importing") return "Importing… extracting brand info from your sources.";
    return "Start by importing from a real source (recommended).";
  }, [brandStatus]);

  async function handleImportFromWebsite() {
    setError("");
    if (!websiteUrl.trim()) return setError("Please enter a website URL.");
    try {
      onStartImport?.();

      // TODO: Replace with your Netlify function call:
      // await fetch("/.netlify/functions/brand-import-start", { method: "POST", body: JSON.stringify({ websiteUrl }) })

      // Mock delay
      await new Promise((r) => setTimeout(r, 900));

      onDraftReady?.();
    } catch (e) {
      setError("Failed to import from website. Please try again.");
    }
  }

  async function handleUploadPdf(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return setError("Please upload a PDF file.");

    try {
      onStartImport?.();

      // TODO: Upload to Cloudinary + send publicId/url to your Netlify function
      // 1) upload
      // 2) call brand-import-start with { cloudinaryUrl/publicId }

      // Mock delay
      await new Promise((r) => setTimeout(r, 1200));

      onDraftReady?.();
    } catch (e) {
      setError("Failed to upload or process the PDF. Please try again.");
    }
  }

  async function handleDescribeWithAI() {
    setError("");
    if (!aiDescription.trim()) return setError("Please describe your brand in 1–3 sentences.");
    try {
      onStartImport?.();

      // TODO: call your endpoint to create a draft from text:
      // await fetch("/.netlify/functions/brand-import-start", { method: "POST", body: JSON.stringify({ aiDescription }) })

      await new Promise((r) => setTimeout(r, 900));
      onDraftReady?.();
    } catch (e) {
      setError("Failed to create a brand draft. Please try again.");
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Import your brand</h1>
          <p className="text-sm text-gray-600 mt-1">{helperText}</p>
        </div>

        <div className="grid gap-4">
          {/* Primary: Website URL */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Website URL</p>
                <p className="text-xs text-gray-600">Recommended — fastest, most accurate</p>
              </div>
            </div>

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
                {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Import
              </button>
            </div>
          </div>

          {/* Primary: PDF Upload */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Upload a pitch / brand deck (PDF)</p>
                <p className="text-xs text-gray-600">Great for positioning, voice, and differentiators</p>
              </div>
            </div>

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
                {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload PDF
              </button>

              <p className="text-xs text-gray-600">
                We’ll extract key brand info automatically.
              </p>
            </div>
          </div>

          {/* Secondary: Describe with AI */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Describe with AI</p>
                  <p className="text-xs text-gray-600">Optional — best if you don’t have a website or deck</p>
                </div>
              </div>

              <button
                onClick={() => setUseAIMode((v) => !v)}
                className="text-xs font-semibold text-gray-700 hover:underline"
              >
                {useAIMode ? "Hide" : "Open"}
              </button>
            </div>

            {useAIMode && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="Example: We’re a local plumbing company offering emergency repairs, water heaters, and drain cleaning. We’re known for fast response and transparent pricing."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  disabled={isBusy || brandStatus === "locked"}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleDescribeWithAI}
                    disabled={isBusy || brandStatus === "locked"}
                    className="h-9 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Create draft
                  </button>
                </div>
              </div>
            )}
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          ) : null}

          {/* Confirm step (simple MVP) */}
          {brandStatus === "draft_ready" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-900">Brand draft ready</p>
                <p className="text-xs text-green-800">Review it in the right panel, then confirm to continue.</p>
              </div>
              <button
                onClick={() => onConfirmBrand?.()}
                className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800"
              >
                Confirm brand
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
