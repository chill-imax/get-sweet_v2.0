"use client";
import React from 'react';
import { Mail, Phone, MapPin, MessageCircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Componente de Tarjeta de Información de Contacto ---
const InfoCard = ({ icon: Icon, title, content, link, linkText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-white shadow-lg flex items-start space-x-4 border border-gray-100 py-10 mb-4 lg:mb-0 "
    >
   
      <div className="p-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Contenido */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-2">{content}</p>
        {link && (
          <a href={link} className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
            {linkText}
          </a>
        )}
      </div>
    </motion.div>
  );
};

// --- Componente de Input del Formulario ---
const FormInput = ({ id, label, placeholder, type = 'text',required = false, className = '' }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-base font-semibold text-gray-900 mb-2">
      {label} 
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
    />
  </div>
);

// --- Componente Principal de la Sección de Contacto ---
export function ContactUsSection() {
  
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
        <form className="space-y-6">
            
            {/* Inputs de nombre y correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="name" label="Name" placeholder="John Doe" required className='text-gray-800'/>
            <FormInput id="email" label="Email" placeholder="john@company.com" type="email" required className='text-gray-800'/>
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
                rows="5"
                required
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-600 text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            ></textarea>
            </div>

            {/* Botón */}
            <motion.button
            type="submit"
            className="w-full px-8 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-500 to-pink-500 shadow-md hover:brightness-90 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            >
            Send Message
            </motion.button>
        </form>
        </motion.div>


          {/* Columna 2: Información de Contacto (Tarjetas) */}
            <div 
            className="lg:col-span-1 h-full flex flex-col justify-between "
            >
            {infoData.map((data, index) => (
                <InfoCard 
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