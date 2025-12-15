"use client";

import {
  MessageSquare,
  Rocket,
  Settings,
  Sparkles,
  X,
  LogOut,
  User,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/useContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LeftSidebar({
  isOpen,
  setIsOpen,
  activeContext,
  setActiveContext,
  campaigns = [
    { id: "campaign_winter_2025", name: "Winter 2025" },
    { id: "campaign_summer_2024", name: "Summer 2024" },
  ],
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitials = (name) =>
    name ? name.substring(0, 2).toUpperCase() : "U";

  const navigate = (contextId) => {
    if (typeof setActiveContext === "function") {
      setActiveContext(contextId);
    } else {
      router.push("/chat");
    }
    setIsOpen?.(false);
  };

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          border-r border-slate-800
          flex flex-col
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Sweet Manager
            </span>
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MAIN NAV (scrollable) */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* BRAND */}
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase mb-2">
            Brand
          </div>

          <nav className="space-y-1 px-2">
            <button
              onClick={() => navigate("general")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeContext === "general"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Brand setup
            </button>
          </nav>

          {/* CAMPAIGNS */}
          <div className="mt-8 px-4 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
            <span>Campaigns</span>
            <button
              className="text-slate-400 hover:text-white transition-colors"
              title="Create campaign"
              aria-label="Create campaign"
              onClick={() => {
                // TODO: open create-campaign modal
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1 px-2">
            {campaigns.map((c) => {
              const isActive = activeContext === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => navigate(c.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Rocket className="w-4 h-4" />
                    {c.name}
                  </div>
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full bg-green-500"
                      aria-label="Active campaign"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* FIXED BOTTOM */}
        <div className="shrink-0 border-t border-slate-800">
          {/* Settings (fixed) */}
          <div className="p-2">
            <button
              onClick={() => router.push("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* User (fixed) */}
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

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
