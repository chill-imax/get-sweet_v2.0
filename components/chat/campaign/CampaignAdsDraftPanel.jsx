"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

/**
 * CampaignAdsDraftPanel
 * - Front-end only draft builder + editor (localStorage)
 * - Later you can replace the "generate" stub with your agentic backend call
 *
 * Storage:
 * - campaignsById[id].adsDraft
 * - campaignsById[id].adsDraftStatus: "none" | "draft" | "approved"
 */
export default function CampaignAdsDraftPanel({ campaignId }) {
  const [status, setStatus] = useState("none"); // none | draft | approved
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ---------- load from localStorage ----------
  useEffect(() => {
    const id = String(campaignId || "");
    if (!id) return;

    const data = loadCampaignById(id);
    const adsDraft = data?.adsDraft || null;
    const adsStatus = data?.adsDraftStatus || "none";

    setDraft(adsDraft);
    setStatus(adsStatus);
  }, [campaignId]);

  const isApproved = status === "approved";

  const headerCopy = useMemo(() => {
    if (loading) return "Generating draft…";
    if (status === "approved") return "Google Ads draft approved";
    if (status === "draft") return "Google Ads draft ready";
    return "Create a Google Ads draft";
  }, [status, loading]);

  const subCopy = useMemo(() => {
    if (status === "approved") {
      return "This draft is locked. You can unlock to edit, or regenerate a new version.";
    }
    if (status === "draft") {
      return "Review and edit the draft below. When it looks good, approve it to lock.";
    }
    return "Generate ad groups, keywords, and RSA copy based on your campaign + brand.";
  }, [status]);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 1800);
  }

  // ---------- actions ----------
  async function handleGenerate() {
    setLoading(true);
    try {
      // TODO later: call your agentic backend
      const generated = stubGenerateAdsDraft(campaignId);

      setDraft(generated);
      setStatus("draft");
      persist(campaignId, { adsDraft: generated, adsDraftStatus: "draft" });

      showToast("success", "Draft generated.");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to generate draft.");
    } finally {
      setLoading(false);
    }
  }

  function handleApprove() {
    setStatus("approved");
    persist(campaignId, { adsDraftStatus: "approved" });
    showToast("success", "Draft approved and locked.");
  }

  function handleUnlock() {
    setStatus("draft");
    persist(campaignId, { adsDraftStatus: "draft" });
    showToast("success", "Unlocked for editing.");
  }

  function handleReset() {
    setDraft(null);
    setStatus("none");
    persist(campaignId, { adsDraft: null, adsDraftStatus: "none" });
    showToast("success", "Draft cleared.");
  }

  function updateDraft(nextDraft) {
    setDraft(nextDraft);
    persist(campaignId, { adsDraft: nextDraft });
  }

  function updateCampaignField(path, value) {
    if (!draft) return;

    const next = structuredClone(draft);
    setByPath(next, path, value);
    updateDraft(next);
  }

  function addAdGroup() {
    if (!draft) return;

    const next = structuredClone(draft);
    next.adGroups = Array.isArray(next.adGroups) ? next.adGroups : [];
    next.adGroups.push({
      id: `ag_${Date.now()}`,
      name: "New Ad Group",
      theme: "",
      finalUrl: draft?.searchCampaign?.landingPageUrl || "",
      keywordsExact: [],
      keywordsPhrase: [],
      negatives: [],
      rsa: {
        headlines: [],
        descriptions: [],
        path1: "",
        path2: "",
        finalUrl: draft?.searchCampaign?.landingPageUrl || "",
      },
    });
    updateDraft(next);
  }

  function removeAdGroup(adGroupIndex) {
    const next = structuredClone(draft);
    next.adGroups.splice(adGroupIndex, 1);
    updateDraft(next);
  }

  function regenerateAdGroup(adGroupIndex) {
    if (!draft) return;
    if (isApproved) return;

    const next = structuredClone(draft);
    const ag = next.adGroups?.[adGroupIndex];
    if (!ag) return;

    // stub: replace just RSA copy with a fresh set
    ag.rsa = stubRegenerateRsa(ag, next);
    updateDraft(next);
    showToast("success", "Ad group regenerated.");
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top header strip */}
      <div className="border-b bg-white">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gray-700" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{headerCopy}</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl">{subCopy}</p>
            </div>

            <div className="flex items-center gap-2">
              {status === "none" ? (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate draft
                </button>
              ) : (
                <>
                  {isApproved ? (
                    <button
                      onClick={handleUnlock}
                      className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      Unlock
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 inline-flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Approve
                    </button>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60 inline-flex items-center gap-2"
                    title="Regenerate full draft"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Regenerate
                  </button>

                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div
              className={`mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border ${
                toast.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="w-4 h-4 inline-flex items-center justify-center">!</span>
              )}
              {toast.message}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {status === "none" || !draft ? (
          <EmptyState onGenerate={handleGenerate} loading={loading} />
        ) : (
          <div className="space-y-6">
            {/* Campaign settings */}
            <Card title="Campaign settings" subtitle="High-level info used to shape ad groups and copy">
              <div className="grid grid-cols-1 gap-4">
                <FieldRow
                  label="Campaign name"
                  value={draft?.searchCampaign?.campaignName || ""}
                  disabled={isApproved}
                  placeholder="e.g., Winter Lead Gen"
                  onChange={(v) => updateCampaignField("searchCampaign.campaignName", v)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldRow
                    label="Objective"
                    value={draft?.searchCampaign?.goal || ""}
                    disabled={isApproved}
                    placeholder="e.g., leads"
                    onChange={(v) => updateCampaignField("searchCampaign.goal", v)}
                  />
                  <FieldRow
                    label="Landing page URL"
                    value={draft?.searchCampaign?.landingPageUrl || ""}
                    disabled={isApproved}
                    placeholder="https://example.com/landing"
                    onChange={(v) => updateCampaignField("searchCampaign.landingPageUrl", v)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FieldRow
                    label="Geo"
                    value={draft?.searchCampaign?.geo || ""}
                    disabled={isApproved}
                    placeholder="e.g., San Mateo County"
                    onChange={(v) => updateCampaignField("searchCampaign.geo", v)}
                  />
                  <FieldRow
                    label="Language"
                    value={draft?.searchCampaign?.language || ""}
                    disabled={isApproved}
                    placeholder="e.g., English"
                    onChange={(v) => updateCampaignField("searchCampaign.language", v)}
                  />
                  <FieldRow
                    label="Budget (optional)"
                    value={draft?.searchCampaign?.budget || ""}
                    disabled={isApproved}
                    placeholder="e.g., $50/day"
                    onChange={(v) => updateCampaignField("searchCampaign.budget", v)}
                  />
                </div>
              </div>
            </Card>

            {/* Ad groups */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Ad groups</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Each ad group contains keywords + an RSA set.
                </p>
              </div>

              {!isApproved && (
                <button
                  onClick={addAdGroup}
                  className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add ad group
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(draft?.adGroups || []).map((ag, idx) => (
                <Card
                  key={ag?.id || idx}
                  title={ag?.name || `Ad group ${idx + 1}`}
                  subtitle={ag?.theme ? `Theme: ${ag.theme}` : "Add a theme to guide copy"}
                  right={
                    <div className="flex items-center gap-2">
                      {!isApproved && (
                        <button
                          onClick={() => regenerateAdGroup(idx)}
                          className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2"
                          title="Regenerate ad group copy"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regen
                        </button>
                      )}
                      {!isApproved && (
                        <button
                          onClick={() => removeAdGroup(idx)}
                          className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-red-700 hover:bg-red-50 inline-flex items-center gap-2"
                          title="Remove ad group"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  }
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FieldRow
                        label="Ad group name"
                        value={ag?.name || ""}
                        disabled={isApproved}
                        placeholder="e.g., Emergency plumber"
                        onChange={(v) => updateCampaignField(`adGroups.${idx}.name`, v)}
                      />
                      <FieldRow
                        label="Theme"
                        value={ag?.theme || ""}
                        disabled={isApproved}
                        placeholder="e.g., 24/7 fast response"
                        onChange={(v) => updateCampaignField(`adGroups.${idx}.theme`, v)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ChipListEditor
                        title="Keywords (Exact)"
                        value={ag?.keywordsExact || []}
                        disabled={isApproved}
                        placeholder="Add exact keywords…"
                        onChange={(arr) => updateCampaignField(`adGroups.${idx}.keywordsExact`, arr)}
                      />
                      <ChipListEditor
                        title="Keywords (Phrase)"
                        value={ag?.keywordsPhrase || []}
                        disabled={isApproved}
                        placeholder="Add phrase keywords…"
                        onChange={(arr) => updateCampaignField(`adGroups.${idx}.keywordsPhrase`, arr)}
                      />
                    </div>

                    <ChipListEditor
                      title="Negative keywords"
                      value={ag?.negatives || []}
                      disabled={isApproved}
                      placeholder="Add negatives…"
                      onChange={(arr) => updateCampaignField(`adGroups.${idx}.negatives`, arr)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextListEditor
                        title="RSA headlines"
                        hint="(Aim 10–15. Keep under ~30 chars.)"
                        value={ag?.rsa?.headlines || []}
                        disabled={isApproved}
                        placeholder="Add headline…"
                        onChange={(arr) => updateCampaignField(`adGroups.${idx}.rsa.headlines`, arr)}
                      />
                      <TextListEditor
                        title="RSA descriptions"
                        hint="(Aim 3–5. Keep under ~90 chars.)"
                        value={ag?.rsa?.descriptions || []}
                        disabled={isApproved}
                        placeholder="Add description…"
                        onChange={(arr) => updateCampaignField(`adGroups.${idx}.rsa.descriptions`, arr)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FieldRow
                        label="Path 1"
                        value={ag?.rsa?.path1 || ""}
                        disabled={isApproved}
                        placeholder="e.g., services"
                        onChange={(v) => updateCampaignField(`adGroups.${idx}.rsa.path1`, v)}
                      />
                      <FieldRow
                        label="Path 2"
                        value={ag?.rsa?.path2 || ""}
                        disabled={isApproved}
                        placeholder="e.g., 24-7"
                        onChange={(v) => updateCampaignField(`adGroups.${idx}.rsa.path2`, v)}
                      />
                      <FieldRow
                        label="Final URL"
                        value={ag?.rsa?.finalUrl || ""}
                        disabled={isApproved}
                        placeholder="https://example.com/landing"
                        onChange={(v) => updateCampaignField(`adGroups.${idx}.rsa.finalUrl`, v)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Assumptions */}
            <Card title="Assumptions" subtitle="What the system assumed (helps you review)">
              <TextListReadOnly items={draft?.assumptions || []} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------ UI bits ------------------ */

function EmptyState({ onGenerate, loading }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <div className="max-w-xl">
        <div className="text-sm text-gray-500">No draft yet</div>
        <h3 className="text-xl font-semibold text-gray-900 mt-2">
          Generate Google Ads content for this campaign
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          We’ll create a first pass with ad groups, keywords, and RSA copy. You can edit everything before approving.
        </p>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-6 h-11 px-5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 inline-flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate draft
        </button>
      </div>
    </div>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          {subtitle ? <div className="text-sm text-gray-600 mt-1">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FieldRow({ label, value, onChange, placeholder, disabled }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-gray-500 uppercase mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}

function ChipListEditor({ title, value, onChange, placeholder, disabled }) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (!v) return;
    const next = Array.isArray(value) ? [...value, v] : [v];
    onChange?.(dedupe(next));
    setInput("");
  }

  function remove(i) {
    const next = [...(value || [])];
    next.splice(i, 1);
    onChange?.(next);
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <div className="text-sm font-semibold text-gray-900">{title}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(value || []).length === 0 ? (
          <span className="text-sm text-gray-500">None yet</span>
        ) : (
          (value || []).map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-800"
            >
              {v}
              {!disabled && (
                <button onClick={() => remove(i)} className="text-gray-400 hover:text-gray-700">
                  ×
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {!disabled && (
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="button"
            onClick={add}
            className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function TextListEditor({ title, hint, value, onChange, placeholder, disabled }) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (!v) return;
    const next = Array.isArray(value) ? [...value, v] : [v];
    onChange?.(dedupe(next));
    setInput("");
  }

  function remove(i) {
    const next = [...(value || [])];
    next.splice(i, 1);
    onChange?.(next);
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          {hint ? <div className="text-xs text-gray-500 mt-1">{hint}</div> : null}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {(value || []).length === 0 ? (
          <div className="text-sm text-gray-500">None yet</div>
        ) : (
          (value || []).map((v, i) => (
            <div key={`${v}-${i}`} className="flex items-start gap-2">
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800">
                {v}
              </div>
              {!disabled && (
                <button
                  onClick={() => remove(i)}
                  className="h-10 w-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center justify-center"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {!disabled && (
        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="button"
            onClick={add}
            className="h-10 px-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 inline-flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function TextListReadOnly({ items }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return <div className="text-sm text-gray-500">None</div>;
  return (
    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
      {list.map((t, i) => (
        <li key={`${t}-${i}`}>{t}</li>
      ))}
    </ul>
  );
}

/* ------------------ storage helpers ------------------ */

function loadCampaignById(id) {
  try {
    const byIdRaw = localStorage.getItem("campaignsById");
    if (byIdRaw) {
      const byId = JSON.parse(byIdRaw);
      if (byId && byId[id]) return byId[id];
    }
    // fallback if only campaigns[] exists
    const listRaw = localStorage.getItem("campaigns");
    if (listRaw) {
      const list = JSON.parse(listRaw);
      if (Array.isArray(list)) {
        return list.find((c) => String(c?._id || c?.id) === id) || null;
      }
    }
  } catch {}
  return null;
}

function persist(id, patch) {
  try {
    const byIdRaw = localStorage.getItem("campaignsById");
    const byId = byIdRaw ? JSON.parse(byIdRaw) : {};
    byId[id] = { ...(byId[id] || {}), ...(patch || {}) };
    localStorage.setItem("campaignsById", JSON.stringify(byId));
  } catch {}
}

function setByPath(obj, path, value) {
  const parts = String(path).split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const isIndex = Number.isFinite(Number(nextKey));
    if (cur[key] == null) cur[key] = isIndex ? [] : {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
}

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const k = String(v).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

/* ------------------ stubs (replace later) ------------------ */

function stubGenerateAdsDraft(campaignId) {
  // You can inject campaign info later; for now just produce something realistic.
  const id = String(campaignId || "");
  return {
    searchCampaign: {
      campaignName: `Campaign ${id.slice(0, 6)}`,
      goal: "leads",
      landingPageUrl: "",
      geo: "",
      language: "English",
      budget: "",
    },
    adGroups: [
      {
        id: `ag_${Date.now()}_1`,
        name: "Core service",
        theme: "Primary service intent",
        finalUrl: "",
        keywordsExact: ["[service near me]", "[best service]"],
        keywordsPhrase: ['"service near me"', '"local service"'],
        negatives: ["free", "jobs", "salary"],
        rsa: {
          headlines: [
            "Fast, Reliable Service",
            "Book Today",
            "Local Experts",
            "Same-Day Availability",
            "Upfront Pricing",
            "Trusted by Locals",
            "Get a Free Estimate",
            "Quality Work Guaranteed",
            "Licensed & Insured",
            "Call Now",
          ],
          descriptions: [
            "Get expert help today. Fast response and clear pricing.",
            "Trusted local team. Book in minutes and get results.",
            "Quality service, friendly support, and transparent quotes.",
          ],
          path1: "services",
          path2: "book",
          finalUrl: "",
        },
      },
      {
        id: `ag_${Date.now()}_2`,
        name: "Emergency / urgent",
        theme: "High-intent urgent searches",
        finalUrl: "",
        keywordsExact: ["[emergency service]", "[24/7 service]"],
        keywordsPhrase: ['"emergency service"', '"24/7 service"'],
        negatives: ["diy", "manual", "tutorial"],
        rsa: {
          headlines: [
            "Emergency Help 24/7",
            "Rapid Response",
            "Call For Immediate Support",
            "We Arrive Fast",
            "Local & Trusted",
            "Schedule Now",
            "Same-Day Service",
            "Upfront Quotes",
            "Certified Team",
            "Get Help Now",
          ],
          descriptions: [
            "Need help now? Fast response and expert service—day or night.",
            "Book urgent service in minutes. Clear pricing and reliable pros.",
            "Get immediate support. We’re ready when you need us.",
          ],
          path1: "emergency",
          path2: "24-7",
          finalUrl: "",
        },
      },
    ],
    assumptions: [
      "Assumed this campaign is focused on one primary service.",
      "Assumed users want fast response, clear pricing, and trust signals.",
      "You can adjust headlines/descriptions to match your exact offer.",
    ],
  };
}

function stubRegenerateRsa(adGroup, draft) {
  // simple variation
  const base = adGroup?.theme || "High intent";
  return {
    ...adGroup.rsa,
    headlines: dedupe([
      `${base} — Book Now`,
      "Fast Quotes",
      "Local Pros",
      "Upfront Pricing",
      "Same-Day Service",
      "Trusted Team",
      "Easy Scheduling",
      "Call Today",
      "Get Help Now",
      "Top-Rated Service",
    ]),
    descriptions: dedupe([
      "Fast response and clear pricing. Book in minutes.",
      "Local experts ready to help—get a quote today.",
      "Quality work with friendly support. Schedule now.",
    ]),
  };
}
