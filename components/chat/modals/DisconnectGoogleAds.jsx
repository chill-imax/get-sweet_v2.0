"use client";
import { AlertTriangle, X, Loader2 } from "lucide-react";

export default function DisconnectModal({
  activeCampaigns,
  onConfirm,
  onCancel,
  isDisconnecting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-amber-100">
        {/* Header */}
        <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Active Campaigns Detected
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              You have{" "}
              <span className="font-bold text-amber-700">
                {activeCampaigns.length} campaigns
              </span>{" "}
              currently running on Google Ads.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            If you disconnect now, Sweet AI will attempt to{" "}
            <span className="font-bold text-gray-900">PAUSE</span> these
            campaigns automatically so they don&apos;t keep spending money while
            you are away.
          </p>

          {/* Lista de campañas afectadas */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 max-h-40 overflow-y-auto mb-6">
            {activeCampaigns.map((c) => (
              <div
                key={c._id}
                className="px-4 py-3 border-b border-gray-100 last:border-0 text-sm flex justify-between items-center"
              >
                <span className="font-medium text-gray-700 truncate max-w-50">
                  {c.name}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isDisconnecting}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDisconnecting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Pausing &
                  Disconnecting...
                </>
              ) : (
                "Pause All & Disconnect"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
