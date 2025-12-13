"use client";
import { useState } from "react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatWindow from "@/components/chat/ChatWindow";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";

export default function ChatPage() {
  // Estado Global de la Interfaz
  const [activeContext, setActiveContext] = useState("general"); // 'general' | 'campaign_id'
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  // Título dinámico según contexto
  const headerTitle =
    activeContext === "general"
      ? "General Chat / Branding"
      : "Campaña Navidad 2025";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. NAVEGACIÓN IZQUIERDA */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
      />

      {/* 2. ÁREA CENTRAL (CHAT) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        {/* HEADER */}
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        {/* Chat con scroll interno */}
        <div className="flex-1 min-h-0">
          <ChatWindow />
        </div>
      </div>

      {/* 3. CONTEXTO DERECHA */}
      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={activeContext}
      />
    </div>
  );
}
