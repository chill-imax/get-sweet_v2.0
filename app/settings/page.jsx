"use client";

import { useState } from "react";
import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import SettingsForm from "@/components/chat/settings/SettingsForm";

export default function SettingsPage() {
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <ChatHeader
          headerTitle="Settings"
          activeContext="settings"
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => {}}
        />

        <div className="flex-1 overflow-y-auto px-6 py-10 max-w-2xl mx-auto w-full">
          {/* <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1> */}
          <p className="text-gray-500 text-sm mb-8">
            Update your personal and business information.
          </p>

          <SettingsForm />
        </div>
      </div>
    </div>
  );
}
