"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useContext";
import {
  Briefcase,
  Layers,
  Smartphone,
  Loader2,
  ChevronDown,
} from "lucide-react";
import logo from "../../public/icons/logogetsweet.png";
import { INDUSTRIES } from "@/components/utils/industries";
import { COUNTRIES } from "@/components/utils/countries";

export default function Onboarding() {
  const router = useRouter();
  const { user, updateOnboarding, loading } = useAuth();

  // Estado del formulario
  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    phoneNumber: "",
    countryCode: "+1", // Default USA
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Buscar el objeto del país seleccionado para mostrar su Imagen (Bandera)
  const selectedCountry = COUNTRIES.find(
    (c) => c.dial_code === form.countryCode
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <section className="flex flex-col justify-center items-center min-h-screen p-4">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
        <p className="mt-3 text-lg text-purple-600">Syncing with Google...</p>
      </section>
    );
  }

  if (!user) return null;

  // Manejador genérico
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejador específico para el teléfono (solo números)
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d\s]/g, ""); // Solo dígitos y espacios
    setForm({ ...form, phoneNumber: val });
  };

  const submitOnboarding = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Combinar Código + Número
    const fullPhone = `${form.countryCode} ${form.phoneNumber}`.trim();

    const payload = {
      businessName: form.businessName,
      industry: form.industry,
      phone: fullPhone,
    };

    try {
      await updateOnboarding(payload);

      setMessage({
        type: "success",
        text: "Profile completed! Redirecting...",
      });

      setTimeout(() => router.push("chat"), 1500);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Connection error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen p-4 bg-linear-to-b from-white via-purple-50 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-white/95 backdrop-blur-sm shadow-lg border border-purple-100 rounded-2xl p-6 md:p-10 w-full max-w-md text-center"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src={logo}
            width={48}
            height={48}
            alt="SweetAI Logo"
            className="mb-3 w-12 h-12 object-contain"
          />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Almost Ready! ✨
          </h2>
          <p className="text-sm text-purple-600 font-medium">
            Step 2 of 2: Tell us about your business
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-purple-100 rounded-full mb-6">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: "50%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </div>

        <form onSubmit={submitOnboarding} className="space-y-4 text-left">
          {/* Business Name */}
          <div className="relative">
            <label className="text-sm text-gray-700 font-semibold block mb-1">
              Business Name
            </label>
            <Briefcase className="absolute left-3 top-9 h-5 w-5 text-purple-400" />
            <input
              name="businessName"
              type="text"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Ex: Sweet Digital Solutions"
              className="text-gray-800 w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />
          </div>

          {/* Industry Select */}
          <div className="relative">
            <label className="text-sm text-gray-700 font-semibold block mb-1">
              Industry
            </label>
            <Layers className="absolute left-3 top-9 h-5 w-5 text-purple-400 z-10" />
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="text-gray-800 w-full border appearance-none border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition cursor-pointer"
              required
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
            <div className="absolute right-3 top-9 pointer-events-none text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          {/* PHONE SECTION (Mejorado con Imagen y Layout 35/65) */}
          <div>
            <label className="text-sm text-gray-700 font-semibold block mb-1">
              Contact Phone
            </label>
            <div className="flex gap-2 h-10.5">
              {" "}
              {/* 1. Selector de País */}
              <div className="relative w-[50%] h-full group">
                {/* Imagen de Bandera (Visible siempre) */}
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
                    <span className="text-lg leading-none">🌐</span>
                  )}
                </div>

                {/* Select Real */}
                <select
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleChange}
                  className="w-full h-full border border-gray-300 rounded-xl py-2 pl-11 pr-6 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none cursor-pointer text-gray-800 font-medium"
                >
                  {COUNTRIES.map((c, index) => (
                    <option key={`${c.code}-${index}`} value={c.dial_code}>
                      {c.name} ({c.dial_code})
                    </option>
                  ))}
                </select>

                {/* Flecha */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors">
                  <ChevronDown className="h-3 w-3" />
                </div>
              </div>
              {/* 2. Input Numérico */}
              <div className="relative flex-1 h-full group">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  name="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="123 456 7890"
                  className="w-full h-full text-gray-800 border border-gray-300 rounded-xl py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`text-sm py-2 px-3 rounded-lg ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </motion.p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-xl shadow font-bold text-white transition transform mt-6 ${
              isSubmitting
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Finish & Access Sweet AI"
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
