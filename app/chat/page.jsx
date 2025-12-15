"use client";

import { useMemo, useState } from "react";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatWindow from "@/components/chat/ChatWindow";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import BrandImportPanel from "@/components/chat/onboarding/BrandImportPanel";

export default function ChatPage() {
  // Context selection: general vs specific campaign
  const [activeContext, setActiveContext] = useState("general"); // "general" | "campaign:<id>"

  // UI chrome
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  // Onboarding / brand state
  const [brandStatus, setBrandStatus] = useState("none"); 
  // "none" | "importing" | "draft_ready" | "locked"

  const uiMode = brandStatus === "none" ? "onboarding" : "chat";

  const headerTitle = useMemo(() => {
    if (uiMode === "onboarding") return "Import your brand";
    if (activeContext === "general") return "Chat General";
    return "Campaign"; // later: campaign name lookup
  }, [uiMode, activeContext]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1) LEFT NAV */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus={brandStatus} // use this to lock campaigns/goals
      />

      {/* 2) CENTER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="flex-1 min-h-0">
          {uiMode === "onboarding" ? (
            <BrandImportPanel
              brandStatus={brandStatus}
              onStartImport={() => setBrandStatus("importing")}
              onDraftReady={() => setBrandStatus("draft_ready")}
              onConfirmBrand={() => setBrandStatus("locked")}
            />
          ) : (
            <ChatWindow activeContext={activeContext} />
          )}
        </div>
      </div>

      {/* 3) RIGHT SIDEBAR */}
      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={activeContext}
        brandStatus={brandStatus}
      />
    </div>
  );
}
