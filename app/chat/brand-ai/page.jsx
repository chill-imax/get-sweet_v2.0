"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import ChatWindow from "@/components/chat/ChatWindow";

export default function BrandAIPage() {
  const router = useRouter();

  const [activeContext, setActiveContext] = useState("general");
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const headerTitle = useMemo(() => "Brand Setup (AI)", []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT NAV */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus="ai"
      />

      {/* CENTER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="flex-1 min-h-0">
          <ChatWindow activeContext="general" />
        </div>

        <div className="border-t border-gray-100 bg-white p-3 flex items-center justify-between">
          <button
            className="text-xs font-semibold text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/chat")}
          >
            ← Back to import options
          </button>

          <button
            className="h-9 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
            onClick={() => router.push("/chat?aiCompleted=true")}
          >
            Finish setup
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={activeContext}
        brandStatus="ai"
        onboardingMode="ai"
      />
    </div>
  );
}
