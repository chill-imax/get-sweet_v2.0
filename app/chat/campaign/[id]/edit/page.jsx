// app/chat/campaign/[id]/edit/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";

/** -----------------------------
 *  Campaign defaults + helpers
 *  ----------------------------- */
const DEFAULT_CAMPAIGN = {
  id: "",
  name: "Untitled campaign",
  status: "draft", // "draft" | "active" | "paused" | "completed" | "archived"

  objective: "lead_gen", // "awareness" | "traffic" | "lead_gen" | "sales" | "retention" | "app_installs"
  primaryGoal: "",
  supportingGoals: [],

  kpis: [], // [{ key, target, unit, timeframe }]
  timeframe: { startDate: null, endDate: null, label: "Next 30 days" },
  budget: { amount: null, currency: "USD", cadence: "total" }, // "daily" | "weekly" | "monthly" | "total"

  audience: { description: "", geo: [], segments: [], exclusions: [] },
  offer: { headline: "", details: "", landingPageUrl: "", promoCode: "" },

  tone: { preset: "Professional", notes: "" },
  messaging: { mustSay: [], mustAvoid: [], proofPoints: [], disclaimers: [] },

  channels: [
    { type: "google_ads", enabled: true },
    { type: "meta_ads", enabled: false },
    { type: "email", enabled: false },
    { type: "tiktok", enabled: false },
    { type: "linkedin", enabled: false },
  ],

  deliverables: { adVariants: 3, imageFormats: ["1:1", "4:5"], copyLengths: ["short", "medium"] },

  context: { notes: "", attachments: [] },

  createdAt: null,
  updatedAt: null,
};

function storageKey(id) {
  return `campaign:${id}`;
}

function safeJsonParse(str, fallback) {
  try {
    const v = JSON.parse(str);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function ensureCampaignShape(raw, id) {
  const merged = {
    ...DEFAULT_CAMPAIGN,
    ...(raw || {}),
    id: raw?.id || id,
  };

  // ensure arrays
  merged.supportingGoals = Array.isArray(merged.supportingGoals) ? merged.supportingGoals : [];
  merged.kpis = Array.isArray(merged.kpis) ? merged.kpis : [];
  merged.channels = Array.isArray(merged.channels) ? merged.channels : DEFAULT_CAMPAIGN.channels;
  merged.messaging = merged.messaging && typeof merged.messaging === "object" ? merged.messaging : DEFAULT_CAMPAIGN.messaging;

  // normalize list fields
  for (const key of ["mustSay", "mustAvoid", "proofPoints", "disclaimers"]) {
    merged.messaging[key] = Array.isArray(merged.messaging[key]) ? merged.messaging[key] : [];
  }

  // ensure nested objects
  merged.audience = merged.audience && typeof merged.audience === "object" ? merged.audience : DEFAULT_CAMPAIGN.audience;
  for (const key of ["geo", "segments", "exclusions"]) {
    merged.audience[key] = Array.isArray(merged.audience[key]) ? merged.audience[key] : [];
  }

  merged.offer = merged.offer && typeof merged.offer === "object" ? merged.offer : DEFAULT_CAMPAIGN.offer;
  merged.timeframe = merged.timeframe && typeof merged.timeframe === "object" ? merged.timeframe : DEFAULT_CAMPAIGN.timeframe;
  merged.budget = merged.budget && typeof merged.budget === "object" ? merged.budget : DEFAULT_CAMPAIGN.budget;
  merged.deliverables =
    merged.deliverables && typeof merged.deliverables === "object" ? merged.deliverables : DEFAULT_CAMPAIGN.deliverables;

  merged.deliverables.imageFormats = Array.isArray(merged.deliverables.imageFormats)
    ? merged.deliverables.imageFormats
    : DEFAULT_CAMPAIGN.deliverables.imageFormats;

  merged.deliverables.copyLengths = Array.isArray(merged.deliverables.copyLengths)
    ? merged.deliverables.copyLengths
    : DEFAULT_CAMPAIGN.deliverables.copyLengths;

  merged.tone = merged.tone && typeof merged.tone === "object" ? merged.tone : DEFAULT_CAMPAIGN.tone;

  return merged;
}

function readCampaignFromStorage(id) {
  if (typeof window === "undefined") return ensureCampaignShape(null, id);
  const raw = safeJsonParse(localStorage.getItem(storageKey(id)) || "null", null);
  return ensureCampaignShape(raw, id);
}

function writeCampaignToStorage(campaign) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(campaign.id), JSON.stringify(campaign));
}

