"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import BrandImportPanel from "@/components/chat/onboarding/BrandImportPanel";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeContext, setActiveContext] = useState("general");
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  // This is still your "flow" status (not persisted yet)
  const [brandStatus, setBrandStatus] = useState("none"); // "none" | "importing" | "draft_ready" | "locked" | "failed"

  // Optional placeholders for later
  const [brandDraft, setBrandDraft] = useState(null);
  const [importJobId, setImportJobId] = useState(null);

  // AI completion signal (no DB needed)
  const aiCompleted = searchParams.get("aiCompleted") === "true";
  const aiCompletedSignal = aiCompleted ? Date.now() : 0;

  const headerTitle = useMemo(() => {
    if (brandStatus === "locked") return "Brand ready";
    if (brandStatus === "draft_ready") return "Review brand draft";
    if (brandStatus === "importing") return "Importing brand…";
    return "Import your brand";
  }, [brandStatus]);

  function clearAICompletedParam() {
    router.replace("/chat");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT NAV */}
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={setActiveContext}
        brandStatus={brandStatus}
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
          <BrandImportPanel
            brandStatus={brandStatus}
            onStartImport={() => {
              setBrandStatus("importing");
              setBrandDraft(null);
              setImportJobId(null);
            }}
            onJobCreated={(jobId) => setImportJobId(jobId)}
            onDraftReady={() => {
              // Later: setBrandDraft(draft)
              setBrandStatus("draft_ready");
            }}
            onConfirmBrand={() => setBrandStatus("locked")}
            onImportFailed={() => setBrandStatus("failed")}
            onGoToAIBrandSetup={() => router.push("/chat/brand-ai")}
            aiCompletedSignal={aiCompletedSignal}
            onAICompletedHandled={clearAICompletedParam}
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={activeContext}
        brandStatus={brandStatus}
        brandDraft={brandDraft}
        importJobId={importJobId}
        onboardingMode="import"
      />
    </div>
  );
}
