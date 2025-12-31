"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import InfoCardContact from "./InfoCardContact.jsx";
import { useAuth } from "@/context/useContext";
import { useRouter } from "next/navigation";
import api from "@/app/api/auth/axios"; // ✅ Instancia centralizada

// --- Componente de Input del Formulario ---
const FormInput = ({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  className = "",
  defaultValue = "",
  disabled = false,
}) => {
  const handleFocus = () => {
    if (disabled) alert("Please login or register first!");
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-base font-semibold text-gray-900 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        onFocus={handleFocus}
        className={`w-full px-4 py-3 border placeholder-gray-400 text-gray-700 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        required={required}
      />
    </div>
  );
};

// --- Componente Principal de la Sección de Contacto ---
export function ContactUsSection() {
  const { user, isAuthenticated } = useAuth(); // ❌ Token eliminado
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    const name = e.target.name.value;
    const email = e.target.email.value;
    const company = e.target.company.value;
    const message = e.target.message.value;

    // ✅ CORRECCIÓN: leght -> length
    if (message.length > 200) {
      alert("Message cannot exceed 200 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Axios POST
      await api.post("/api/v1/contact", {
        name,
        email,
        company,
        message,
      });

      alert("✅ Message sent successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to send message";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-us" className="py-20 md:py-32 bg-purple-50">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Títulos */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Contenedor de Formulario y Tarjetas de Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Formulario de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 p-8 md:p-12 bg-white rounded-3xl shadow-xl border border-gray-100 h-full"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="name"
                  label="Name"
                  placeholder="John Doe"
                  defaultValue={user?.name || ""}
                  disabled={!isAuthenticated}
                  required
                />
                <FormInput
                  id="email"
                  label="Email"
                  placeholder="john@company.com"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled={!isAuthenticated}
                  required
                />
              </div>
              <FormInput
                id="company"
                label="Company"
                placeholder="Get Sweet AI"
                disabled={!isAuthenticated}
              />
              <div>
                <label
                  htmlFor="message"
                  className="block text-base font-semibold text-gray-800 mb-2"
                >
                  Message <span className="text-red-500">*</span>{" "}
                  <span className="text-gray-500 font-normal">
                    (max 200 characters)
                  </span>
                </label>
                <textarea
                  id="message"
                  rows="7"
                  placeholder="Type your message here..."
                  disabled={!isAuthenticated}
                  onFocus={() =>
                    !isAuthenticated && alert("First you must login")
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-400 text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                onClick={() => !isAuthenticated && router.push("/sign-in")}
                className={`w-full px-8 py-3 rounded-xl font-semibold text-white ${
                  isSubmitting
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-500 to-pink-500 hover:brightness-90"
                } shadow-md transition-all duration-300`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {!isAuthenticated
                  ? "Login to send"
                  : isSubmitting
                  ? "Sending..."
                  : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Info Cards */}
          <div className="lg:col-span-1 h-full flex flex-col justify-between ">
            <InfoCardContact />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUsSection;
