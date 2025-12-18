"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // ✅ Importamos Image
import { useAuth } from "@/context/useContext";
import { useCompany } from "@/context/CompanyContext";
import {
  Save,
  User,
  Briefcase,
  Mail,
  Factory,
  Loader2,
  ChevronDown,
  Phone as PhoneIcon,
} from "lucide-react";
import { INDUSTRIES } from "@/components/utils/industries";
import { COUNTRIES } from "@/components/utils/countries";

export default function SettingsForm() {
  const { user, token } = useAuth();
  const {
    companyData,
    updateCompanyState,
    loading: loadingCompany,
  } = useCompany();

  // Estados para el teléfono desglosado. Default USA (+1)
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    industry: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ✅ Encontrar el país seleccionado usando el dial_code
  const selectedCountry = COUNTRIES.find((c) => c.dial_code === phoneCode);

  // =========================================================
  // 1. CARGA DE DATOS (HYDRATION)
  // =========================================================
  useEffect(() => {
    if (user && companyData) {
      let code = "+1";
      let number = "";
      const rawPhone = companyData.phone || "";

      // Lógica de separación de teléfono
      if (rawPhone.includes(" ")) {
        const parts = rawPhone.split(" ");
        code = parts[0];
        number = parts.slice(1).join(" ");
      } else if (rawPhone) {
        // Intento de búsqueda si no hay espacios
        const countryMatch = COUNTRIES.find((c) =>
          rawPhone.startsWith(c.dial_code)
        );
        if (countryMatch) {
          code = countryMatch.dial_code;
          number = rawPhone.replace(countryMatch.dial_code, "");
        } else {
          number = rawPhone;
        }
      }

      setPhoneCode(code);
      setPhoneNumber(number);

      const cleanData = {
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        businessName: companyData.businessName || companyData.name || "",
        industry: companyData.industry || "",
      };

      setFormData(cleanData);
      setInitialData({ ...cleanData, phone: rawPhone });
    }
  }, [user, companyData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  // =========================================================
  // 2. GUARDADO (SAVE)
  // =========================================================
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const promises = [];
      const fullPhone = `${phoneCode} ${phoneNumber}`.trim();

      // A. Usuario
      if (formData.fullName !== initialData.fullName) {
        const userPromise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ fullName: formData.fullName }),
          }
        );
        promises.push(userPromise);
      }

      // B. Empresa
      const companyChanged =
        formData.businessName !== initialData.businessName ||
        formData.industry !== initialData.industry ||
        fullPhone !== initialData.phone;

      if (companyChanged) {
        const companyPayload = {
          businessName: formData.businessName,
          industry: formData.industry,
          phone: fullPhone,
        };

        const companyPromise = fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(companyPayload),
          }
        ).then(async (res) => {
          if (res.ok) {
            const json = await res.json();
            const updated = { ...companyData, ...companyPayload };
            updateCompanyState(updated);
          }
          return res;
        });

        promises.push(companyPromise);
      }

      await Promise.all(promises);

      setInitialData({ ...formData, phone: fullPhone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const currentFullPhone = `${phoneCode} ${phoneNumber}`.trim();
  const hasChanges =
    JSON.stringify(formData) !==
      JSON.stringify({ ...initialData, phone: undefined }) ||
    currentFullPhone !== initialData?.phone;

  if (!user || loadingCompany) {
    return (
      <div className="animate-pulse text-gray-400 text-sm p-6 flex gap-2 items-center">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6 text-purple-800">
      {/* USER PROFILE */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          User Profile
        </h3>
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
            placeholder="John Doe"
          />
        </Field>
        <Field label="Email" icon={<Mail className="w-4 h-4 text-gray-400" />}>
          <input
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="input-modern bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </Field>
      </div>

      <hr className="border-gray-100" />

      {/* COMPANY DETAILS */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Company Details
        </h3>

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
            placeholder="Acme Inc."
          />
        </Field>

        <Field
          label="Industry"
          icon={<Factory className="w-4 h-4 text-gray-400" />}
        >
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="input-modern bg-white cursor-pointer"
          >
            <option value="" disabled>
              Select an industry
            </option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </Field>

        {/* ---------------- PHONE SECTION (CORREGIDO) ---------------- */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Contact Phone
          </label>
          <div className="flex gap-2 h-10">
            {/* 1. Selector de País (Izquierda - 35%) */}
            <div className="relative w-[35%] h-full group">
              {/* ✅ A. Bandera Absoluta (Se muestra SOLO si hay un país seleccionado válido) */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
                {selectedCountry && selectedCountry.image ? (
                  <Image
                    src={selectedCountry.image}
                    alt={selectedCountry.name}
                    width={24} // Ajusta según el tamaño de tus iconos
                    height={16}
                    className="w-6 h-4 object-cover rounded-sm shadow-sm"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">🌐</span>
                )}
              </div>

              {/* ✅ B. Select Real (Transparente para que se vea la bandera, pero con texto visible al abrir) */}
              <select
                value={phoneCode}
                onChange={(e) => {
                  setPhoneCode(e.target.value);
                  setSaved(false);
                }}
                className="w-full h-full border border-gray-300 rounded-xl py-2 pl-11 pr-6 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none cursor-pointer text-gray-800 font-medium"
              >
                {COUNTRIES.map((c, index) => (
                  // Usamos index en la key por seguridad si hay códigos repetidos
                  <option key={`${c.code}-${index}`} value={c.dial_code}>
                    {c.name} ({c.dial_code})
                  </option>
                ))}
              </select>

              {/* ✅ C. Flechita Custom */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors">
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            {/* 2. Input Numérico (Derecha - Resto) */}
            <div className="relative flex-1 h-full group">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  // Solo permitir números y espacios
                  const val = e.target.value.replace(/[^\d\s]/g, "");
                  setPhoneNumber(val);
                  setSaved(false);
                }}
                placeholder="412 123 4567"
                className="w-full h-full border border-gray-300 rounded-xl py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>
        </div>
        {/* ---------------- END PHONE SECTION ---------------- */}
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className={`w-full flex items-center justify-center gap-2 font-medium text-sm py-2.5 rounded-lg transition-all mt-6
          ${
            !hasChanges
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 shadow-md"
          }
        `}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? "Saving..." : "Save changes"}
      </button>

      {saved && (
        <p className="text-green-600 text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-1">
          ✔ Your data has been updated
        </p>
      )}
    </div>
  );
}

// Wrapper simple
function Field({ label, icon, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative flex items-center group">
        {icon && (
          <span className="absolute left-3 group-focus-within:text-purple-500 transition-colors pointer-events-none z-10">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
