"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Copy, Download } from "lucide-react";

import {
  getCampaignOutputs,
  updateCampaignOutput,
} from "@/components/chat/campaign/campaignStorage";

function pretty(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export default function CampaignOutputViewerPage() {
  const router = useRouter();
  const { id, outputId } = useParams();

  const campaignId = String(id);
  const outId = String(outputId);

  const [output, setOutput] = useState(null);

  useEffect(() => {
    const list = getCampaignOutputs(campaignId);
    const found = list.find((o) => String(o.outputId) === outId);
    setOutput(found || null);
  }, [campaignId, outId]);

  const title = useMemo(() => output?.title || "Output", [output]);

  function back() {
    router.push(`/chat/campaign/${campaignId}`);
  }

  function approve() {
    updateCampaignOutput(campaignId, outId, {
      status: "approved",
      updatedAt: new Date().toISOString(),
    });
    // refresh local state
    const list = getCampaignOutputs(campaignId);
    setOutput(list.find((o) => String(o.outputId) === outId) || null);
  }

  async function copyJson() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(pretty(output.payload));
      alert("Copied JSON to clipboard");
    } catch {
      alert("Copy failed");
    }
  }

  function downloadJson() {
    if (!output) return;
    const blob = new Blob([pretty(output.payload)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaignId}-${outId}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  if (!output) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
          <div className="text-sm text-gray-500">Output not found</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            This output may have been deleted.
          </div>
          <button
            onClick={back}
            className="mt-4 h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
          >
            Back to campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={back}
            className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="min-w-0">
            <div className="text-xs text-gray-500 truncate">Campaign {campaignId}</div>
            <div className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyJson}
              className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy JSON
            </button>

            <button
              onClick={downloadJson}
              className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            {output.status !== "approved" ? (
              <button
                onClick={approve}
                className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
            ) : (
              <span className="h-10 px-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold inline-flex items-center">
                Approved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Summary:</span>{" "}
            {output.summary || "—"}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-xs font-bold text-gray-500 uppercase">
              Payload (preview)
            </div>
            <pre className="mt-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-auto">
{pretty(output.payload)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
