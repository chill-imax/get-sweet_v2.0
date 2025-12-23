"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Save, X } from "lucide-react"; // Importamos iconos necesarios

// Layout Components
import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";

// Hook Lógico
import { useBrandDetails } from "@/components/chat/brand-details/useBrandDetails";

// Componentes de Secciones
import InfoSection from "@/components/chat/brand-details/sections/InfoSection";
import MissionSection from "@/components/chat/brand-details/sections/MissionSection";
import ListsSection from "@/components/chat/brand-details/sections/ListsSection";
import ColorsSection from "@/components/chat/brand-details/sections/ColorsSection";
import GoalsSection from "@/components/chat/brand-details/sections/GoalsSection";

export default function BrandDetailsClient() {
  // 1. Estados del Layout
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [activeContext, setActiveContext] = useState("brand");

  // 2. Lógica del Brand Details
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "edit";

  const {
    formData,
    handleChange,
    handleCancel,
    handleSaveChanges,
    isSaving,
    loading,
  } = useBrandDetails();

  // 3. UI State de las secciones
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

  // Loading State Global
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // DEFINIMOS LOS BOTONES DE ACCIÓN (Para pasarlos al Header)
  const ActionButtons = (
    <div className="flex items-center gap-2">
      {/* Botón Cancelar (Ghost) */}
      <button
        onClick={handleCancel}
        disabled={isSaving}
        className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Cancel
      </button>

      {/* Botón Guardar (Primary) */}
      <button
        onClick={handleSaveChanges}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {mode === "review" ? "Confirm Draft" : "Save Changes"}
        </span>
        <span className="sm:hidden">Save</span>
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- LEFT SIDEBAR --- */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus="draft_ready"
      />

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        {/* A. GLOBAL HEADER con ACCIONES INYECTADAS */}
        <ChatHeader
          headerTitle={mode === "review" ? "Review Brand" : "Brand Details"}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          rightActions={ActionButtons}
        />

        {/* B. SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Info */}
            <InfoSection
              isOpen={sections.info}
              onToggle={() => toggleSection("info")}
              formData={formData}
              onChange={handleChange}
            />

            {/* Mission */}
            <MissionSection
              isOpen={sections.mission}
              onToggle={() => toggleSection("mission")}
              formData={formData}
              onChange={handleChange}
            />

            {/* Goals */}
            <GoalsSection
              isOpen={sections.goals}
              onToggle={() => toggleSection("goals")}
              formData={formData}
              onChange={handleChange}
            />

            {/* Services */}
            <ListsSection
              title="Services"
              fieldKey="services"
              items={formData.services}
              isOpen={sections.services}
              onToggle={() => toggleSection("services")}
              onChange={handleChange}
            />

            {/* Differentiators */}
            <ListsSection
              title="Differentiators"
              fieldKey="differentiators"
              items={formData.differentiators}
              isOpen={sections.diff}
              onToggle={() => toggleSection("diff")}
              onChange={handleChange}
            />

            {/* Brand Voice */}
            <ListsSection
              title="Brand Voice"
              fieldKey="values"
              items={formData.values}
              isOpen={sections.voice}
              onToggle={() => toggleSection("voice")}
              onChange={handleChange}
            />

            {/* Colors */}
            <ColorsSection
              isOpen={sections.colors}
              onToggle={() => toggleSection("colors")}
              formData={formData}
              onChange={handleChange}
            />

            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
