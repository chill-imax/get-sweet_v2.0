"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import LeftSidebar from "@/components/chat/LeftSideBar";
import RightSidebar from "@/components/chat/RightSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import CampaignAdsDraftPanel from "@/components/chat/campaign/CampaignAdsDraftPanel";

export default function CampaignPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const activeContext = String(id);
  const headerTitle = useMemo(() => "Campaign", []);

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        activeContext={activeContext}
        setActiveContext={(ctx) => {
          if (ctx === "general") router.push("/chat");
          else router.push(`/chat/campaign/${ctx}`);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={activeContext}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => setIsRightOpen(true)}
        />

        <div className="flex-1 min-h-0">
          {/* ✅ This is the campaign generator/workspace */}
          <CampaignAdsDraftPanel campaignId={activeContext} />
        </div>
      </div>

      <RightSidebar
        isOpen={isRightOpen}
        setIsOpen={setIsRightOpen}
        activeContext={activeContext}
        mode="campaign"
        campaignId={activeContext}
      />
    </div>
  );
}
