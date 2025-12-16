"use client";

import { useMemo, useState } from "react";
import { Trash2, Lock, Unlock, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

function Pill({ status }) {
  const map = {
    draft: { label: "Draft", cls: "bg-gray-50 text-gray-700 border-gray-200", Icon: AlertTriangle },
    generating: { label: "Generating…", cls: "bg-blue-50 text-blue-700 border-blue-200", Icon: RefreshCw },
    approved: { label: "Approved", cls: "bg-green-50 text-green-700 border-green-200", Icon: CheckCircle2 },
    locked: { label: "Locked", cls: "bg-amber-50 text-amber-800 border-amber-200", Icon: Lock },
  };

  const cfg = map[status] || map.draft;
  const Icon = cfg.Icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${cfg.cls}`}>
      <Icon className="w-4 h-4" />
      {cfg.label}
    </span>
  );
}

export default function CampaignStatusBanner({
  provider = "Google Ads",
  status = "draft", // "draft" | "generating" | "approved" | "locked"
  message, // optional override text
  onUnlock,
  onRegenerate,
  onDeleteCampaign, // ✅ NEW
  deleteLabel = "Delete campaign",
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const defaultMsg = useMemo(() => {
    if (status === "approved")
      return "This draft is locked. You can unlock to edit, or regenerate a new version.";
    if (status === "locked")
      return "This draft is locked. Unlock to edit or regenerate.";
    if (status === "generating")
      return "Draft is generating. Results will appear shortly.";
    return "Draft ready. Approve to lock, or regenerate to try a new version.";
  }, [status]);

  async function handleDelete() {
    if (!onDeleteCampaign) return;
    setErr("");
    setBusy(true);
    try {
      await onDeleteCampaign();
      setConfirmOpen(false);
    } catch (e) {
      console.error(e);
      setErr("Could not delete campaign. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="border-b border-gray-100 bg-white">
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {provider} draft
                </div>
                <Pill status={status} />
              </div>

              <div className="mt-1 text-sm text-gray-600">
                {message || defaultMsg}
              </div>

              {err ? (
                <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {err}
                </div>
              ) : null}
            </div>

            {/* Actions (right side) */}
            <div className="shrink-0 flex items-center gap-2">
              {status === "approved" || status === "locked" ? (
                <button
                  type="button"
                  onClick={onUnlock}
                  className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Unlock
                </button>
              ) : null}

              <button
                type="button"
                onClick={onRegenerate}
                className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>

              {/* ✅ Delete (only here, not sidebar) */}
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="h-9 px-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {deleteLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !busy && setConfirmOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-700" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-900">Delete campaign?</div>
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
                    <RefreshCw className="w-4 h-4 animate-spin" />
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
