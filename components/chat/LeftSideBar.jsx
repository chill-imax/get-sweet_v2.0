"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HouseHeart,
  Rocket,
  Settings,
  Sparkles,
  X,
  LogOut,
  User,
  Plus,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "@/context/useContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function LeftSidebar({ isOpen, setIsOpen }) {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [campaignList, setCampaignList] = useState([]);

  const getInitials = (name) => (name ? name.substring(0, 2).toUpperCase() : "U");

  // URL-derived active state for a specific campaign id
  const activeCampaignId = useMemo(() => {
    if (!pathname) return null;
    if (!pathname.startsWith("/chat/campaign/")) return null;

    const rest = pathname.replace("/chat/campaign/", "");
    const id = rest.split("/")[0];
    if (!id || id === "new") return null; // don't treat /new as a campaign
    return id;
  }, [pathname]);

  const isOnBrandSetup = useMemo(() => {
    return pathname === "/chat" || pathname === "/chat/";
  }, [pathname]);

  // ✅ Campaigns “home” page (hub / marketplace page)
  const isOnCampaignsHome = useMemo(() => {
    // If your hub route is /chat/campaign (recommended)
    return pathname === "/chat/campaign" || pathname === "/chat/campaign/";
    // If your hub route is /chat/campaigns instead, replace with:
    // return pathname === "/chat/campaigns" || pathname === "/chat/campaigns/";
  }, [pathname]);

  const getCampaignsList = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.campaigns)
        ? data.campaigns
        : [];

      setCampaignList(list);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  useEffect(() => {
    getCampaignsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function navigateToBrand() {
    router.push("/chat");
    setIsOpen?.(false);
  }

  // ✅ Campaign hub page
  function navigateToCampaignsHome() {
    router.push("/chat/campaign"); // change to /chat/campaigns if that's your route
    setIsOpen?.(false);
  }

  function navigateToCampaign(id) {
    router.push(`/chat/campaign/${id}`);
    setIsOpen?.(false);
  }

  function navigateToNewCampaign() {
    router.push("/chat/campaign/new");
    setIsOpen?.(false);
  }

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          border-r border-slate-800 flex flex-col
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <button onClick={() => router.push("/chat")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Sweet Manager</span>
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MAIN NAV */}
        <div className="flex-1 overflow-y-auto py-4">

          <nav className="space-y-1 px-2">
            <button
              onClick={navigateToBrand}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isOnBrandSetup
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <HouseHeart className="w-4 h-4" />
              Brand Dashboard
            </button>
          </nav>

          <nav className="space-y-1 px-2 mt-2">
            {/* ✅ NEW: Campaigns hub entry */}
            <button
              onClick={navigateToCampaignsHome}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isOnCampaignsHome
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Campaigns Home
            </button>

            {/* CAMPAIGNS */}
            <div className="px-4 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-0">
              <span>Campaigns</span>
              <button
                className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                title="Create campaign"
                aria-label="Create campaign"
                onClick={navigateToNewCampaign}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {campaignList.length === 0 ? (
              <p className="px-3 text-xs text-slate-600 italic">No campaigns yet.</p>
            ) : (
              <div className="pt-2 space-y-1">
                {campaignList.map((c) => {
                  const id = c?._id || c?.id;
                  const name = c?.name || "Untitled campaign";
                  const isActive = activeCampaignId === String(id);

                  return (
                    <button
                      key={id}
                      onClick={() => navigateToCampaign(id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Rocket className="w-4 h-4 shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>

                      {isActive && (
                        <span
                          className="w-2 h-2 rounded-full bg-green-500 shrink-0"
                          aria-label="Active campaign"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

        {/* FIXED BOTTOM */}
        <div className="shrink-0 border-t border-slate-800">
          <div className="p-2">
            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {user?.image || user?.avatar ? (
                  <Image
                    src={user.image || user.avatar}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover bg-slate-700"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {getInitials(user?.fullName)}
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <p className="font-medium text-sm truncate text-white">
                    {user?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-slate-500 truncate capitalize">
                    {user?.role || "Free plan"}
                  </p>
                </div>
              </div>

              {user ? (
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => router.push("/sign-in")}
                  className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign in"
                  aria-label="Sign in"
                >
                  <User className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
