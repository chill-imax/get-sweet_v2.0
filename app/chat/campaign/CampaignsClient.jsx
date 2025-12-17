"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Rocket,
  Megaphone,
  Target,
  Mail,
  Globe,
  Upload,
  Sparkles,
  Plus,
  Clock,
  BadgeCheck,
  PauseCircle,
  Boxes,
  Workflow,
  Users,
} from "lucide-react";
import { SiFacebook } from "react-icons/si";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import { useAuth } from "@/context/useContext"; // adjust if needed

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

function Chip({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 px-3 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
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

function Card({ title, subtitle, metaLeft, metaRight, onClick, badge, icon }) {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {Icon ? (
              <span className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gray-700" />
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

      {(metaLeft || metaRight) && (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="truncate">{metaLeft}</div>
          <div className="shrink-0">{metaRight}</div>
        </div>
      )}
    </button>
  );
}

/* -----------------------------
   AGENTS (circle icon tiles)
------------------------------ */

function CircleIcon({
  Icon,
  imageSrc,
  imageAlt = "",
  size = "lg",
  bgClass = "bg-white",
  ringClass = "border-gray-200",
  fit = "contain", // "contain" | "cover"
}) {
  const map = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={`
        ${map[size]}
        rounded-full
        ${bgClass}
        border
        ${ringClass}
        shadow-sm
        flex
        items-center
        justify-center
        overflow-hidden
        shrink-0
      `}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`
            w-full
            h-full
            ${fit === "cover" ? "object-cover" : "object-contain"}
          `}
          draggable={false}
        />
      ) : Icon ? (
        <Icon className="w-5 h-5 text-gray-900" />
      ) : null}
    </div>
  );
}

function FeaturedTag() {
  return (
    <span className="inline-flex items-center h-7 px-3 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-extrabold text-purple-700">
      Featured
    </span>
  );
}

