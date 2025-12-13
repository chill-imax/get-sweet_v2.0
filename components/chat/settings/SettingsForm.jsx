"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/useContext";
import { Save, User, Phone, Briefcase, Mail, Factory } from "lucide-react"; // Usamos Factory para industria

export default function SettingsForm() {
  const { user, token } = useAuth();

  // Estado para los datos del formulario (lo que el usuario edita)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    industry: "",
    phone: "",
  });

  // Estado para los datos originales (para comparar cambios)
  const [initialData, setInitialData] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✔ Fetch completo de usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      console.log("🟡 TOKEN EN SETTINGS:", token);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        const cleanData = {
          fullName: data.fullName || "",
          email: data.email || "",
          businessName: data.businessName || "",
          industry: data.industry || "",
          phone: data.phone || "",
        };

        setFormData(cleanData);
        setInitialData(cleanData); // Guardamos la copia original
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false); // Si escribe, quitamos el mensaje de "Guardado"
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setInitialData(formData); // Actualizamos la referencia original al nuevo guardado
      setSaved(true);
    } catch (err) {
      console.error("Error saving user:", err);
    }

    setSaving(false);
  };

  // Detectar si hay cambios comparando el objeto actual con el inicial
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  if (loadingUser) {
    return (
      <div className="animate-pulse text-gray-400 text-sm p-6">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6 text-purple-800">
      {/* FULL NAME */}
      <Field
        label="Full name"
        icon={<User className="w-4 h-4 text-gray-400" />}
      >
        <input
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          className="input-modern"
        />
      </Field>

      {/* EMAIL */}
      <Field label="Email" icon={<Mail className="w-4 h-4 text-gray-400" />}>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="input-modern"
          disabled // Generalmente el email no se edita tan fácil, pero lo dejo a tu elección
        />
      </Field>

      {/* BUSINESS NAME */}
      <Field
        label="Business name"
        icon={<Briefcase className="w-4 h-4 text-gray-400" />}
      >
        <input
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleChange}
          className="input-modern"
        />
      </Field>

      {/* INDUSTRY (Icono actualizado a Factory) */}
      <Field
        label="Industry"
        icon={<Factory className="w-4 h-4 text-gray-400" />}
      >
        <input
          name="industry"
          type="text"
          value={formData.industry}
          onChange={handleChange}
          className="input-modern"
        />
      </Field>

      {/* PHONE */}
      <Field label="Phone" icon={<Phone className="w-4 h-4 text-gray-400" />}>
        <input
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          className="input-modern"
        />
      </Field>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={saving || !hasChanges} // Se deshabilita si guarda O si no hay cambios
        className={`w-full flex items-center justify-center gap-2 font-medium text-sm py-2.5 rounded-lg transition-all mt-4
          ${
            !hasChanges
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Estilo deshabilitado
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-md" // Estilo activo
          }
        `}
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save changes"}
      </button>

      {saved && (
        <p className="text-green-600 text-sm font-medium text-center animate-fade-in">
          ✔ Your data has been updated
        </p>
      )}
    </div>
  );
}

/* -------------------------- SUBCOMPONENT: FIELD WRAPPER --------------------------- */
function Field({ label, icon, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <div className="relative flex items-center">
        {icon && <span className="absolute left-3">{icon}</span>}
        {children}
      </div>
    </div>
  );
}
