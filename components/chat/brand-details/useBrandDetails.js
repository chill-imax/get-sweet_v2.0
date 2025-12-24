"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/useContext";

export function useBrandDetails() {
  const router = useRouter();
  const { token } = useAuth();
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
    // A veces llega como { data: ... } o { companyData: ... } o plano.
    const source = companyData.data || companyData.companyData || companyData;

    // B. Extraer el array de supportingGoals con seguridad
    // Verificamos si existe y si es un array. Si no, devolvemos [].
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

      // Goals (Aquí es donde forzamos la lectura correcta)
      primaryGoal: source.primaryGoal || "",
      successMetric: source.successMetric || "",
      timeframe: source.timeframe || "",
      supportingGoals: safeSupportingGoals,

      // Lists
      services: Array.isArray(source.services) ? source.services : [],
      differentiators: Array.isArray(source.differentiators)
        ? source.differentiators
        : [],
      values: Array.isArray(source.values) ? source.values : [], // A veces viene como 'values' o 'brandVoice'
      colors: Array.isArray(source.colors) ? source.colors : [],
    });

    // D. Limpieza: Borrar cualquier borrador viejo del navegador para evitar conflictos
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
      // 1. Preparar Payload (Lo que enviamos al backend)
      const payload = {
        ...formData,
        name: formData.brandName,
        businessName: formData.brandName,

        // 🚨 IMPORTANTE: Asegurar que supportingGoals se envíe como Array
        supportingGoals: Array.isArray(formData.supportingGoals)
          ? formData.supportingGoals
          : [],

        status: "Draft",
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      setToast({ type: "error", message: "Error saving changes." });
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
