"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";

export default function ManagerIntroClient() {
  const router = useRouter();
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  const headerTitle = useMemo(() => "Sweet", []);

  return (
    <div className="flex h-screen bg-gray-50">
      <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <ChatHeader
          headerTitle={headerTitle}
          activeContext={"general"}
          onOpenLeft={() => setIsLeftOpen(true)}
          onOpenRight={() => {}}
        />

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-14">
            {/* Card */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8 md:p-10">
              {/* Big bot icon */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-linear-to-b from-purple-50 to-white border border-purple-100 flex items-center justify-center shadow-sm overflow-hidden">
                  {/* Put your bot image in /public/bots/sweet.png (or .webp) */}
                  <Image
                    src="/bots/sweet.png"
                    alt="Sweet"
                    width={120}
                    height={120}
                    className="w-16 h-16 object-contain"
                    priority
                  />
                </div>

                <h1 className="mt-5 text-2xl md:text-3xl font-semibold text-gray-900">
                  Meet Sweet
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-600 max-w-xl">
                  Your personal Marketing Campaign Manager AI. Tell Sweet your
                  goal and budget — it&apos;ll build campaign structure,
                  generate ads, and guide you step-by-step.
                </p>

                {/* What Sweet can do */}
                <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  {[
                    [
                      "Launch faster",
                      "Create ad groups, keywords, and copy in minutes.",
                    ],
                    [
                      "Stay consistent",
                      "Uses your brand details across every campaign.",
                    ],
                    [
                      "Improve results",
                      "Suggests tests, budgets, and optimizations.",
                    ],
                  ].map(([t, d]) => (
                    <div
                      key={t}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {t}
                      </div>
                      <div className="mt-1 text-xs text-gray-600">{d}</div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => router.push("/chat")}
                    className="h-11 px-5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Import brand first
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/chat/manager/chat")}
                    className="h-11 px-6 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
                  >
                    Get started
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Tip: you can start now — Sweet will ask only what it needs.
                </div>
              </div>
            </div>

            {/* Optional: secondary row like “Messenger intro” */}
            <div className="mt-8 text-center text-xs text-gray-500">
              By continuing, you agree that Sweet can use your inputs to
              generate campaign drafts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
