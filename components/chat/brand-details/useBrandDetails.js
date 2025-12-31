"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";
import api from "@/app/api/auth/axios"; // ✅ Instancia centralizada

export function useBrandDetails() {
  const router = useRouter();
  // ❌ const { token } = useAuth(); // Ya no es necesario
  const { companyData, updateCompanyState, loading } = useCompany();

  // 1. Estado Inicial (Limpio y Seguro)
  const [formData, setFormData] = useState({
    brandName: "",
    aka: "",
    industry: "",
    targetAudience: "",
    website: "",
    mission: "",
    vision: "",

    // Goals Section
    primaryGoal: "",
    successMetric: "",
    timeframe: "",
    supportingGoals: [], // Array vacío por defecto

    // Lists
    services: [],
    differentiators: [],
    values: [],
    colors: [],
  });

  const [toast, setToast] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // =========================================================
  // 🔍 HYDRATION: CARGAR DATOS DE LA DB
  // =========================================================
  useEffect(() => {
    if (!companyData) return;

    // A. Normalizar la fuente de datos
    const source = companyData.data || companyData.companyData || companyData;

    // B. Extraer el array de supportingGoals con seguridad
    const safeSupportingGoals = Array.isArray(source.supportingGoals)
      ? source.supportingGoals
      : [];

    // C. Actualizar el Formulario
    setFormData({
      brandName: source.name || source.brandName || source.businessName || "",
      aka: source.aka || "",
      industry: source.industry || "",
      targetAudience: source.targetAudience || "",
      website: source.website || "",
      mission: source.mission || "",
      vision: source.vision || "",

      // Goals
      primaryGoal: source.primaryGoal || "",
      successMetric: source.successMetric || "",
      timeframe: source.timeframe || "",
      supportingGoals: safeSupportingGoals,

      // Lists
      services: Array.isArray(source.services) ? source.services : [],
      differentiators: Array.isArray(source.differentiators)
        ? source.differentiators
        : [],
      values: Array.isArray(source.values) ? source.values : [],
      colors: Array.isArray(source.colors) ? source.colors : [],
    });

    // D. Limpieza: Borrar cualquier borrador viejo del navegador
    if (typeof window !== "undefined") {
      localStorage.removeItem("sweet:brandDraft");
    }
  }, [companyData]);

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    router.push("/chat");
  };

  const handleSaveChanges = async () => {
    setIsConfirming(true);
    setToast(null);

    try {
      // 1. Preparar Payload
      const payload = {
        ...formData,
        name: formData.brandName,
        businessName: formData.brandName,
        // Asegurar que supportingGoals se envíe como Array
        supportingGoals: Array.isArray(formData.supportingGoals)
          ? formData.supportingGoals
          : [],
        status: "Draft",
      };

      // ✅ Axios PUT
      const res = await api.put("/api/v1/company/profile", payload);
      const json = res.data;

      const updatedData = json.data || json.companyData || payload;

      // 2. Actualizar el Contexto Global de la App
      updateCompanyState(updatedData);

      // 3. Bloquear edición y redireccionar
      if (typeof window !== "undefined") {
        localStorage.setItem("sweet:brandLocked", "true");
      }

      setToast({
        type: "success",
        message: "Brand updated successfully!",
      });

      setTimeout(() => {
        setToast(null);
        router.push("/chat/brand-ai");
      }, 1000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error saving changes.";
      setToast({ type: "error", message: errorMsg });
    } finally {
      setIsConfirming(false);
    }
  };

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
