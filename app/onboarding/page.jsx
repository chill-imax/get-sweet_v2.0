"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useContext";
import { Briefcase, Layers, Smartphone, Loader2 } from "lucide-react";
import logo from "../../public/icons/logogetsweet.png";

const industries = [
  "Restaurants",
  "E-commerce",
  "Consulting",
  "Software Development",
  "Digital Marketing",
  "Health & Wellness",
  "Education",
  "Real Estate",
  "Financial Services",
  "Transportation / Logistics",
  "Tourism & Hospitality",
];

export default function Onboarding() {
  const router = useRouter();

  const { user, updateOnboarding, loading } = useAuth();

  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Redirección si no hay usuario (pero esperamos a que termine de cargar)
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

  // Si no hay usuario, retornamos null mientras el useEffect redirige
  if (!user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitOnboarding = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ CAMBIO CLAVE:
      // En lugar de hacer fetch manual y buscar el token en localStorage (que fallaba),
      // llamamos a la función del Contexto. Ella ya tiene el token de Google.
      await updateOnboarding(form);

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
              id="businessName"
              name="businessName"
              type="text"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Ex: Sweet Digital Solutions"
              className="text-gray-800 w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />
          </div>

          {/* Industry */}
          <div className="relative">
            <label className="text-sm text-gray-700 font-semibold block mb-1">
              Industry / Niche
            </label>
            <Layers className="absolute left-3 top-9 h-5 w-5 text-purple-400" />
            <select
              id="industry"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="text-gray-800 w-full border appearance-none border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            >
              <option value="" disabled>
                Select an industry
              </option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="text-sm text-gray-700 font-semibold block mb-1">
              Contact Phone
            </label>
            <Smartphone className="absolute left-3 top-9 h-5 w-5 text-purple-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 123 456 7890"
              className="text-gray-800 w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />
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
            className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-xl shadow font-bold text-white transition transform ${
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
