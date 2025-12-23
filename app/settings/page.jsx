"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import SettingsForm from "@/components/chat/settings/SettingsForm";
import ConnectGoogleAdsBtn from "@/components/chat/campaign/ConnectGoogleAdsBtn";
import { useAuth } from "@/context/useContext";

export default function SettingsPage() {
  const { token, user } = useAuth();
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  // --- Estados de Datos ---
  const [googleAdsData, setGoogleAdsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 3. EFECTO DE CARGA DE DATOS
  useEffect(() => {
    if (!token) return;

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const rawComp = await res.json();
          const compObj = Array.isArray(rawComp)
            ? rawComp[0]
            : rawComp.data || rawComp;

          if (compObj?.googleAds) {
            setGoogleAdsData(compObj.googleAds);
          }
        }
      } catch (error) {
        console.error("Error fetching google ads status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [token]);

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
          <p className="text-gray-500 text-sm mb-8">
            Update your personal and business information.
          </p>

          <SettingsForm />

          {/* SECTION: INTEGRATIONS */}
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-4">
              <div className="text-base font-semibold text-gray-900">
                Platform Integrations
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Connect your ad accounts to sync generated assets directly.
              </div>
            </div>

            {/*  Pasamos los datos cargados o mostramos loading */}
            {loading ? (
              <div className="h-20 bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <ConnectGoogleAdsBtn googleAdsData={googleAdsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
