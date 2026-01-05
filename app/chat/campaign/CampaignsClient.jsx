"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Plus, Clock, BadgeCheck, PauseCircle } from "lucide-react";
import { SiGoogleads, SiTiktok, SiMeta, SiLinkedin, SiX } from "react-icons/si";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import { useAuth } from "@/context/useContext";

/* -----------------------------
   Small UI helpers
------------------------------ */

function Pill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 px-4 rounded-full border text-sm font-semibold transition ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function StatusPill({ status }) {
  const map = {
    draft: {
      label: "Draft",
      cls: "bg-amber-50 text-amber-800 border-amber-200",
      Icon: Clock,
    },
    active: {
      label: "Active",
      cls: "bg-green-50 text-green-700 border-green-200",
      Icon: BadgeCheck,
    },
    paused: {
      label: "Paused",
      cls: "bg-gray-50 text-gray-700 border-gray-200",
      Icon: PauseCircle,
    },
  };
  const cfg = map[status] || map.draft;
  const Icon = cfg.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full border ${cfg.cls}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

/* -----------------------------
   ✅ Google-style ring icon
------------------------------ */

function GoogleIconCircle({ size = "md" }) {
  const map = {
    sm: "w-11 h-11",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <span
      className={`relative ${map[size]} shrink-0 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm`}
    >
      <span className="absolute inset-0 rounded-full ring-1 ring-black/5" />
      <SiGoogleads
        className="relative text-[22px]"
        style={{ color: "#4285F4" }}
      />
    </span>
  );
}

/* -----------------------------
   Cards + Buttons
------------------------------ */

function Card({
  title,
  subtitle,
  metaLeft,
  metaRight,
  badge,
  iconNode,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {iconNode ? (
              <span className="relative w-9 h-9 shrink-0 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm">
                <span className="absolute inset-0 rounded-full ring-1 ring-black/5" />
                <span className="relative text-[18px] leading-none">
                  {iconNode}
                </span>
              </span>
            ) : null}

            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {title}
              </div>
              {subtitle ? (
                <div className="text-xs text-gray-600 mt-0.5 truncate">
                  {subtitle}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      {metaLeft || metaRight ? (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="truncate">{metaLeft}</div>
          <div className="shrink-0">{metaRight}</div>
        </div>
      ) : null}
    </button>
  );
}

function LaunchCircleButton({
  label,
  sublabel,
  icon,
  enabled,
  onClick,
  variant = "default", // "default" | "google" | "request"
}) {
  const Icon = icon;

  const isGoogle = variant === "google";
  const isRequest = variant === "request";

  const baseWrap = "flex flex-col items-center gap-2 group select-none";
  const circleBase =
    "w-14 h-14 rounded-full border shadow-sm flex items-center justify-center transition";

  const circleClass = isRequest
    ? "bg-gray-900 border-gray-900 hover:bg-gray-800"
    : isGoogle
    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
    : "bg-white border-gray-200 hover:bg-gray-50";

  const labelClass = enabled || isRequest ? "text-gray-900" : "text-gray-400";
  const sublabelClass =
    enabled || isRequest ? "text-gray-600" : "text-gray-400";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled && !isRequest}
      className={`${baseWrap} ${
        !enabled && !isRequest ? "opacity-60 cursor-not-allowed" : ""
      }`}
      aria-disabled={!enabled && !isRequest}
      title={!enabled && !isRequest ? "Coming soon" : undefined}
    >
      <div className={`${circleBase} ${circleClass}`}>
        {isGoogle ? (
          <SiGoogleads className="w-6 h-6" style={{ color: "#4285F4" }} />
        ) : isRequest ? (
          <Plus className="w-6 h-6 text-white" />
        ) : (
          <Icon
            className={`w-6 h-6 ${enabled ? "text-gray-800" : "text-gray-400"}`}
          />
        )}
      </div>

      <div className="text-center">
        <div className={`text-xs font-semibold ${labelClass}`}>{label}</div>
        {sublabel ? (
          <div className={`text-[11px] mt-0.5 ${sublabelClass}`}>
            {sublabel}
          </div>
        ) : null}
      </div>
    </button>
  );
}

/* -----------------------------
   Page
------------------------------ */

export default function CampaignsClient() {
  const router = useRouter();
  const { token } = useAuth();

  const [isLeftOpen, setIsLeftOpen] = useState(false);

  // Only two views now
  const [view, setView] = useState("campaigns"); // "campaigns" | "templates"

  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  // Demo data until backend is wired
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("No campaigns endpoint yet");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.campaigns || [];
        if (!cancelled) setCampaigns(list);
      } catch {
        if (cancelled) return;
        if (!cancelled) {
          setCampaigns([
            {
              _id: "demo_1",
              name: "Google Ads: Search",
              channel: "google",
              objective: "Lead generation",
              status: "draft",
              updatedAt: new Date().toISOString(),
            },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const headerTitle = useMemo(() => "Campaigns", []);

  function goNewGoogleSearch() {
    router.push("/chat/campaign/new?channel=google&type=search");
  }

  function requestFeature() {
    // Replace with your own route/modal later
    // router.push("/chat/feature-request");
  }

  const templates = useMemo(
    () => [
      {
        id: "tpl_google_search_leads",
        title: "Google Ads: Search",
        subtitle: "High-intent leads",
        tag: "Template",
      },
      {
        id: "tpl_tiktok_prospecting",
        title: "TikTok Ads",
        subtitle: "Prospecting + creators (coming soon)",
        tag: "Coming soon",
        disabled: true,
      },
      {
        id: "tpl_meta_leads",
        title: "Meta Ads",
        subtitle: "Lead forms + creative sprint (coming soon)",
        tag: "Coming soon",
        disabled: true,
      },
    ],
    []
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={"general"}
        setActiveContext={() => {}}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={"general"}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => {}}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Create a new campaign instantly
              </h1>

              {/* Circle launch buttons */}
              <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                <LaunchCircleButton
                  label="Google Ads: Search"
                  sublabel="High-intent leads"
                  icon={LayoutGrid}
                  enabled
                  variant="google"
                  onClick={goNewGoogleSearch}
                />

                <LaunchCircleButton
                  label="TikTok Ad"
                  sublabel="Coming soon"
                  icon={SiTiktok}
                  enabled={false}
                  onClick={() => {}}
                />

                <LaunchCircleButton
                  label="Meta Ad"
                  sublabel="Coming soon"
                  icon={SiMeta}
                  enabled={false}
                  onClick={() => {}}
                />

                <LaunchCircleButton
                  label="LinkedIn Ad"
                  sublabel="Coming soon"
                  icon={SiLinkedin}
                  enabled={false}
                  onClick={() => {}}
                />

                <LaunchCircleButton
                  label="X Ads"
                  sublabel="Coming soon"
                  icon={SiX}
                  enabled={false}
                  onClick={() => {}}
                />

                {/* Request button (enabled) */}
                <LaunchCircleButton
                  label="Request"
                  sublabel="New channel"
                  icon={Plus}
                  enabled
                  variant="request"
                  onClick={requestFeature}
                />
              </div>

              {/* Filter buttons */}
              <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                <Pill
                  active={view === "campaigns"}
                  onClick={() => setView("campaigns")}
                >
                  Your campaigns
                </Pill>
                <Pill
                  active={view === "templates"}
                  onClick={() => setView("templates")}
                >
                  Templates
                </Pill>
              </div>
            </div>

            {/* Content */}
            <div className="mt-10 space-y-10">
              {/* Recents */}
              {view === "campaigns" ? (
                <section>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recents
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Open an existing campaign.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse"
                        >
                          <div className="h-4 bg-gray-100 rounded w-2/3" />
                          <div className="mt-2 h-3 bg-gray-100 rounded w-1/2" />
                          <div className="mt-4 h-8 bg-gray-100 rounded w-full" />
                        </div>
                      ))
                    ) : campaigns?.length ? (
                      campaigns.map((c) => {
                        const cid = c?._id || c?.id || "demo_1";
                        const status = c?.status || "draft";

                        // Force the first “test” card language to match Google Search
                        const title = "Google Ads: Search";
                        const subtitle = "High-intent leads";
                        const metaRight = "GOOGLE • Lead generation";
                        const metaLeft = "Updated recently";

                        return (
                          <Card
                            key={cid}
                            title={title}
                            subtitle={subtitle}
                            metaLeft={metaLeft}
                            metaRight={metaRight}
                            badge={<StatusPill status={status} />}
                            iconNode={
                              <SiGoogleads style={{ color: "#4285F4" }} />
                            }
                            onClick={() => router.push(`/chat/campaign/${cid}`)}
                          />
                        );
                      })
                    ) : (
                      <div className="text-sm text-gray-600">
                        No campaigns yet.
                      </div>
                    )}
                  </div>
                </section>
              ) : null}

              {/* Templates */}
              {view === "templates" ? (
                <section>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Templates
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Start from a proven structure — we’ll customize it to your
                      brand.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {templates.map((t) => {
                      const disabled = !!t.disabled;

                      return (
                        <button
                          key={t.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (disabled) return;
                            goNewGoogleSearch();
                          }}
                          className={`text-left w-full rounded-2xl border bg-white transition p-4 ${
                            disabled
                              ? "border-gray-200 opacity-60 cursor-not-allowed"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <GoogleIconCircle size="sm" />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {t.title}
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5 truncate">
                                {t.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <div className="truncate">{t.tag}</div>
                            <div className="shrink-0">
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-900 text-white border border-gray-900 text-[11px] font-bold">
                                {disabled ? "Locked" : "Use"}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
