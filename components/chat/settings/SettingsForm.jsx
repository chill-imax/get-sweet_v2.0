"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/useContext";
import { useCompany } from "@/context/CompanyContext";
import api from "@/app/api/auth/axios"; // ✅ Instancia centralizada
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
  const { user } = useAuth(); // Token eliminado, el interceptor se encarga
  const {
    companyData,
    updateCompanyState,
    loading: loadingCompany,
  } = useCompany();

  // Estados para el teléfono. Default USA (+1)
  const [countryISO, setCountryISO] = useState("US");
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

  // Helper para encontrar bandera
  const selectedCountry = COUNTRIES.find((c) => c.code === countryISO);

  // =========================================================
  // 1. CARGA DE DATOS (DIRECTA DEL CONTEXTO)
  // =========================================================
  useEffect(() => {
    if (user && companyData) {
      const loadedISO = companyData.countryCode || "US";

      const countryData = COUNTRIES.find((c) => c.code === loadedISO);
      const dialCode = countryData ? countryData.dial_code : "+1";
      let rawPhone = companyData.phone || "";

      // Lógica de separación de teléfono
      if (rawPhone.startsWith(dialCode)) {
        rawPhone = rawPhone.replace(dialCode, "").trim();
      }

      setCountryISO(loadedISO);
      setPhoneNumber(rawPhone);

      const cleanData = {
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        businessName: companyData.businessName || companyData.name || "",
        industry: companyData.industry || "",
      };

      setFormData(cleanData);
      setInitialData({
        ...cleanData,
        phone: companyData.phone,
        countryCode: loadedISO,
      });
    }
  }, [user, companyData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  // =========================================================
  // 2. GUARDADO (SAVE) CON AXIOS
  // =========================================================
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const currentDialCode =
        COUNTRIES.find((c) => c.code === countryISO)?.dial_code || "+1";
      const fullPhone = `${currentDialCode} ${phoneNumber}`.trim();
      const isoCodeToSend = countryISO;

      const promises = [];

      // A. Usuario (Solo si cambió)
      if (formData.fullName !== initialData.fullName) {
        // ✅ Axios PUT
        promises.push(
          api.put("/api/v1/user/profile", { fullName: formData.fullName })
        );
      }

      // B. Empresa (Solo si cambió)
      const companyChanged =
        formData.businessName !== initialData.businessName ||
        formData.industry !== initialData.industry ||
        fullPhone !== initialData.phone ||
        isoCodeToSend !== initialData.countryCode;

      if (companyChanged) {
        const companyPayload = {
          businessName: formData.businessName,
          industry: formData.industry,
          phone: fullPhone,
          countryCode: isoCodeToSend,
        };

        // ✅ Axios PUT con actualización optimista del contexto
        const companyPromise = api
          .put("/api/v1/company/profile", companyPayload)
          .then((res) => {
            // Actualizamos el contexto global de la empresa
            const updated = { ...companyData, ...companyPayload };
            updateCompanyState(updated);
            return res;
          });

        promises.push(companyPromise);
      }

      // Esperar a que todo termine
      await Promise.all(promises);

      // Actualizar estado inicial para futuras comparaciones
      setInitialData({
        ...formData,
        phone: fullPhone,
        countryCode: isoCodeToSend,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      // Opcional: Manejar error visualmente aquí (toast)
    } finally {
      setSaving(false);
    }
  };

  // Lógica de "Has Changes" para deshabilitar el botón
  const currentDial =
    COUNTRIES.find((c) => c.code === countryISO)?.dial_code || "";
  const currentFullPhone = `${currentDial} ${phoneNumber}`.trim();

  const hasChanges =
    JSON.stringify(formData) !==
      JSON.stringify({
        ...initialData,
        phone: undefined,
        countryCode: undefined,
      }) ||
    currentFullPhone !== (initialData?.phone || "") ||
    countryISO !== (initialData?.countryCode || "US");

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
            className="w-full h-11 border border-gray-200 rounded-xl py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            placeholder="John Doe"
          />
        </Field>
        <Field label="Email" icon={<Mail className="w-4 h-4 text-gray-400" />}>
          <input
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="w-full h-11 border border-gray-200 rounded-xl py-2 pl-10 pr-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
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
            className="w-full h-11 border border-gray-200 rounded-xl py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none transition-all"
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
            className="w-full h-11 border border-gray-200 rounded-xl py-2 pl-10 pr-3 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-purple-200 outline-none"
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

        {/* ---------------- PHONE SECTION ---------------- */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Contact Phone
          </label>
          <div className="flex gap-2 h-10">
            <div className="relative w-[35%] h-full group">
              {/* Bandera Absoluta */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
                {selectedCountry && selectedCountry.image ? (
                  <Image
                    src={selectedCountry.image}
                    alt={selectedCountry.name}
                    width={24}
                    height={16}
                    className="w-6 h-4 object-cover rounded-sm shadow-sm"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">🌐</span>
                )}
              </div>

              <select
                value={countryISO}
                onChange={(e) => {
                  setCountryISO(e.target.value);
                  setSaved(false);
                }}
                className="w-full h-full border border-gray-300 rounded-xl py-2 pl-11 pr-6 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none cursor-pointer text-gray-800 font-medium"
              >
                {COUNTRIES.map((c, index) => (
                  <option key={`${c.code}-${index}`} value={c.code}>
                    {c.name} ({c.dial_code})
                  </option>
                ))}
              </select>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors">
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>

            {/* Input Numérico */}
            <div className="relative flex-1 h-full group">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d\s]/g, "");
                  setPhoneNumber(val);
                  setSaved(false);
                }}
                placeholder="555 123 4567"
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
