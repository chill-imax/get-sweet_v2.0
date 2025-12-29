"use client";

import { useParams } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  MousePointer2,
  DollarSign,
  Activity,
  AlertCircle,
  Loader2,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  Info,
} from "lucide-react";
// 👇 IMPORTANTE: Consumimos el contexto
import { useCampaign } from "@/context/CampaignContext";
import AdGroupToggle from "./AdGroupToggle";

export default function ResultsPanel() {
  const { id } = useParams();

  // 👇 Consumimos datos y acciones del Contexto (Cero fetch local)
  const { analyticsData, isSyncing, refreshData } = useCampaign();

  // 1. ESTADO DE CARGA (Solo si no hay datos previos)
  // Si ya hay datos (analyticsData), no mostramos loading aunque isSyncing sea true (refresco silencioso)
  if (isSyncing && !analyticsData) {
    return (
      <div className="flex h-full items-center justify-center text-indigo-600 bg-gray-50/50 min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-medium text-gray-600">
            Syncing live data from Google Ads...
          </span>
        </div>
      </div>
    );
  }

  // 2. ESTADO VACÍO / NO PUBLICADO
  // Si terminó de cargar y no hay analyticsData, es que no está publicada o falló
  if (!analyticsData) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-400 p-10 text-center border-2 border-dashed border-gray-200 rounded-3xl m-6 min-h-[500px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-700">No Analytics Yet</h3>
        <p className="max-w-xs mx-auto mt-2 text-sm text-gray-500">
          This campaign hasn&apos;t been launched yet. Publish it to see
          real-time performance data here.
        </p>
      </div>
    );
  }

  // 3. RENDERIZADO DE DATOS
  const { overview, ads } = analyticsData;

  return (
    <div className="p-6 space-y-8 pb-24 animate-in fade-in">
      {/* HEADER & STATUS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Performance Dashboard
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-sm text-gray-500">Live data (Last 30 Days)</p>
          </div>
        </div>
        <CampaignStatusBadge status={overview.status} />
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Impressions"
          value={overview.impressions.toLocaleString()}
          icon={Activity}
          color="blue"
          tooltip="Views on search results."
        />
        <KpiCard
          title="Clicks"
          value={overview.clicks.toLocaleString()}
          icon={MousePointer2}
          color="purple"
          tooltip="Visits to your site."
        />
        <KpiCard
          title="CTR"
          value={`${overview.ctr.toFixed(2)}%`}
          icon={TrendingUp}
          color="green"
          tooltip="Click-Through Rate."
        />
        <KpiCard
          title="Cost"
          value={`$${overview.cost.toFixed(2)}`}
          icon={DollarSign}
          color="amber"
          tooltip="Total spend."
        />
      </div>

      {/* TABLA DE SALUD Y ESTADO DE ANUNCIOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500" />
            Ads Quality & Status
          </h3>
          <span className="text-xs text-gray-400">Updates every 24h</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="p-4 w-1/4">Ad Group</th>
                  <th className="p-4 text-center">Active?</th>
                  <th className="p-4">Policy Status</th>
                  <th className="p-4">Ad Strength</th>
                  <th className="p-4 text-right">Metrics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ads.map((ad, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 font-bold text-gray-800">
                      {ad.groupName}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        {/* 👇 Usamos refreshData del contexto para recargar todo al cambiar un toggle */}
                        <AdGroupToggle
                          campaignId={id}
                          adGroup={ad}
                          onRefresh={refreshData}
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <AdStatusCell
                        userStatus={ad.status}
                        reviewStatus={ad.reviewStatus}
                        approvalStatus={ad.approvalStatus}
                        issues={ad.policyIssues}
                      />
                    </td>

                    <td className="p-4">
                      <StrengthIndicator strength={ad.strength} />
                    </td>

                    <td className="p-4 text-right">
                      <div className="font-bold text-gray-900">
                        {ad.clicks}{" "}
                        <span className="text-xs font-normal text-gray-400">
                          clicks
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {ad.impressions} impr.
                      </div>
                    </td>
                  </tr>
                ))}
                {ads.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-gray-400 italic"
                    >
                      No active ads found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTES UI (Sin Cambios) ---

function KpiCard({ title, value, icon: Icon, color, tooltip }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100",
    purple:
      "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100",
    green:
      "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100",
    amber:
      "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100",
  };

  return (
    <div
      className={`group relative border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all bg-white cursor-default ${
        styles[color].replace("text", "border").split(" group")[0]
      }`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${styles[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {tooltip && (
          <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
            <Info className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 tracking-tight">
        {value}
      </div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide opacity-80">
        {title}
      </div>
      {tooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
          {tooltip}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

function CampaignStatusBadge({ status }) {
  const isActive = status === "ENABLED";
  const isPaused = status === "PAUSED";

  let color = "bg-gray-100 text-gray-600 border-gray-200";
  let iconColor = "bg-gray-400";

  if (isActive) {
    color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    iconColor = "bg-emerald-500 animate-pulse";
  }
  if (isPaused) {
    color = "bg-amber-50 text-amber-700 border-amber-200";
    iconColor = "bg-amber-500";
  }

  return (
    <div
      className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 uppercase tracking-wide ${color}`}
    >
      <div className={`w-2 h-2 rounded-full ${iconColor}`} />
      {status || "UNKNOWN"}
    </div>
  );
}

function AdStatusCell({ userStatus, reviewStatus, approvalStatus, issues }) {
  if (userStatus === "PAUSED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Paused by User
      </span>
    );
  }
  if (reviewStatus === "REVIEW_IN_PROGRESS") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
        <Clock className="w-3 h-3" />
        In Review
      </span>
    );
  }
  if (approvalStatus === "DISAPPROVED") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
          <Ban className="w-3 h-3" />
          Not Displaying
        </span>
        {issues?.length > 0 && (
          <span className="text-[10px] text-red-500 max-w-45 leading-tight ml-1 font-medium">
            Reason: {issues.map((i) => i.topic).join(", ")}
          </span>
        )}
      </div>
    );
  }
  if (approvalStatus === "APPROVED_LIMITED") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
          <AlertTriangle className="w-3 h-3" />
          Limited
        </span>
        {issues?.length > 0 && (
          <span className="text-[10px] text-amber-600 max-w-45 leading-tight ml-1">
            Policy: {issues.map((i) => i.topic).join(", ")}
          </span>
        )}
      </div>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
      <CheckCircle2 className="w-3 h-3" />
      Active & Live
    </span>
  );
}

function StrengthIndicator({ strength }) {
  const s = strength || "PENDING";
  let bars = 0;
  let colorClass = "text-gray-300";
  let label = "Learning";

  if (s === "POOR") {
    bars = 1;
    colorClass = "text-red-500";
    label = "Poor";
  }
  if (s === "AVERAGE") {
    bars = 2;
    colorClass = "text-yellow-500";
    label = "Average";
  }
  if (s === "GOOD") {
    bars = 3;
    colorClass = "text-blue-500";
    label = "Good";
  }
  if (s === "EXCELLENT") {
    bars = 4;
    colorClass = "text-emerald-500";
    label = "Excellent";
  }

  return (
    <div className="flex items-center gap-2" title={`Ad Strength: ${s}`}>
      <div className="flex items-end gap-1 h-4">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-1 rounded-sm transition-all ${
              level <= bars ? colorClass.replace("text-", "bg-") : "bg-gray-200"
            }`}
            style={{ height: `${level * 25}%` }}
          />
        ))}
      </div>
      <span className={`text-xs font-semibold ${colorClass}`}>{label}</span>
    </div>
  );
}
