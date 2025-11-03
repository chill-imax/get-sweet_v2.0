"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, GraduationCap, Building2, Megaphone, ShoppingCart, Briefcase } from "lucide-react";



const useCases = [
  {
    icon: Briefcase,
    title: "Sales Teams",
    description: "Automate lead qualification, follow-ups, and pipeline management to close deals faster.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Streamline inventory management, customer support, and order processing automatically.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Create, schedule, and optimize campaigns with AI-powered insights and automation.",
  },
  {
    icon: Building2,
    title: "Operations",
    description: "Optimize workflows, manage resources, and reduce operational costs with smart automation.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Enhance learning experiences with personalized content and automated administrative tasks.",
  },
  {
    icon: HeartIcon,
    title: "Healthcare",
    description: "Improve patient care with intelligent scheduling, documentation, and data management.",
  },
];


// --- Framer Motion Variants ---

// Variante para el contenedor de las tarjetas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Retraso de 0.1s entre la animación de cada tarjeta
    },
  },
};

// Variante para cada tarjeta individual
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// Componente para el ícono con gradiente
const GradientIcon = ({ Icon }) => (

  <div className="relative p-3 rounded-xl shadow-lg bg-white">
    {/* Fondo de gradiente simulando el marco del ícono */}
    <div className="absolute inset-0 rounded-xl opacity-90"
         style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' }}>
    </div>

    <Icon className="relative z-10 w-6 h-6 text-white" />
  </div>
);


const UseCasesSection = () => {
  return (
    <section id='use-cases' className="py-24 bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className=" mx-auto px-6 text-center max-w-7xl">

        {/* Título y Subtítulo */}
         <motion.h2
         className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
           Built for Every Team
        </motion.h2>
        <motion.p
            className="text-xl text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
         No matter your industry, Sweet AI adapts to your unique needs
        </motion.p>

{/* Grid de Características */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  variants={containerVariants}
  initial="hidden"
  // La animación se dispara al entrar en la vista
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  {useCases.map((feature, index) => (
    <motion.div
      key={index}
      variants={cardVariants}
      className="p-8 mt-10 rounded-2xl border-2 bg-white transition-all duration-300 hover:shadow-lg hover:border-purple-200 group" 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Ícono con Gradiente */}
      <div 
        className="w-12 h-12 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 flex mb-4 group-hover:scale-110 transition-transform duration-300 ease-in-out"
      >
        <GradientIcon Icon={feature.icon} />
      </div>

      <h3 className="flex mb-2 justify-items-start text-gray-900">{feature.title}</h3>
      <p className="flex text-start justify-items-start text-gray-500">{feature.description}</p>
    </motion.div>
  ))}
</motion.div>

      </div>
    </section>
  );
};

export default UseCasesSection;
