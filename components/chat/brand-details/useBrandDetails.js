"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/useContext";

const DRAFT_KEY = "sweet:brandDraft";

export function useBrandDetails() {
  const router = useRouter();
  const { token } = useAuth();
  const { companyData, updateCompanyState, loading } = useCompany();

  // ✅ CORRECCIÓN 1: Inicializar con los nombres correctos de la BD
  const [formData, setFormData] = useState({
    brandName: "",
    aka: "",
    industry: "",
    targetAudience: "",
    website: "",
    mission: "",
    vision: "",

    // Section Goals
    primaryGoal: "",
    successMetric: "", // Agregado
    timeframe: "", // Agregado
    supportingGoals: [], // Renombrado de 'goals' a 'supportingGoals'

    // Lists
    services: [],
    differentiators: [],
    values: [],
    colors: [],
  });

  const [toast, setToast] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // =========================================================
  // 🔍 HYDRATION (Carga de Datos)
  // =========================================================
  useEffect(() => {
    if (!companyData) return;

    // 1. Normalización de datos (DB -> Form)
    // A veces viene en data, a veces directo en el objeto
    const validData =
      companyData.data || companyData.companyData || companyData;

    const dbData = {
      brandName: validData.name || validData.brandName || "",
      aka: validData.aka || "",
      industry: validData.industry || "",
      targetAudience: validData.targetAudience || "",
      website: validData.website || "",
      mission: validData.mission || "",
      vision: validData.vision || "",

      // ✅ CORRECCIÓN 2: Mapear los campos de Goals correctamente
      primaryGoal: validData.primaryGoal || "",
      successMetric: validData.successMetric || "",
      timeframe: validData.timeframe || "",
      supportingGoals: Array.isArray(validData.supportingGoals)
        ? validData.supportingGoals
        : [],

      services: Array.isArray(validData.services) ? validData.services : [],
      differentiators: Array.isArray(validData.differentiators)
        ? validData.differentiators
        : [],
      values: Array.isArray(validData.values) ? validData.values : [], // A veces es brandVoice
      colors: Array.isArray(validData.colors) ? validData.colors : [],
    };

    // 2. Prioridad: Si hay un borrador local con nombre, úsalo. Si no, usa la DB.
    let finalData = dbData;
    try {
      const localDraftRaw = localStorage.getItem(DRAFT_KEY);
      if (localDraftRaw) {
        const localDraft = JSON.parse(localDraftRaw);
        if (localDraft.brandName && localDraft.brandName.trim() !== "") {
          // Fusionamos el draft local con la estructura base para asegurar que existan los campos nuevos
          finalData = { ...dbData, ...localDraft };
        }
      }
    } catch (e) {
      console.error(e);
    }

    setFormData(finalData);
  }, [companyData]);

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Autosave local por seguridad
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      return next;
    });
  };

  // ❌ CANCELAR
  function handleCancel() {
    router.push("/chat");
  }

  // ✅ GUARDAR Y CONTINUAR
  async function handleSaveChanges() {
    setIsConfirming(true);
    setToast(null);

    try {
      // 1. Preparar Payload (Aseguramos nombres correctos para el Backend)
      const payload = {
        ...formData,
        name: formData.brandName, // Backend espera 'name' a veces
        supportingGoals: formData.supportingGoals, // Asegurar array correcto
        timeframe: formData.timeframe,
        successMetric: formData.successMetric,
        status: "Draft",
      };

      // 2. Fetch PUT a la DB
      // Usamos la variable de entorno para consistencia
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://backend-get-sweet-v2-0.onrender.com";

      const res = await fetch(`${apiUrl}/api/v1/company/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      const json = await res.json();
      const updatedData = json.data || json.companyData || payload;

      // 3. Actualizar Contexto
      updateCompanyState(updatedData);

      // 4. Limpiar basura local
      localStorage.removeItem(DRAFT_KEY);
      localStorage.setItem("sweet:brandLocked", "true");

      setToast({
        type: "success",
        message: "Saved! Continuing to Campaigns...",
      });

      // 5. Redirigir
      setTimeout(() => {
        setToast(null);
        router.push("/chat/campaign"); // O a donde corresponda en tu flujo
      }, 1000);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error saving changes." });
    } finally {
      setIsConfirming(false);
    }
  }

  return {
    formData,
    handleChange,
    handleCancel,
    handleSaveChanges,
    isConfirming,
    toast,
    loading: loading && !formData.brandName,
  };
}
