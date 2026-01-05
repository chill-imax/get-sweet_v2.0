"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  LogOut,
  RefreshCw,
  X,
  Ban, // Icono para cuentas bloqueadas
} from "lucide-react";
import api from "@/app/api/auth/axios";
import DisconnectModal from "../modals/DisconnectGoogleAds";

// --- Icono de Google ---
const GoogleIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function ConnectGoogleAdsBtn({ googleAdsData, onDisconnect }) {
  const isConnected = googleAdsData?.isConnected || false;
  const selectedCustomerId = googleAdsData?.customerId || null;
  const selectedCustomerName = googleAdsData?.customerName || null;

  const [loading, setLoading] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [activeCampaigns, setActiveCampaigns] = useState([]);

  // 1. Iniciar Auth
  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/googleads/connect/start");
      if (res.data.url) window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      alert("Error starting auth");
      setLoading(false);
    }
  };

  // 2. Fetch de Cuentas (Con manejo de Invalid Grant)
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/googleads/accounts");

      const accountsList = Array.isArray(res.data)
        ? res.data
        : res.data.accounts || [];

      setAccounts(accountsList);
      setShowAccountList(true);
    } catch (error) {
      console.error("Fetch Accounts Error:", error);

      // 🚨 MANEJO DE TOKEN EXPIRADO (INVALID_GRANT)
      // Si el backend devuelve 401 aquí, es que desconectó al usuario.
      if (error.response?.status === 401) {
        alert("Your Google session has expired. Please connect again.");
        window.location.reload(); // Recargar para mostrar botón de "Conectar"
        return;
      }

      alert(
        error.response?.data?.message || "Could not load Google Ads accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Seleccionar cuenta
  const selectAccount = async (account) => {
    setLoading(true);
    try {
      await api.post("/api/v1/googleads/accounts/select", {
        customerId: account.id,
        customerName: account.name,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error linking account");
      setLoading(false);
    }
  };

  // 4. Lógica de Desconexión
  const initiateDisconnect = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/campaigns");
      const allCampaigns = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      const runningCampaigns = allCampaigns.filter((c) => {
        const status = c.status?.toLowerCase() || "";
        return (
          ["active", "published", "enabled", "learning"].includes(status) &&
          !!c.googleAdsResourceId
        );
      });

      if (runningCampaigns.length > 0) {
        setActiveCampaigns(runningCampaigns);
        setShowDisconnectModal(true);
      } else {
        if (confirm("Are you sure you want to disconnect?")) {
          await executeDisconnect();
        }
      }
    } catch (error) {
      console.error("Error checking campaigns", error);
      if (confirm("⚠️ Error checking campaigns status. Disconnect anyway?")) {
        await executeDisconnect();
      }
    } finally {
      setLoading(false);
    }
  };

  const executeDisconnect = async () => {
    setLoading(true);
    try {
      await api.post("/api/v1/googleads/disconnect", { pauseCampaigns: true });
      if (onDisconnect) onDisconnect();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error disconnecting");
      setShowDisconnectModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Helper renderizado lista
  const renderAccountList = () => (
    <div className="mt-3 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="px-3 py-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 flex justify-between items-center">
        <span>Select Account</span>
        <button
          onClick={() => setShowAccountList(false)}
          className="text-gray-400 hover:text-gray-700"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {accounts.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500">
            No accounts found.
          </div>
        ) : (
          accounts.map((acc) => {
            // El backend ahora envía 'isSelectable' basado en si es ENABLED
            const isSelectable = acc.isSelectable !== false;

            return (
              <button
                key={acc.id}
                onClick={() => isSelectable && selectAccount(acc)}
                disabled={loading || !isSelectable}
                className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-0 flex items-center justify-between group transition-colors
                  ${
                    isSelectable
                      ? "hover:bg-blue-50 cursor-pointer text-gray-700"
                      : "bg-gray-50/50 cursor-not-allowed text-gray-400"
                  }
                `}
                title={
                  !isSelectable
                    ? `Account status: ${acc.status}`
                    : "Click to select"
                }
              >
                <div className="flex flex-col">
                  <span
                    className={`block font-medium ${
                      isSelectable ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {acc.name || `Account ${acc.id}`}
                  </span>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="block text-xs text-gray-400">
                      ID: {acc.id}
                    </span>
                    {/* BADGE DE ESTADO si no es seleccionable */}
                    {!isSelectable && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-500 uppercase tracking-wide">
                        {acc.blockReason || acc.status}
                      </span>
                    )}
                  </div>
                </div>

                {isSelectable ? (
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                ) : (
                  <Ban className="w-3 h-3 text-gray-300" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // --- CASO 3: CONECTADO Y CUENTA SELECCIONADA ---
  if (isConnected && selectedCustomerId) {
    return (
      <>
        <div className="flex flex-col p-4 border border-green-200 bg-green-50 rounded-xl gap-4 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-green-100 shadow-sm shrink-0">
                <GoogleIcon />
              </div>
              <div>
                <div className="text-sm font-bold text-green-800 flex items-center gap-1">
                  {selectedCustomerName || "Account Connected"}
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs text-green-600">
                  ID: {selectedCustomerId}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  showAccountList ? setShowAccountList(false) : fetchAccounts()
                }
                disabled={loading}
                className="text-xs font-semibold text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                <RefreshCw
                  className={`w-3 h-3 ${
                    loading && !showDisconnectModal ? "animate-spin" : ""
                  }`}
                />
                {showAccountList ? "Cancel" : "Change"}
              </button>

              <button
                onClick={initiateDisconnect}
                disabled={loading}
                className="text-xs font-semibold text-red-600 hover:text-red-800 bg-white border border-red-100 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                {loading && !showAccountList ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3" />
                )}
                Disconnect
              </button>
            </div>
          </div>
          {showAccountList && renderAccountList()}
        </div>

        {showDisconnectModal && (
          <DisconnectModal
            activeCampaigns={activeCampaigns}
            isDisconnecting={loading}
            onConfirm={executeDisconnect}
            onCancel={() => {
              setShowDisconnectModal(false);
              setLoading(false);
            }}
          />
        )}
      </>
    );
  }

  // --- CASO 2: CONECTADO SIN CUENTA ---
  if (isConnected && !selectedCustomerId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200 text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900">
              Action Required
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              Authorization granted, but no Ad Account selected.
            </p>
          </div>
          <button
            onClick={initiateDisconnect}
            className="text-amber-700 hover:text-red-600 p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        {!showAccountList ? (
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="w-full h-10 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Select Ad Account"
            )}
          </button>
        ) : (
          renderAccountList()
        )}
      </div>
    );
  }

  // --- CASO 1: DESCONECTADO ---
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
          <GoogleIcon />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-gray-900">
            Connect Google Ads
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Grant permission to create and manage Search campaigns directly from
            Sweet AI.
          </p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="mt-3 h-9 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2 shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Connect Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
