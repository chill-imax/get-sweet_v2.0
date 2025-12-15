"use client";

import {
  Lock,
  Unlock,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function CampaignStatusBanner({
  status = "approved", 
  provider = "Google Ads",
  onUnlock,
  onRegenerate,
}) {
  /**
   * status:
   * - "draft"
   * - "approved"
   * - "running"
   * - "needs_review"
   */

  const config = {
    draft: {
      icon: AlertTriangle,
      title: `${provider} draft ready`,
      body: "Review and approve before launch.",
      tone: "bg-amber-50 border-amber-200 text-amber-900",
    },
    approved: {
      icon: CheckCircle,
      title: `${provider} draft approved`,
      body:
        "This draft is locked. You can unlock to edit, or regenerate a new version.",
      tone: "bg-green-50 border-green-200 text-green-900",
    },
    running: {
      icon: CheckCircle,
      title: `${provider} campaign live`,
      body: "This campaign is active and collecting performance data.",
      tone: "bg-blue-50 border-blue-200 text-blue-900",
    },
    needs_review: {
      icon: AlertTriangle,
      title: "Draft needs review",
      body:
        "Some assets failed validation. Review before attempting to publish.",
      tone: "bg-red-50 border-red-200 text-red-900",
    },
  };

  const cfg = config[status] || config.draft;
  const Icon = cfg.icon;

  return (
    <div className={`mx-6 mt-4 rounded-2xl border p-4 ${cfg.tone}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/60 border flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>

          <div>
            <div className="font-semibold text-sm">{cfg.title}</div>
            <div className="text-sm mt-1 opacity-90">{cfg.body}</div>
          </div>
        </div>

        {/* ACTIONS */}
        {status === "approved" && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onUnlock}
              className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-semibold hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Unlock
            </button>

            <button
              onClick={onRegenerate}
              className="h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
