// app/chat/ChatClient.jsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import BrandImportPanel from "@/components/chat/onboarding/BrandImportPanel";

const DRAFT_KEY = "sweet:brandDraft";

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeContext, setActiveContext] = useState("general");
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  const [brandStatus, setBrandStatus] = useState("none"); // "none" | "importing" | "draft_ready" | "locked" | "failed"
  const [brandDraft, setBrandDraft] = useState(null);

  const aiCompleted = searchParams.get("aiCompleted") === "true";
  const aiCompletedSignal = aiCompleted ? Date.now() : 0;

  const headerTitle = useMemo(() => {
    if (brandStatus === "locked") return "Brand ready";
    if (brandStatus === "draft_ready") return "Draft ready";
    if (brandStatus === "importing") return "Importing brand…";
    return "Import your brand";
  }, [brandStatus]);

  function clearAICompletedParam() {
    router.replace("/chat");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus={brandStatus}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => {}} // right sidebar no longer used for confirmation flow
        />

        <div className="flex-1 min-h-0">
          <BrandImportPanel
            brandStatus={brandStatus}
            onStartImport={() => {
              setBrandStatus("importing");
              setBrandDraft(null);
            }}
            onDraftReady={(draft) => {
              setBrandDraft(draft);
              setBrandStatus("draft_ready");
              try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
              } catch {}
            }}
            onImportFailed={() => setBrandStatus("failed")}
            onGoToAIBrandSetup={() => router.push("/chat/brand-ai")}
            aiCompletedSignal={aiCompletedSignal}
            onAICompletedHandled={clearAICompletedParam}
            onConfirmBrand={(draft) => {
              try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
              } catch {}
              setBrandStatus("draft_ready");
              router.push("/chat/brand-details?mode=review");
            }}
          />
        </div>
      </div>
    </div>
  );
}
