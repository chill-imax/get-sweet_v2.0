"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCcw,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function CampaignStatusBanner({
  status = "draft", // "draft" | "approved" | "locked" | "error"
  provider = "Google Ads",

  // actions (optional)
  onUnlock,
  onRegenerate,
  onDelete,

  // optional copy override
  title,
  description,
}) {
  const [busy, setBusy] = useState(null); // "unlock" | "regen" | "delete" | null

  const isLocked = status === "approved" || status === "locked";

  const defaultTitle = `${provider} draft ${isLocked ? "approved" : "draft"}`;
  const defaultDesc = isLocked
    ? "This draft is locked. You can unlock to edit, or regenerate a new version."
    : "This draft is editable. When ready, approve to lock it.";

  async function run(action, fn) {
    if (!fn) return;
    try {
      setBusy(action);
      await fn();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="px-6 pt-4">
      <div className="max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
              {status === "error" ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : isLocked ? (
                <Lock className="w-5 h-5 text-green-700" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-gray-700" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {title || defaultTitle}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {description || defaultDesc}
                  </div>
                </div>
              </div>

              {/* Buttons: FULL-WIDTH at bottom */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => run("unlock", onUnlock)}
                  disabled={!onUnlock || !isLocked || busy}
                  className="h-10 w-full rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {busy === "unlock" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  Unlock
                </button>

                <button
                  type="button"
                  onClick={() => run("regen", onRegenerate)}
                  disabled={!onRegenerate || busy}
                  className="h-10 w-full rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {busy === "regen" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="w-4 h-4" />
                  )}
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={() => run("delete", onDelete)}
                  disabled={!onDelete || busy}
                  className="h-10 w-full rounded-xl bg-white border border-gray-200 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  title="Delete this campaign"
                >
                  {busy === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                (Front-end only for now) Hook these to backend/jobs later.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
