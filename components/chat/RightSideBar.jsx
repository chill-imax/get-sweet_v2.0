// components/chat/RightSideBar.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Layout, X, ExternalLink, Loader2, Tag, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";

/**
 * RightSidebar
 * - Campaign view: tabs (Campaign | Brand)
 * - Sidebar is read-only; "Edit" opens full-page views
 * - Campaign data is loaded from localStorage for now
 *
 * Expected localStorage shape (either is fine):
 *  A) campaigns = [{ _id|id, name, objective, primaryGoal, successMetric, timeframe, channel }]
 *  B) campaignsById = { [id]: { ...campaign } }
 */
export default function RightSidebar({
  isOpen,
  setIsOpen,
  activeContext,
  mode = "campaign", // "campaign" | "brand"
  campaignId,
}) {
  const router = useRouter();
  const { companyData, loading: companyLoading } = useCompany();

  const [tab, setTab] = useState(mode === "campaign" ? "campaign" : "brand");
  const [campaign, setCampaign] = useState(null);

  // Keep tab sensible if caller changes mode
  useEffect(() => {
    setTab(mode === "campaign" ? "campaign" : "brand");
  }, [mode]);

  // Load campaign from localStorage (front-end only)
  useEffect(() => {
    if (mode !== "campaign") return;

    const id = String(campaignId || activeContext || "");
    if (!id) return;

    try {
      const byIdRaw = localStorage.getItem("campaignsById");
      if (byIdRaw) {
        const byId = JSON.parse(byIdRaw);
        if (byId && byId[id]) {
          setCampaign({ id, ...byId[id] });
          return;
        }
      }

      const listRaw = localStorage.getItem("campaigns");
      if (listRaw) {
        const list = JSON.parse(listRaw);
        const found =
          Array.isArray(list) &&
          list.find((c) => String(c?._id || c?.id) === id);

        if (found) {
          setCampaign({ ...found, id });
          return;
        }
      }

      // fallback
      setCampaign({ id, name: "Untitled campaign" });
    } catch {
      setCampaign({ id, name: "Untitled campaign" });
    }
  }, [mode, campaignId, activeContext]);

  const brandName = useMemo(
    () => companyData?.brandName || "Your brand",
    [companyData]
  );

  const close = () => setIsOpen?.(false);

  const goBrandFullPage = () => {
    // ✅ Full page brand details / confirm screen (you’ll create this page)
    router.push("/chat/brand-details");
    close();
  };

  const goCampaignFullPage = () => {
    const id = String(campaignId || activeContext || "");
    if (!id) return;
    router.push(`/chat/campaign/${id}/edit`);
    close();
  };

  const showCampaignUI = mode === "campaign";

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-gray-50 border-l flex flex-col transition-transform
      ${isOpen ? "translate-x-0" : "translate-x-full"} lg:relative lg:translate-x-0`}
    >
      {/* HEADER */}
      <div className="h-16 border-b flex items-center justify-between px-5 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <Layout className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-gray-700 truncate">
            {showCampaignUI ? "Context" : "Brand Details"}
          </h3>
        </div>

        <button
          onClick={close}
          className="lg:hidden text-gray-400 hover:bg-gray-100 p-1 rounded-full"
          aria-label="Close right sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* TABS (campaign view only) */}
      {showCampaignUI && (
        <div className="px-4 pt-4">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
            <button
              onClick={() => setTab("campaign")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition ${
                tab === "campaign"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Campaign
            </button>
            <button
              onClick={() => setTab("brand")}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold transition ${
                tab === "brand"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Brand
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* CAMPAIGN TAB */}
        {showCampaignUI && tab === "campaign" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Campaign</div>
                <div className="text-base font-semibold text-gray-900 truncate">
                  {campaign?.name || "Untitled campaign"}
                </div>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  ID: {String(campaign?.id || campaignId || activeContext || "")}
                </div>
              </div>

              <button
                onClick={goCampaignFullPage}
                className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Edit
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <InfoRow
                icon={Target}
                label="Objective"
                value={campaign?.objective || "Not set"}
              />
              <InfoRow
                icon={Tag}
                label="Primary goal"
                value={campaign?.primaryGoal || "Not set"}
              />
              <InfoRow
                label="Success metric"
                value={campaign?.successMetric || "Not set"}
              />
              <InfoRow
                label="Timeframe"
                value={
                  campaign?.timeframe || campaign?.goalTimeframe || "Not set"
                }
              />
              <InfoRow
                label="Primary channel"
                value={campaign?.channel || "Not set"}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 leading-snug">
                This sidebar is read-only. Use <b>Edit</b> to update campaign
                details in the full-page editor.
              </div>
            </div>
          </div>
        )}

        {/* BRAND TAB */}
        {(!showCampaignUI || tab === "brand") && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">Brand</div>
                <div className="text-base font-semibold text-gray-900 truncate">
                  {brandName}
                </div>
                {companyData?.industry ? (
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    Industry: {companyData.industry}
                  </div>
                ) : null}
              </div>

              <button
                onClick={goBrandFullPage}
                className="shrink-0 h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Edit
              </button>
            </div>

            {companyLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading brand…
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <InfoRow
                  label="Target audience"
                  value={companyData?.targetAudience || "Not set"}
                />
                <InfoRow
                  label="Mission"
                  value={companyData?.mission || "Not set"}
                />
                <InfoRow
                  label="Vision"
                  value={companyData?.vision || "Not set"}
                />
                <InfoRow
                  label="Primary goal"
                  value={companyData?.primaryGoal || "Not set"}
                />
                <InfoRow
                  label="Website"
                  value={companyData?.website || "Not set"}
                />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 leading-snug">
                Brand details are shared across campaigns. Edit them in the
                full-page brand details screen.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay handled by parent layout; sidebar stays as-is */}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-gray-700" />
        </div>
      ) : (
        <div className="w-9 h-9 shrink-0" />
      )}

      <div className="min-w-0">
        <div className="text-[11px] font-bold text-gray-500 uppercase">
          {label}
        </div>
        <div className="text-sm text-gray-800 break-words">{value}</div>
      </div>
    </div>
  );
}