function AgentTile({
  title,
  blurb,
  icon,
  iconBg,
  iconBorder,
  iconColor,
  onClick,
  featured,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full rounded-3xl border bg-white hover:bg-gray-50 transition p-5 ${
        featured ? "border-purple-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <CircleIcon
            Icon={icon}
            size="lg"
            bgClass={iconBg}
            borderClass={iconBorder}
            iconClass={iconColor}
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </div>
            <div className="mt-1 text-xs text-gray-600 line-clamp-2">
              {blurb}
            </div>
          </div>
        </div>

        {featured ? (
          <div className="shrink-0">
            <FeaturedTag />
          </div>
        ) : null}
      </div>
    </button>
  );
}

function AgentTileImage({ title, blurb, imageSrc, onClick, featured }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full rounded-3xl border bg-white hover:bg-gray-50 transition p-5 ${
        featured ? "border-purple-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <CircleIcon
            size="lg"
            imageSrc={imageSrc}
            imageAlt={title}
            bgClass="bg-white"
            borderClass={featured ? "border-purple-200" : "border-gray-200"}
            innerScaleClass="w-[62%] h-[62%]"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </div>
            <div className="mt-1 text-xs text-gray-600 line-clamp-2">
              {blurb}
            </div>
          </div>
        </div>

        {featured ? (
          <div className="shrink-0">
            <FeaturedTag />
          </div>
        ) : null}
      </div>
    </button>
  );
}

function GroupIconStack({ icons = [] }) {
  const shown = icons.slice(0, 3);
  const remaining = Math.max(0, icons.length - shown.length);

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {shown.map((it, idx) => (
          <div key={idx} className="relative">
            <CircleIcon
              size="md"
              Icon={it.Icon}
              imageSrc={it.imageSrc}
              imageAlt={it.alt || ""}
              bgClass={it.bgClass || "bg-white"}
              borderClass={it.borderClass || "border-gray-200"}
              iconClass={it.iconClass || "text-gray-900"}
              innerScaleClass="w-[58%] h-[58%]"
            />
          </div>
        ))}

        {remaining > 0 ? (
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-900 shadow-sm flex items-center justify-center text-white text-xs font-extrabold">
              +{remaining}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AgentGroupTile({ title, blurb, icons, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full rounded-3xl border border-gray-200 bg-white hover:bg-gray-50 transition p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </div>
          <div className="mt-1 text-xs text-gray-600 line-clamp-2">{blurb}</div>
        </div>

        <div className="shrink-0">
          <GroupIconStack icons={icons} />
        </div>
      </div>
    </button>
  );
}

/* -----------------------------
   Data
------------------------------ */

const TEMPLATE_CATALOG = [
  {
    id: "leadgen-local-services",
    title: "Lead Gen — Local Services",
    subtitle: "Google Ads Search • calls + form fills",
    icon: Target,
    tag: "High intent",
  },
  {
    id: "ecom-sales-search",
    title: "Ecommerce Sales — Search",
    subtitle: "Google Ads Search • ROAS focused",
    icon: Megaphone,
    tag: "Best seller",
  },
  {
    id: "email-welcome-flow",
    title: "Email — Welcome Flow",
    subtitle: "Lifecycle • onboarding + upsell",
    icon: Mail,
    tag: "Quick win",
  },
  {
    id: "landing-page-offer",
    title: "Landing Page — Offer Page",
    subtitle: "Website • conversion page outline",
    icon: Globe,
    tag: "Starter",
  },
];

const QUICK_ACTIONS = [
  { id: "new_google_ads", label: "Google Ads", icon: Rocket, action: "new_google_ads" },
  { id: "new_meta", label: "Meta Ads", icon: Megaphone, action: "new_meta" },
  { id: "new_email", label: "Email", icon: Mail, action: "new_email" },
  { id: "new_landing", label: "Landing Page", icon: Globe, action: "new_landing" },
  { id: "import_url", label: "Import URL", icon: Search, action: "import_url" },
  { id: "upload_pdf", label: "Upload PDF", icon: Upload, action: "upload_pdf" },
  { id: "ai_builder", label: "AI Builder", icon: Sparkles, action: "ai_builder" },
];

const AGENTS = [
  // ✅ FEATURED FIRST
  {
    id: "agent_nomorecopyright",
    title: "No More Copyright",
    blurb: "Generate image assets instantly for ads + landing pages.",
    imageSrc: "/icons/nomorecopyright.webp",
    featured: true,
  },

  // ✅ NEW: Ad agency (image logo)
  {
    id: "agent_fcb",
    title: "FCB (Ad Agency)",
    blurb: "Big-brand creative direction + campaign concepts.",
    imageSrc: "/icons/fcb.png",
  },

  // ✅ NEW: Solo SEO agency (your image)
  {
    id: "agent_nathan_seo",
    title: "Nathan SEO",
    blurb: "Technical SEO, content plan, and ranking checklist.",
    imageSrc: "/icons/nathan-seo.png",
  },

  // existing
  {
    id: "agent_google_ads",
    title: "Google Ads",
    blurb: "Keywords, ad groups, RSAs + draft.",
    icon: Rocket,
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconColor: "text-blue-700",
  },
  {
    id: "agent_meta_ads",
    title: "Meta Ads",
    blurb: "Creative angles, audiences, hooks + variants.",
    icon: SiFacebook,
    iconBg: "bg-indigo-50",
    iconBorder: "border-indigo-200",
    iconColor: "text-indigo-700",
  },
  {
    id: "agent_email",
    title: "Email Marketing",
    blurb: "Flows, sequences, subject lines + copy.",
    icon: Mail,
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-200",
    iconColor: "text-amber-800",
  },
  {
    id: "agent_landing",
    title: "Landing Page",
    blurb: "Offer, sections, headlines, trust + CTA.",
    icon: Globe,
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-200",
    iconColor: "text-emerald-700",
  },
];

const AGENT_GROUPS = [
  {
    id: "group_local_leads",
    title: "Local Leads (Fast Launch)",
    blurb: "Google Search + landing outline + weekly reporting.",
    icons: [
      { Icon: Rocket, bgClass: "bg-blue-50", borderClass: "border-blue-200", iconClass: "text-blue-700" },
      { Icon: Globe, bgClass: "bg-emerald-50", borderClass: "border-emerald-200", iconClass: "text-emerald-700" },
      { Icon: Sparkles, bgClass: "bg-purple-50", borderClass: "border-purple-200", iconClass: "text-purple-700" },
      { Icon: Target, bgClass: "bg-gray-50", borderClass: "border-gray-200", iconClass: "text-gray-900" },
    ],
  },
  {
    id: "group_meta_creative_sprint",
    title: "Meta Creative Sprint",
    blurb: "Angles → variants → hooks → testing checklist.",
    icons: [
      { Icon: SiFacebook, bgClass: "bg-indigo-50", borderClass: "border-indigo-200", iconClass: "text-indigo-700" },
      { Icon: Sparkles, bgClass: "bg-purple-50", borderClass: "border-purple-200", iconClass: "text-purple-700" },
      { Icon: Megaphone, bgClass: "bg-gray-50", borderClass: "border-gray-200", iconClass: "text-gray-900" },
    ],
  },
];

/* -----------------------------
   Page
------------------------------ */

export default function CampaignsClient() {
  const router = useRouter();
  const { token } = useAuth();

  const [isLeftOpen, setIsLeftOpen] = useState(false);

  // Main segmented view
  const [view, setView] = useState("campaigns"); // campaigns | agents | templates | marketplace

  // Search + filters
  const [query, setQuery] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterObjective, setFilterObjective] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Data
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("No campaigns endpoint yet");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || data?.campaigns || [];

        if (!cancelled) setCampaigns(list);
      } catch (e) {
        if (cancelled) return;

        setCampaigns([
          {
            _id: "demo_1",
            name: "Emergency Plumbing — Leads",
            channel: "google",
            objective: "leads",
            status: "draft",
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "demo_2",
            name: "Holiday Promo — Search",
            channel: "google",
            objective: "sales",
            status: "active",
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
          },
          {
            _id: "demo_3",
            name: "Welcome Email Flow",
            channel: "email",
            objective: "retention",
            status: "paused",
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          },
        ]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const headerTitle = useMemo(() => {
    if (view === "templates") return "Templates";
    if (view === "marketplace") return "Marketplace";
    if (view === "agents") return "Agents";
    return "Campaigns";
  }, [view]);

  const welcomeTitle = useMemo(() => {
    if (view === "templates") return "Pick a template to start fast";
    if (view === "marketplace") return "Explore campaign packs & workflows";
    if (view === "agents") return "Install an agent (or a reusable group)";
    return "What will you launch today?";
  }, [view]);

  const filteredCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (campaigns || []).filter((c) => {
      const name = (c?.name || "").toLowerCase();
      const matchesQuery = !q || name.includes(q);

      const channel = c?.channel || "google";
      const objective = c?.objective || "leads";
      const status = c?.status || "draft";

      const matchesChannel = filterChannel === "all" || channel === filterChannel;
      const matchesObjective = filterObjective === "all" || objective === filterObjective;
      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesQuery && matchesChannel && matchesObjective && matchesStatus;
    });
  }, [campaigns, query, filterChannel, filterObjective, filterStatus]);

  function formatTime(d) {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  }

  function goNewCampaign(params = {}) {
    const qs = new URLSearchParams(params).toString();
    router.push(qs ? `/chat/campaign/new?${qs}` : "/chat/campaign/new");
  }

  function handleQuickAction(action) {
    if (action === "new_google_ads") return goNewCampaign({ channel: "google" });
    if (action === "new_meta") return goNewCampaign({ channel: "meta" });
    if (action === "new_email") return goNewCampaign({ channel: "email" });
    if (action === "new_landing") return goNewCampaign({ channel: "web" });

    if (action === "import_url") return router.push("/chat");
    if (action === "upload_pdf") return router.push("/chat");
    if (action === "ai_builder") return router.push("/chat/brand-ai");

    return goNewCampaign();
  }

  function handleAgentClick(agentId) {
    // Placeholder: start a new campaign with agent hint
    goNewCampaign({ agent: agentId });
  }

  function handleAgentGroupClick(groupId) {
    // Placeholder: start a new campaign with group hint
    goNewCampaign({ agentGroup: groupId });
  }

  const agentsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...AGENTS];

    // Ensure featured stays first even after filtering where it matches
    if (!q) return list;

    const filtered = list.filter((a) => {
      const t = (a.title || "").toLowerCase();
      const b = (a.blurb || "").toLowerCase();
      return t.includes(q) || b.includes(q);
    });

    // Keep featured first if present
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return filtered;
  }, [query]);

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
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                {welcomeTitle}
              </h1>

              {/* Segmented pills */}
              <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                <Pill active={view === "campaigns"} onClick={() => setView("campaigns")}>
                  Your campaigns
                </Pill>
                <Pill active={view === "agents"} onClick={() => setView("agents")}>
                  Agents
                </Pill>
                <Pill active={view === "templates"} onClick={() => setView("templates")}>
                  Templates
                </Pill>
                <Pill active={view === "marketplace"} onClick={() => setView("marketplace")}>
                  Marketplace
                </Pill>
              </div>

              {/* Big search */}
              <div className="mt-6">
                <div className="max-w-3xl mx-auto rounded-3xl border border-purple-200 bg-gradient-to-b from-purple-50 to-white p-3">
                  <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-3 h-12">
                    <Search className="w-5 h-5 text-gray-500" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search campaigns, agents, templates…"
                      className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 inline-flex items-center justify-center"
                      title="Filters"
                    >
                      <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Filter chips */}
                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    <Chip onClick={() => setFilterChannel((p) => (p === "all" ? "google" : "all"))}>
                      Channel: {filterChannel === "all" ? "All" : filterChannel}
                    </Chip>
                    <Chip onClick={() => setFilterObjective((p) => (p === "all" ? "leads" : "all"))}>
                      Objective: {filterObjective === "all" ? "All" : filterObjective}
                    </Chip>
                    <Chip onClick={() => setFilterStatus((p) => (p === "all" ? "draft" : "all"))}>
                      Status: {filterStatus === "all" ? "All" : filterStatus}
                    </Chip>
                    <Chip
                      onClick={() => {
                        setQuery("");
                        setFilterChannel("all");
                        setFilterObjective("all");
                        setFilterStatus("all");
                      }}
                    >
                      Reset filters
                    </Chip>
                  </div>
                </div>
              </div>

              {/* Quick actions row */}
              <div className="mt-8">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {QUICK_ACTIONS.map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleQuickAction(a.action)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm group-hover:bg-gray-50 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gray-800" />
                        </div>
                        <div className="text-xs font-semibold text-gray-800">{a.label}</div>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => goNewCampaign()}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-purple-600 border border-purple-600 shadow-sm group-hover:bg-purple-700 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-gray-900">New</div>
                  </button>
                </div>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="mt-10 space-y-10">
              {error ? (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-4">
                  {error}
                </div>
              ) : null}

              {/* CAMPAIGNS */}
              {view === "campaigns" ? (
                <section>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Recents</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Open an existing campaign or start a new one.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => goNewCampaign()}
                      className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create campaign
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse"
                        >
                          <div className="h-4 bg-gray-100 rounded w-2/3" />
                          <div className="mt-2 h-3 bg-gray-100 rounded w-1/2" />
                          <div className="mt-4 h-8 bg-gray-100 rounded w-full" />
                        </div>
                      ))
                    ) : filteredCampaigns.length ? (
                      filteredCampaigns.map((c) => (
                        <Card
                          key={c._id || c.id}
                          title={c.name || "Untitled campaign"}
                          subtitle={`${(c.channel || "google").toUpperCase()} • ${c.objective || "leads"}`}
                          metaLeft={c.updatedAt ? `Updated ${formatTime(c.updatedAt)}` : "Updated recently"}
                          metaRight={c._id?.startsWith("demo_") ? "Demo" : ""}
                          badge={<StatusPill status={c.status || "draft"} />}
                          icon={Rocket}
                          onClick={() => {
                            const cid = c._id || c.id;
                            if (!cid) return;
                            router.push(`/chat/campaign/${cid}`);
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-sm text-gray-600">
                        No campaigns match your filters.
                      </div>
                    )}
                  </div>
                </section>
              ) : null}

              {/* AGENTS */}
              {view === "agents" ? (
                <section>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Boxes className="w-5 h-5 text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Agents available
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Run a single task fast — or install a group used in other campaigns.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push("/chat/agents/request")} // placeholder route
                      className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Request / Submit agent
                    </button>
                  </div>

                  {/* agents grid */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agentsFiltered.map((a) =>
                      a.imageSrc ? (
                        <AgentTileImage
                          key={a.id}
                          title={a.title}
                          blurb={a.blurb}
                          imageSrc={a.imageSrc}
                          featured={!!a.featured}
                          onClick={() => handleAgentClick(a.id)}
                        />
                      ) : (
                        <AgentTile
                          key={a.id}
                          title={a.title}
                          blurb={a.blurb}
                          icon={a.icon}
                          iconBg={a.iconBg}
                          iconBorder={a.iconBorder}
                          iconColor={a.iconColor}
                          featured={!!a.featured}
                          onClick={() => handleAgentClick(a.id)}
                        />
                      )
                    )}
                  </div>

                  {/* agent groups */}
                  <div className="mt-10">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Agent groups you can reuse
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Think “recipes” — built from multiple agents and proven in other campaigns.
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {AGENT_GROUPS.filter((g) => {
                        const q = query.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          g.title.toLowerCase().includes(q) ||
                          g.blurb.toLowerCase().includes(q)
                        );
                      }).map((g) => (
                        <AgentGroupTile
                          key={g.id}
                          title={g.title}
                          blurb={g.blurb}
                          icons={g.icons}
                          onClick={() => handleAgentGroupClick(g.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-700" />
                      <div className="text-sm font-semibold text-gray-900">
                        Coming soon: community templates
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      People can publish “agent groups” like n8n workflows — versioned, rated, and remixable.
                    </div>
                  </div>
                </section>
              ) : null}

              {/* TEMPLATES */}
              {view === "templates" ? (
                <section>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Start from a proven structure — Sweet Manager will customize it to your brand.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TEMPLATE_CATALOG.map((t) => (
                      <Card
                        key={t.id}
                        title={t.title}
                        subtitle={t.subtitle}
                        metaLeft={t.tag}
                        metaRight="Template"
                        icon={t.icon}
                        badge={
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[11px] font-bold">
                            Use
                          </span>
                        }
                        onClick={() => goNewCampaign({ template: t.id })}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {/* MARKETPLACE */}
              {view === "marketplace" ? (
                <section>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Marketplace</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Packs you can “install” into your workspace: campaign templates + tasks + prompts.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        id: "pack_local_leads",
                        title: "Local Leads Pack",
                        subtitle: "Google Search • calls + bookings • 7-day launch checklist",
                        tag: "Most popular",
                        icon: Target,
                      },
                      {
                        id: "pack_ecom_roas",
                        title: "ROAS Ecommerce Pack",
                        subtitle: "Search + Shopping • product feed checklist • ROAS reporting",
                        tag: "Advanced",
                        icon: Megaphone,
                      },
                      {
                        id: "pack_email_growth",
                        title: "Email Growth Pack",
                        subtitle: "Welcome flow + winback + upsell • copy included",
                        tag: "Quick setup",
                        icon: Mail,
                      },
                    ].map((p) => (
                      <Card
                        key={p.id}
                        title={p.title}
                        subtitle={p.subtitle}
                        metaLeft={p.tag}
                        metaRight="Pack"
                        icon={p.icon}
                        badge={
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-900 text-white border border-gray-900 text-[11px] font-bold">
                            Install
                          </span>
                        }
                        onClick={() => goNewCampaign({ template: p.id })}
                      />
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="text-sm font-semibold text-gray-900">Coming soon</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Marketplace items can be versioned, rated, and shared — like “campaign recipes.”
                    </div>
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
