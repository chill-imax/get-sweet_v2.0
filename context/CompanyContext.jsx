"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./useContext"; // Asegúrate que la ruta sea correcta a tu AuthContext

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const { user, token } = useAuth();

  // Estado inicial vacío pero con la estructura correcta para evitar errores de "undefined"
  const [companyData, setCompanyData] = useState({
    brandName: "",
    aka: "",
    industry: "",
    status: "Draft",
    mission: "",
    vision: "",
    values: [],
    services: [],
    differentiators: [],
    targetAudience: "",
    tone: "Professional",
    brandVoice: [],
    trustSignals: [],
    colors: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = "https://backend-get-sweet-v2-0.onrender.com";

  // 1. Función para cargar datos desde el Backend (GET)
  const fetchCompanyData = useCallback(async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/v1/company/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        // Si no existe perfil aún, no es un error crítico, solo iniciamos vacíos
        return;
      }

      if (!res.ok) throw new Error("Failed to load company profile");

      const data = await res.json();

      // Actualizamos el estado mezclando con los defaults para seguridad
      if (data) {
        setCompanyData((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("❌ Error loading company data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // 2. Cargar datos al inicio (cuando hay usuario)
  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  // 3. Función para actualizar el estado localmente (usada por Chat y Sidebar)
  const updateCompanyState = (newData) => {
    setCompanyData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <CompanyContext.Provider
      value={{
        companyData,
        updateCompanyState,
        refreshCompanyData: fetchCompanyData, // Por si quieres forzar recarga
        loading,
        error,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
