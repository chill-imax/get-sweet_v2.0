import {
  Link as LinkIcon,
  RefreshCw,
  Trash2,
  Loader2,
  Pencil,
  ArrowRight,
} from "lucide-react";
import SourceStatusPill from "./SourceStatusPill";
import { formatTime } from "./utils";

export default function WebsiteSection({
  source,
  websiteUrl,
  setWebsiteUrl,
  isBusy,
  isLocked,
  onImport,
  onReimport,
  onClear,
  openConfirm,
}) {
  const isImporting = source.status === "importing";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
            <LinkIcon className="w-4 h-4 text-gray-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">Website URL</p>
              <SourceStatusPill status={source.status} />
            </div>
            <p className="text-xs text-gray-600">
              Recommended — best for services + contact info
            </p>
          </div>
        </div>

        {/* ACCIONES (Solo visibles si ya está listo) */}
        {source.status === "ready" && (
          <div className="flex items-center gap-2">
            <button
              onClick={onReimport}
              disabled={isBusy || isLocked}
              className="h-8 px-3 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Analyze Again
            </button>

            <button
              onClick={() =>
                openConfirm({
                  title: "Remove website source?",
                  body: "This will remove the website data from your brand profile.",
                  confirmText: "Remove",
                  action: onClear,
                })
              }
              disabled={isBusy || isLocked}
              className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 disabled:opacity-50 flex items-center justify-center transition-colors"
              title="Remove website"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* DATOS DE LA URL ACTUAL (Si existe) */}
      {source.url && (
        <div className="mb-3 px-3 py-2 bg-white border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate flex-1">
              <span className="text-xs text-gray-400 mr-2">ANALYZED URL:</span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline truncate"
              >
                {source.url}
              </a>
            </div>
            {source.lastUpdatedAt && (
              <div className="shrink-0 text-[10px] text-gray-400">
                {formatTime(source.lastUpdatedAt)}
              </div>
            )}
          </div>
          {source.error && (
            <div className="mt-1 text-xs text-red-600 bg-red-50 p-1.5 rounded flex items-center gap-1">
              ⚠️ {source.error}
            </div>
          )}
        </div>
      )}

      {/* INPUT AREA */}
      <div className="flex gap-2">
        <input
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://yourbrand.com"
          className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all disabled:bg-gray-100 disabled:text-gray-500"
          disabled={isBusy || isLocked}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isBusy && !isLocked) onImport();
          }}
        />

        <button
          onClick={onImport}
          disabled={!websiteUrl || isBusy || isLocked}
          className={`h-10 px-4 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 transition-all shadow-sm
            ${
              isBusy
                ? "bg-gray-400 cursor-wait"
                : "bg-gray-900 hover:bg-black hover:shadow-md"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : source.status === "ready" ? (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Replace</span>
            </>
          ) : (
            <>
              <span>Analyze</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
