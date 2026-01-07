"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import LeftSidebar from "@/components/chat/LeftSideBar";
import ChatHeader from "@/components/chat/ui/HeaderChat";
import SettingsForm from "@/components/chat/settings/SettingsForm";
import ConnectGoogleAdsBtn from "@/components/chat/campaign/ConnectGoogleAdsBtn";
import { useAuth } from "@/context/useContext";
import PricingSection from "@/components/ui/sections/Pricing";
import { useSearchParams, useRouter } from "next/navigation";
import SuccessModal from "@/components/ui/SuccessModal";

export default function SettingsPage() {
  const { token, user, refreshProfile } = useAuth();
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const [googleAdsData, setGoogleAdsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ 1. EFECTO PARA DETECTAR PAGO EXITOSO
  useEffect(() => {
    const paymentSuccess = searchParams.get("payment_success") === "true";

    if (paymentSuccess) {
      setShowSuccessModal(true);
      if (refreshProfile) {
        refreshProfile();
      }

      router.replace("/settings");
    }
  }, [searchParams, router, refreshProfile]);

  // ✅ 2. EFECTO PARA CARGAR DATOS DE GOOGLE ADS
  useEffect(() => {
    if (!token) return;

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
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
      <LeftSidebar isOpen={isLeftOpen} setIsOpen={setIsLeftOpen} />

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
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-8">
            <div className="mb-4">
              <div className="text-base font-semibold text-gray-900">
                Platform Integrations
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Connect your ad accounts to sync generated assets directly.
              </div>
            </div>

            {loading ? (
              <div className="h-20 bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <ConnectGoogleAdsBtn googleAdsData={googleAdsData} />
            )}
          </div>

          {/* SECTION: SUBSCRIPTION / PLANS */}
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-gray-900">
                  Current Plan:{" "}
                  <span className="capitalize text-purple-600">
                    {user?.plan || "Free"}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {user?.plan && user.plan !== "free"
                    ? "Your premium features are active."
                    : "Upgrade to unlock advanced AI campaign features."}
                </div>
              </div>

              <button
                onClick={() => setIsPricingOpen(true)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-sm ${
                  user?.plan && user.plan !== "free"
                    ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {user?.plan && user.plan !== "free"
                  ? "Manage Plan"
                  : "See Plans"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PRICING */}
      {isPricingOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsPricingOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full z-10 transition-all"
            >
              <X size={24} />
            </button>

            <div className="p-4">
              <PricingSection />
            </div>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
