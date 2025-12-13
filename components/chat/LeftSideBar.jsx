"use client";
import {
  MessageSquare,
  Settings,
  Sparkles,
  Rocket,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/useContext";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 1. Importamos useRouter

export default function LeftSidebar({
  isOpen,
  setIsOpen,
  activeContext,
  setActiveContext,
}) {
  const { user, logout } = useAuth();
  const router = useRouter(); // 2. Inicializamos el router

  // Helper para iniciales
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "U";
  };

  // 3. FUNCIÓN DE NAVEGACIÓN INTELIGENTE
  const handleNavigation = (contextId) => {
    // Si setActiveContext existe, significa que estamos en /chat
    if (typeof setActiveContext === "function") {
      setActiveContext(contextId);
    } else {
      // Si no existe (estamos en /settings), forzamos la navegación
      router.push("/chat");
    }

    // Cerramos el menú móvil si está abierto
    if (setIsOpen) setIsOpen(false);
  };

  console.log("CONTEXT USER:", user);

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out border-r border-slate-800
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          {/* Cambiamos div por button y agregamos onClick */}
          <button
            onClick={() => (window.location.href = "/chat")}
            className="flex items-center gap-2 cursor-pointer transition-opacity"
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
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 text-xs font-semibold text-slate-500 uppercase mb-2">
            Principal
          </div>

          <nav className="space-y-1 px-2">
            <button
              onClick={() => handleNavigation("general")} // 4. Usamos el handler
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeContext === "general"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat General
            </button>
            <button
              onClick={() => router.push("/settings")} // Navegación directa
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>

          <div className="mt-8 px-4 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
            <span>Mis Campañas</span>
            <button className="hover:text-white text-lg leading-none transition-colors">
              +
            </button>
          </div>

          <nav className="space-y-1 px-2">
            <button
              onClick={() => handleNavigation("campaign_1")} // 4. Usamos el handler
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeContext === "campaign_1"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Rocket className="w-4 h-4" />
                Navidad 2025
              </div>
              {activeContext === "campaign_1" && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          </nav>
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
                  className="w-9 h-9 rounded-full bg-slate-700 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  {getInitials(user?.fullName)}
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <p className="font-medium text-sm truncate text-white">
                  {user?.fullName || "Guest User"}
                </p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {user?.role || "Free Plan"}
                </p>
              </div>
            </div>

            {user ? (
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/sign-in")}
                className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign in"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
