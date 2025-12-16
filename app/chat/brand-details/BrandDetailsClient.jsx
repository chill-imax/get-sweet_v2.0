// app/chat/brand-details/BrandDetailsClient.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";

import { SidebarSection } from "@/components/chat/ui/SidebarSection";
import { EditableField } from "@/components/chat/ui/EditableField";
import { EditableTextArea } from "@/components/chat/ui/EditableTextArea";
import { EditableList } from "@/components/chat/ui/EditableList";
import EditableColorPalette from "@/components/chat/ui/EditableColorPalette";

const DRAFT_KEY = "sweet:brandDraft";

export default function BrandDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "edit"; // "review" | "edit"

  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // open sections by default in review mode
  const [sections, setSections] = useState({
    info: true,
    mission: true,
    goals: true,
    services: false,
    diff: false,
    voice: false,
    colors: false,
  });

  const toggleSection = (key) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      setFormData(JSON.parse(raw));
    } catch {}
  }, []);

  const previews = useMemo(() => {
    const brandName = formData?.brandName || "Add your brand name";
    const industry = formData?.industry ? `Industry: ${formData.industry}` : "";
    const aka = formData?.aka ? `AKA: ${formData.aka}` : "";
    const infoPreview = [brandName, aka, industry].filter(Boolean).join(" • ");

    const missionPreview =
      formData?.mission?.trim() ||
      formData?.vision?.trim() ||
      "Add your mission and vision";

    const primaryGoal =
      (formData?.primaryGoal || "").trim() || "Add your primary goal";
    const goalsArr = Array.isArray(formData?.goals) ? formData.goals : [];
    const goalsPreview =
      goalsArr.length > 0
        ? `${primaryGoal} • ${goalsArr.slice(0, 2).join(", ")}${
            goalsArr.length > 2 ? "…" : ""
          }`
        : primaryGoal;

    const servicesArr = Array.isArray(formData?.services) ? formData.services : [];
    const servicesPreview =
      servicesArr.length > 0
        ? `${servicesArr.length} services: ${servicesArr
            .slice(0, 2)
            .join(", ")}${servicesArr.length > 2 ? "…" : ""}`
        : "Add the services you offer";

    const diffArr = Array.isArray(formData?.differentiators)
      ? formData.differentiators
      : [];
    const diffPreview =
      diffArr.length > 0
        ? `${diffArr[0]}${diffArr.length > 1 ? "…" : ""}`
        : "Add what makes you different";

    const voiceArr = Array.isArray(formData?.values) ? formData.values : [];
    const voicePreview =
      voiceArr.length > 0
        ? `Voice: ${voiceArr.slice(0, 3).join(", ")}${
            voiceArr.length > 3 ? "…" : ""
          }`
        : "Add brand voice traits";

    return {
      infoPreview,
      missionPreview,
      goalsPreview,
      servicesPreview,
      diffPreview,
      voicePreview,
    };
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSave() {
    setIsSaving(true);
    setToast(null);

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      setToast({ type: "success", message: "Saved locally (backend later)." });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setIsSaving(false);
    }
  }

  function handleConfirmFinal() {
    try {
      localStorage.setItem("sweet:brandLocked", "true");
    } catch {}
    setToast({ type: "success", message: "Brand confirmed." });
    setTimeout(() => {
      setToast(null);
      router.push("/chat");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/chat")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-sm font-semibold text-gray-900">
            Brand Details {mode === "review" ? "(Review)" : ""}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 inline-flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>

            <button
              onClick={handleConfirmFinal}
              className="h-10 px-4 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 inline-flex items-center gap-2"
              title="Confirm brand"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>

        {toast ? (
          <div
            className={`max-w-4xl mx-auto px-4 pb-3 text-sm ${
              toast.type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {toast.message}
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <SidebarSection
          title="Info"
          isOpen={sections.info}
          onToggle={() => toggleSection("info")}
          preview={previews.infoPreview}
          onEdit={() => {}}
        >
          <EditableField
            label="Brand Name"
            value={formData.brandName}
            isEditing={true}
            forceLabel
            onChange={(val) => handleChange("brandName", val)}
            placeholder="Your official business name"
          />
          <EditableField
            label="Alias / AKA"
            value={formData.aka}
            isEditing={true}
            forceLabel
            onChange={(val) => handleChange("aka", val)}
            placeholder="Sweet Manager"
          />
          <EditableField
            label="Industry"
            value={formData.industry}
            isEditing={true}
            forceLabel
            onChange={(val) => handleChange("industry", val)}
            placeholder="e.g., Plumbing, SaaS, Restaurant"
          />
          <EditableField
            label="Target Audience"
            value={formData.targetAudience}
            isEditing={true}
            forceLabel
            onChange={(val) => handleChange("targetAudience", val)}
            placeholder="Who is this for?"
          />
          <EditableField
            label="Website"
            value={formData.website}
            isEditing={true}
            forceLabel
            onChange={(val) => handleChange("website", val)}
            placeholder="https://example.com"
          />
        </SidebarSection>

        <SidebarSection
          title="Mission & Vision"
          isOpen={sections.mission}
          onToggle={() => toggleSection("mission")}
          preview={previews.missionPreview}
          onEdit={() => {}}
        >
          <EditableTextArea
            label="Mission"
            value={formData.mission}
            isEditing={true}
            onChange={(val) => handleChange("mission", val)}
          />
          <div className="pt-3 border-t border-gray-200">
            <EditableTextArea
              label="Vision"
              value={formData.vision}
              isEditing={true}
              onChange={(val) => handleChange("vision", val)}
            />
          </div>
        </SidebarSection>

        <SidebarSection
          title="Goals"
          isOpen={sections.goals}
          onToggle={() => toggleSection("goals")}
          preview={previews.goalsPreview}
          onEdit={() => {}}
        >
          <EditableField
            label="Primary goal"
            value={formData.primaryGoal}
            isEditing={true}
            forceLabel
            onChange={(val) => handleChange("primaryGoal", val)}
            placeholder="e.g., Increase leads, Boost conversions, Grow awareness"
          />

          <div className="pt-3 border-t border-gray-200">
            <EditableList
              items={formData.goals}
              isEditing={true}
              onChange={(val) => handleChange("goals", val)}
            />
            <p className="mt-2 text-[11px] text-gray-400 leading-snug">
              Add 2–6 supporting goals (e.g., “Lower CPC”, “Increase email signups”).
            </p>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <EditableField
              label="Success metric"
              value={formData.successMetric}
              isEditing={true}
              forceLabel
              onChange={(val) => handleChange("successMetric", val)}
              placeholder="e.g., +30% leads/month, CAC under $20, 3% CTR"
            />
          </div>

          <div className="pt-3 border-t border-gray-200">
            <EditableField
              label="Timeframe"
              value={formData.goalTimeframe}
              isEditing={true}
              forceLabel
              onChange={(val) => handleChange("goalTimeframe", val)}
              placeholder="e.g., Next 30 days, Q1, This month"
            />
          </div>
        </SidebarSection>

        <SidebarSection
          title="Services"
          isOpen={sections.services}
          onToggle={() => toggleSection("services")}
          preview={previews.servicesPreview}
          onEdit={() => {}}
        >
          <EditableList
            items={formData.services}
            isEditing={true}
            onChange={(val) => handleChange("services", val)}
          />
        </SidebarSection>

        <SidebarSection
          title="Differentiators"
          isOpen={sections.diff}
          onToggle={() => toggleSection("diff")}
          preview={previews.diffPreview}
          onEdit={() => {}}
        >
          <EditableList
            items={formData.differentiators}
            isEditing={true}
            onChange={(val) => handleChange("differentiators", val)}
          />
        </SidebarSection>

        <SidebarSection
          title="Brand Voice"
          isOpen={sections.voice}
          onToggle={() => toggleSection("voice")}
          preview={previews.voicePreview}
          onEdit={() => {}}
        >
          <EditableList
            items={formData.values}
            isEditing={true}
            onChange={(val) => handleChange("values", val)}
          />
        </SidebarSection>

        <SidebarSection
          title="Colors"
          isOpen={sections.colors}
          onToggle={() => toggleSection("colors")}
          previewType="colors"
          previewData={formData.colors}
          onEdit={() => {}}
        >
          <EditableColorPalette
            colors={formData.colors}
            isEditing={true}
            onChange={(val) => handleChange("colors", val)}
          />
        </SidebarSection>
      </div>
    </div>
  );
}
