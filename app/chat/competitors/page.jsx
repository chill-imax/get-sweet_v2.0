"use client";

import { useState, useMemo } from "react";

// Components
import CompetitorTester from "@/components/chat/competitors/CompetitorsSection";
import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";

export default function Competitors() {
  // 1. State Definitions (Faltaban en tu código original)
  const [activeContext, setActiveContext] = useState("competitors");
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  // Dummy ID para la campaña, o puedes tomarlo de params/context si existe
  const campaignId = "new-campaign";

  // 2. Memoize Header Title
  const headerTitle = useMemo(() => "Competitor Intelligence", []);

  return (
    // CONTENEDOR PRINCIPAL: Flex row para las 3 columnas
    <div className="flex h-screen bg-gray-50">
      {/* --- LEFT SIDEBAR --- */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus=""
      />

      {/* --- CENTER CONTENT (Columna central) --- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        {/* Header Fijo */}
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        {/* Área Scrollable para el contenido */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-4">
          <CompetitorTester />
        </div>
      </div>
    </div>
  );
}
