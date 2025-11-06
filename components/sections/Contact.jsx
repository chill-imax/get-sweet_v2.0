"use client";
import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';
import InfoCardContact from './InfoCardContact.jsx';
import { useAuth } from '@/context/useContext';
import { useRouter } from 'next/navigation.js'; 


// --- Componente de Input del Formulario ---
const FormInput = ({ id, label, placeholder, type = 'text',required = false, className = "", defaultValue= "" }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-base font-semibold text-gray-900 mb-2">
      {label} 
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
    />
  </div>
);

// --- Componente Principal de la Sección de Contacto ---
export function ContactUsSection() {
  const { token, user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push("/sign-in");
  }
}, [loading, isAuthenticated, router]);
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAuthenticated || !token) {
    alert("Please login or register first!");
    router.push("/sign-in");
    return;
  }

  const name = e.target.name.value;
  const email = e.target.email.value;
  const company = e.target.company.value;
  const message = e.target.message.value;

  if (message.leght > 200) {
    alert("Message cannot exceed 200 characters.");
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch(
      "https://backend-get-sweet-v2-0.onrender.com/api/v1/contact", 
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, company, message }),
    });

    if (!res.ok) throw new Error("Error sending message");

    alert("✅ Message sent successfully!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Failed to send message");
  }finally{
    setIsSubmitting(false);
  }
};

  
  // Datos de las tarjetas de información
  const infoData = [
    {
      icon: Mail,
      title: "Email Us",
      content: "Our team is here to help",
      link: "mailto:nathan@getsweet.ai",
      linkText: "nathan@getsweet.ai",
    },

    {
      icon: MessageCircleDashed,
      title: "Live Chat",
      content: "Chat with our support team",
      link: "Start a conversation",
      linkText: "Start a conversation",
    },
    {
      icon: Phone,
      title: "Schedule a Call",
      content: "Mon-Fri from 9am to 5pm EST",
      link: "tel:+14152128702",
      linkText: "+1 (415) 212-8702",
    },
  ];

  return (
    <section id='contact-us' className="py-20 md:py-32 bg-purple-50">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        
        {/* Títulos */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Contenedor de Formulario y Tarjetas de Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          
        {/* Columna 1: Formulario de Contacto */}
        <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-2 p-8 md:p-12 bg-white rounded-3xl shadow-xl border border-gray-100 h-full"
        >
        <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Inputs de nombre y correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="name" label="Name" placeholder="John Doe" required className='text-gray-800' defaultValue={user?.name || ""} />
            <FormInput id="email" label="Email" placeholder="john@company.com" type="email" required className='text-gray-800' defaultValue={user?.email || ""}/>
            </div>

            {/* Empresa */}
            <FormInput id="company" label="Company" placeholder="Your Company Name" className='text-gray-800' />

            {/* Mensaje */}
            <div>
            <label htmlFor="message" className="block text-base font-semibold text-gray-800 mb-2">
                Message <span className="text-red-500">*</span> <span className="text-gray-500 font-normal"> (max 200 characters)</span>
            </label>
            <textarea
                id="message"
                rows="7"
                required
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-600 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            ></textarea>
            </div>

            {/* Botón */}
            <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-8 py-3 rounded-xl font-semibold text-white ${ isSubmitting ? "bg-purple-300 cursor-not-allowed" : "bg-linear-to-r from-purple-500 to-pink-500 hover:brightness-90" } shadow-md transition-all duration-300`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
            {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
        </form>
        </motion.div>


          {/* Columna 2: Información de Contacto (Tarjetas) */}
            <div 
            className="lg:col-span-1 h-full flex flex-col justify-between "
            >
            {infoData.map((data, index) => (
                <InfoCardContact 
                key={index} 
                {...data} 
                
                className="p-6 rounded-2xl bg-white shadow-lg flex items-start space-x-4 border border-gray-100 h-full
                "
                />
            ))}
            </div>

        </div>
      </div>
    </section>
  );
}

export default ContactUsSection;