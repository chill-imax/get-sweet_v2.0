"use client";

import { useState, useEffect, useMemo } from "react";
import { Layout, X, Save, Loader2 } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/useContext";
import { SidebarSection } from "./ui/SidebarSection";
import { EditableField } from "./ui/EditableField";
import { EditableTextArea } from "./ui/EditableTextArea";
import { EditableList } from "./ui/EditableList";
import { EditableColorPalette } from "./ui/EditableColorPalette";

export default function RightSidebar({ isOpen, setIsOpen, activeContext }) {
  const { companyData, updateCompanyState, loading } = useCompany();
  const { token } = useAuth();

  /* ---------------- UI SECTIONS ---------------- */
  const [sections, setSections] = useState({
    info: true,
    mission: false,
    services: false,
    diff: false,
    voice: false,
    trust: false,
    colors: false,
  });

  const toggleSection = (key) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ---------------- EDITING STATE ---------------- */
  const [editingSection, setEditingSection] = useState(null);
  const isEditing = (key) => editingSection === key;
  const hasEditing = Boolean(editingSection);

  const stopEditingAll = () => setEditingSection(null);

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (companyData) setFormData(companyData);
  }, [companyData]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(companyData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(companyData);
    stopEditingAll();
  };

  /* ---------------- PREVIEWS (collapsed summaries) ---------------- */
  const previews = useMemo(() => {
    const brandName = formData?.brandName || "Add your brand name";
    const industry = formData?.industry ? `Industry: ${formData.industry}` : "";
    const aka = formData?.aka ? `AKA: ${formData.aka}` : "";

    const infoPreview = [brandName, aka, industry].filter(Boolean).join(" • ");

    const missionPreview =
      formData?.mission?.trim() ||
      formData?.vision?.trim() ||
      "Add your mission and vision";

    const servicesArr = Array.isArray(formData?.services) ? formData.services : [];
    const servicesPreview =
      servicesArr.length > 0
        ? `${servicesArr.length} services: ${servicesArr.slice(0, 2).join(", ")}${
            servicesArr.length > 2 ? "…" : ""
          }`
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
        ? `Voice: ${voiceArr.slice(0, 3).join(", ")}${voiceArr.length > 3 ? "…" : ""}`
        : "Add brand voice traits (e.g., friendly, confident)";

    const colorsArr = Array.isArray(formData?.colors) ? formData.colors : [];
    const colorsPreview =
      colorsArr.length > 0
        ? `${colorsArr.length} colors: ${colorsArr.slice(0, 3).join(", ")}${
            colorsArr.length > 3 ? "…" : ""
          }`
        : "Add brand colors";

    return {
      infoPreview,
      missionPreview,
      servicesPreview,
      diffPreview,
      voicePreview,
      colorsPreview,
    };
  }, [formData]);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);
    setToast(null);

    const dataToSave = Object.entries(formData).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) acc[key] = trimmed;
      } else if (Array.isArray(value)) {
        acc[key] = value
          .map((v) => (typeof v === "string" ? v.trim() : v))
          .filter(Boolean);
      } else if (value && typeof value === "object") {
        acc[key] = value;
      }
      return acc;
    }, {});

    try {
      const res = await fetch(
        "https://backend-get-sweet-v2-0.onrender.com/api/v1/company/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSave),
        }
      );

      if (!res.ok) throw new Error("Save failed");

      const json = await res.json();
      const updated = json.data || json.companyData;

      updateCompanyState(updated);
      stopEditingAll();

      setToast({ type: "success", message: "Your changes have been saved." });
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Failed to save changes. Please try again.",
      });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 w-80 bg-white border-l flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-gray-50 border-l flex flex-col transition-transform
        ${isOpen ? "translate-x-0" : "translate-x-full"} lg:relative lg:translate-x-0`}
      >
        {/* HEADER */}
        <div className="h-16 border-b flex items-center justify-between px-5 bg-white sticky top-0 z-10">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-500" />
            Brand Details
          </h3>

          {hasEditing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-semibold disabled:bg-gray-400"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:bg-gray-100 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* TOAST */}
        {toast && (
          <div
            className={`mx-4 mt-3 px-4 py-2 rounded-lg text-sm font-medium border
            ${
              toast.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* CONTENT */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {activeContext === "general" && (
            <>
              {/* INFO */}
              <SidebarSection
                title="Info"
                isOpen={sections.info}
                onToggle={() => toggleSection("info")}
                onEdit={() => setEditingSection("info")}
                preview={previews.infoPreview}
              >
                <EditableField
                  label="Brand Name"
                  value={formData.brandName}
                  isEditing={isEditing("info")}
                  forceLabel
                  onChange={(val) => handleChange("brandName", val)}
                  placeholder="Your official business name"
                />
                <EditableField
                  label="Alias / AKA"
                  value={formData.aka}
                  isEditing={isEditing("info")}
                  onChange={(val) => handleChange("aka", val)}
                  forceLabel
                  placeholder="Sweet Manager"
                />
                <EditableField
                  label="Industry"
                  value={formData.industry}
                  isEditing={isEditing("info")}
                  onChange={(val) => handleChange("industry", val)}
                  forceLabel
                  placeholder="SaaS, Marketing"
                />
              </SidebarSection>

              {/* MISSION & VISION */}
              <SidebarSection
                title="Mission & Vision"
                isOpen={sections.mission}
                onToggle={() => toggleSection("mission")}
                onEdit={() => setEditingSection("mission")}
                preview={previews.missionPreview}
              >
                <EditableTextArea
                  label="Mission"
                  value={formData.mission}
                  isEditing={isEditing("mission")}
                  onChange={(val) => handleChange("mission", val)}
                />
                <div className="pt-3 border-t border-gray-200">
                  <EditableTextArea
                    label="Vision"
                    value={formData.vision}
                    isEditing={isEditing("mission")}
                    onChange={(val) => handleChange("vision", val)}
                  />
                </div>
              </SidebarSection>

              {/* SERVICES */}
              <SidebarSection
                title="Services"
                isOpen={sections.services}
                onToggle={() => toggleSection("services")}
                onEdit={() => setEditingSection("services")}
                preview={previews.servicesPreview}
              >
                <EditableList
                  items={formData.services}
                  isEditing={isEditing("services")}
                  onChange={(val) => handleChange("services", val)}
                />
              </SidebarSection>

              {/* DIFFERENTIATORS */}
              <SidebarSection
                title="Differentiators"
                isOpen={sections.diff}
                onToggle={() => toggleSection("diff")}
                onEdit={() => setEditingSection("diff")}
                preview={previews.diffPreview}
              >
                <EditableList
                  items={formData.differentiators}
                  isEditing={isEditing("diff")}
                  onChange={(val) => handleChange("differentiators", val)}
                />
              </SidebarSection>

              {/* BRAND VOICE */}
              <SidebarSection
                title="Brand Voice"
                isOpen={sections.voice}
                onToggle={() => toggleSection("voice")}
                onEdit={() => setEditingSection("voice")}
                preview={previews.voicePreview}
              >
                <EditableList
                  items={formData.values}
                  isEditing={isEditing("values")}
                  onChange={(val) => handleChange("values", val)}
                />
              </SidebarSection>

              {/* COLORS */}
              <SidebarSection
                title="Colors"
                isOpen={sections.colors}
                onToggle={() => toggleSection("colors")}
                onEdit={() => setEditingSection("colors")}
                preview={previews.colorsPreview}
              >
                <EditableColorPalette
                  colors={formData.colors}
                  isEditing={isEditing("colors")}
                  onChange={(val) => handleChange("colors", val)}
                />
              </SidebarSection>
            </>
          )}
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