/** -----------------------------
 *  Small UI primitives
 *  ----------------------------- */
function Section({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        {description ? <div className="text-xs text-gray-500 mt-1">{description}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">{children}</div>;
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={[
        "w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none",
        "focus:ring-2 focus:ring-gray-200",
        props.className || "",
      ].join(" ")}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={[
        "w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none",
        "focus:ring-2 focus:ring-gray-200",
        props.className || "",
      ].join(" ")}
      rows={props.rows ?? 4}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={[
        "w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none",
        "focus:ring-2 focus:ring-gray-200",
        props.className || "",
      ].join(" ")}
    />
  );
}

function ChipListEditor({ items, onChange, placeholder = "Type and press Enter…" }) {
  const [draft, setDraft] = useState("");

  function add() {
    const val = draft.trim();
    if (!val) return;
    const next = [...items, val];
    onChange(next);
    setDraft("");
  }

  function remove(idx) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((t, idx) => (
          <span
            key={`${t}-${idx}`}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-800"
          >
            <span className="truncate max-w-[240px]">{t}</span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-gray-400 hover:text-gray-800"
              aria-label="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="h-10 px-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}

/** -----------------------------
 *  Page
 *  ----------------------------- */
export default function CampaignEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [campaign, setCampaign] = useState(() => ensureCampaignShape(null, id));
  const [original, setOriginal] = useState(() => ensureCampaignShape(null, id));

  useEffect(() => {
    const c = readCampaignFromStorage(id);
    setCampaign(c);
    setOriginal(c);
    setLoading(false);
  }, [id]);

  const hasChanges = useMemo(() => JSON.stringify(campaign) !== JSON.stringify(original), [campaign, original]);

  function update(path, value) {
    setCampaign((prev) => {
      const next = structuredClone(prev);
      // simple dot-path setter
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function toggleChannel(type) {
    setCampaign((prev) => {
      const next = structuredClone(prev);
      next.channels = next.channels.map((c) => (c.type === type ? { ...c, enabled: !c.enabled } : c));
      return next;
    });
  }

  function addKpi() {
    setCampaign((prev) => ({
      ...prev,
      kpis: [...prev.kpis, { key: "leads", target: 0, unit: "leads", timeframe: prev.timeframe?.label || "Next 30 days" }],
    }));
  }

  function removeKpi(idx) {
    setCampaign((prev) => ({ ...prev, kpis: prev.kpis.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    setSaving(true);
    setToast(null);

    const now = new Date().toISOString();
    const next = {
      ...campaign,
      updatedAt: now,
      createdAt: campaign.createdAt || now,
    };

    // front-end only persistence for now
    writeCampaignToStorage(next);
    setCampaign(next);
    setOriginal(next);

    setToast({ type: "success", message: "Campaign saved." });
    setTimeout(() => setToast(null), 1600);
    setSaving(false);
  }

  function handleCancel() {
    setCampaign(original);
    router.push(`/chat/campaign/${id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-gray-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push(`/chat/campaign/${id}`)}
              className="h-10 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 inline-flex items-center gap-2 text-sm font-semibold text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="min-w-0">
              <div className="text-xs text-gray-500">Edit campaign</div>
              <div className="text-sm font-semibold text-gray-900 truncate">{campaign.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {toast ? (
              <div
                className={[
                  "hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border",
                  toast.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200",
                ].join(" ")}
              >
                <CheckCircle2 className="w-4 h-4" />
                {toast.message}
              </div>
            ) : null}

            <button
              onClick={handleCancel}
              className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Basics */}
          <Section title="Basics" description="Name, status, objective and tone.">
            <div className="grid gap-3">
              <div>
                <Label>Campaign name</Label>
                <TextInput value={campaign.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g., Winter Sale 2026" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select value={campaign.status} onChange={(e) => update("status", e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>

                <div>
                  <Label>Objective</Label>
                  <Select value={campaign.objective} onChange={(e) => update("objective", e.target.value)}>
                    <option value="awareness">Awareness</option>
                    <option value="traffic">Traffic</option>
                    <option value="lead_gen">Lead gen</option>
                    <option value="sales">Sales</option>
                    <option value="retention">Retention</option>
                    <option value="app_installs">App installs</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tone preset</Label>
                <Select value={campaign.tone.preset} onChange={(e) => update("tone.preset", e.target.value)}>
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Bold">Bold</option>
                  <option value="Urgent">Urgent (Sales)</option>
                </Select>
              </div>

              <div>
                <Label>Tone notes</Label>
                <TextArea
                  value={campaign.tone.notes}
                  onChange={(e) => update("tone.notes", e.target.value)}
                  placeholder="e.g., Avoid hype. Be direct. Keep it premium."
                  rows={3}
                />
              </div>
            </div>
          </Section>

          {/* Goals + KPIs */}
          <Section title="Goals & success" description="Define what success looks like for this campaign.">
            <div className="grid gap-3">
              <div>
                <Label>Primary goal</Label>
                <TextInput
                  value={campaign.primaryGoal}
                  onChange={(e) => update("primaryGoal", e.target.value)}
                  placeholder="e.g., Increase leads for emergency repairs"
                />
              </div>

              <div>
                <Label>Supporting goals</Label>
                <ChipListEditor
                  items={campaign.supportingGoals}
                  onChange={(next) => update("supportingGoals", next)}
                  placeholder="e.g., Lower CPL, Improve CTR…"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Timeframe label</Label>
                  <TextInput
                    value={campaign.timeframe.label}
                    onChange={(e) => update("timeframe.label", e.target.value)}
                    placeholder="Next 30 days"
                  />
                </div>

                <div>
                  <Label>Budget</Label>
                  <div className="flex gap-2">
                    <TextInput
                      value={campaign.budget.amount ?? ""}
                      onChange={(e) => update("budget.amount", e.target.value === "" ? null : Number(e.target.value))}
                      placeholder="Amount"
                      inputMode="numeric"
                    />
                    <Select value={campaign.budget.cadence} onChange={(e) => update("budget.cadence", e.target.value)} className="w-40">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="total">Total</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">KPIs</div>
                  <button
                    type="button"
                    onClick={addKpi}
                    className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add KPI
                  </button>
                </div>

                {campaign.kpis.length === 0 ? (
                  <div className="mt-3 text-sm text-gray-500">
                    Add 1–3 KPIs (e.g., leads, CPL, CTR) so the AI can optimize decisions.
                  </div>
                ) : (
                  <div className="mt-3 grid gap-2">
                    {campaign.kpis.map((k, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl p-3">
                        <div className="col-span-4">
                          <Label>KPI</Label>
                          <TextInput
                            value={k.key}
                            onChange={(e) => {
                              const next = structuredClone(campaign.kpis);
                              next[idx].key = e.target.value;
                              update("kpis", next);
                            }}
                            placeholder="leads"
                          />
                        </div>

                        <div className="col-span-3">
                          <Label>Target</Label>
                          <TextInput
                            value={k.target ?? ""}
                            onChange={(e) => {
                              const next = structuredClone(campaign.kpis);
                              next[idx].target = e.target.value === "" ? null : Number(e.target.value);
                              update("kpis", next);
                            }}
                            inputMode="numeric"
                            placeholder="100"
                          />
                        </div>

                        <div className="col-span-3">
                          <Label>Unit</Label>
                          <TextInput
                            value={k.unit}
                            onChange={(e) => {
                              const next = structuredClone(campaign.kpis);
                              next[idx].unit = e.target.value;
                              update("kpis", next);
                            }}
                            placeholder="leads"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end pt-5">
                          <button
                            type="button"
                            onClick={() => removeKpi(idx)}
                            className="h-9 w-9 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center justify-center"
                            aria-label="Remove KPI"
                          >
                            <Trash2 className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        <div className="col-span-12">
                          <Label>Timeframe</Label>
                          <TextInput
                            value={k.timeframe || ""}
                            onChange={(e) => {
                              const next = structuredClone(campaign.kpis);
                              next[idx].timeframe = e.target.value;
                              update("kpis", next);
                            }}
                            placeholder="Next 30 days"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Audience */}
          <Section title="Audience" description="Campaign audience can be more specific than brand-level target audience.">
            <div className="grid gap-3">
              <div>
                <Label>Audience description</Label>
                <TextArea
                  value={campaign.audience.description}
                  onChange={(e) => update("audience.description", e.target.value)}
                  placeholder="e.g., Homeowners in Bay Area who need emergency plumbing support"
                  rows={3}
                />
              </div>

              <div>
                <Label>Geographies</Label>
                <ChipListEditor items={campaign.audience.geo} onChange={(next) => update("audience.geo", next)} placeholder="e.g., San Mateo, SF Bay Area" />
              </div>

              <div>
                <Label>Segments</Label>
                <ChipListEditor
                  items={campaign.audience.segments}
                  onChange={(next) => update("audience.segments", next)}
                  placeholder="e.g., New customers, Repeat customers"
                />
              </div>

              <div>
                <Label>Exclusions</Label>
                <ChipListEditor
                  items={campaign.audience.exclusions}
                  onChange={(next) => update("audience.exclusions", next)}
                  placeholder="e.g., Commercial-only requests"
                />
              </div>
            </div>
          </Section>

          {/* Offer */}
          <Section title="Offer & landing page" description="What are we promoting, and where do we send people?">
            <div className="grid gap-3">
              <div>
                <Label>Offer headline</Label>
                <TextInput value={campaign.offer.headline} onChange={(e) => update("offer.headline", e.target.value)} placeholder="e.g., 20% off first service call" />
              </div>

              <div>
                <Label>Offer details</Label>
                <TextArea
                  value={campaign.offer.details}
                  onChange={(e) => update("offer.details", e.target.value)}
                  placeholder="Terms, conditions, what’s included…"
                  rows={3}
                />
              </div>

              <div>
                <Label>Landing page URL</Label>
                <TextInput
                  value={campaign.offer.landingPageUrl}
                  onChange={(e) => update("offer.landingPageUrl", e.target.value)}
                  placeholder="https://example.com/landing"
                />
              </div>

              <div>
                <Label>Promo code</Label>
                <TextInput value={campaign.offer.promoCode} onChange={(e) => update("offer.promoCode", e.target.value)} placeholder="Optional" />
              </div>
            </div>
          </Section>

          {/* Messaging constraints */}
          <Section title="Messaging rules" description="Guardrails for copy generation (optional but powerful).">
            <div className="grid gap-4">
              <div>
                <Label>Must say</Label>
                <ChipListEditor items={campaign.messaging.mustSay} onChange={(next) => update("messaging.mustSay", next)} placeholder="e.g., Union trained, Licensed & insured" />
              </div>

              <div>
                <Label>Must avoid</Label>
                <ChipListEditor items={campaign.messaging.mustAvoid} onChange={(next) => update("messaging.mustAvoid", next)} placeholder="e.g., Cheap, Discount-only language" />
              </div>

              <div>
                <Label>Proof points</Label>
                <ChipListEditor items={campaign.messaging.proofPoints} onChange={(next) => update("messaging.proofPoints", next)} placeholder="e.g., 4.9★ rating, 10k+ jobs completed" />
              </div>

              <div>
                <Label>Disclaimers</Label>
                <ChipListEditor items={campaign.messaging.disclaimers} onChange={(next) => update("messaging.disclaimers", next)} placeholder="e.g., Terms apply. Limited time." />
              </div>
            </div>
          </Section>

          {/* Channels + deliverables */}
          <Section title="Channels & deliverables" description="Where this runs and what outputs you want.">
            <div className="grid gap-4">
              <div>
                <Label>Channels</Label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {campaign.channels.map((c) => (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => toggleChannel(c.type)}
                      className={[
                        "h-10 px-3 rounded-xl border text-sm font-semibold inline-flex items-center justify-between",
                        c.enabled ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <span className="capitalize">{c.type.replace("_", " ")}</span>
                      <span className={["w-2 h-2 rounded-full", c.enabled ? "bg-green-400" : "bg-gray-300"].join(" ")} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Ad variants</Label>
                  <TextInput
                    value={campaign.deliverables.adVariants}
                    onChange={(e) => update("deliverables.adVariants", Number(e.target.value || 0))}
                    inputMode="numeric"
                    placeholder="3"
                  />
                </div>

                <div>
                  <Label>Copy lengths</Label>
                  <Select
                    value={campaign.deliverables.copyLengths.join(",")}
                    onChange={(e) => update("deliverables.copyLengths", e.target.value.split(",").filter(Boolean))}
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                    <option value="short,medium">Short + Medium</option>
                    <option value="short,medium,long">All</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Image formats</Label>
                <ChipListEditor
                  items={campaign.deliverables.imageFormats}
                  onChange={(next) => update("deliverables.imageFormats", next)}
                  placeholder="e.g., 1:1, 4:5, 16:9"
                />
              </div>
            </div>
          </Section>

          {/* Notes */}
          <Section title="Campaign notes" description="Any additional context for Sweet Manager.">
            <div className="grid gap-3">
              <div>
                <Label>Notes</Label>
                <TextArea
                  value={campaign.context.notes}
                  onChange={(e) => update("context.notes", e.target.value)}
                  placeholder="What’s happening, constraints, timing, what worked before…"
                  rows={5}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* bottom spacer */}
        <div className="h-10" />
      </div>
    </div>
  );
}
