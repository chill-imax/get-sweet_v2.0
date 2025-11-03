"use client";
import React from 'react';
import { motion } from 'framer-motion';
// 1. IMPORTAMOS LOS ÍCONOS DE LUCIDE REACT
import { Users, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

// Definición de las estadísticas
const statsData = [
  {
    // 2. USAMOS EL COMPONENTE <Users /> de Lucide React
    icon: (
      <Users className="w-10 h-10 text-white" strokeWidth={1.5} />
    ),
    value: "10,000+",
    title: "Active Users",
    description: "Trust Sweet AI daily",
  },
  {
    // 2. USAMOS EL COMPONENTE <Clock /> de Lucide React
    icon: (
      <Clock className="w-10 h-10 text-white" strokeWidth={1.5} />
    ),
    value: "2M+",
    title: "Hours Saved",
    description: "Through automation",
  },
  {
    // 2. USAMOS EL COMPONENTE <TrendingUp /> de Lucide React
    icon: (
      <TrendingUp className="w-10 h-10 text-white" strokeWidth={1.5} />
    ),
    value: "300%",
    title: "Average ROI",
    description: "In the first year",
  },
  {
    // 2. USAMOS EL COMPONENTE <ShieldCheck /> de Lucide React para representar Uptime/Garantía
    icon: (
      <ShieldCheck className="w-10 h-10 text-white" strokeWidth={1.5} />
    ),
    value: "99.9%",
    title: "Uptime",
    description: "Guaranteed SLA",
  },
];

// Variantes del contenedor para la animación escalonada (stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Retraso entre cada columna de estadística
    },
  },
};

// Variantes para los elementos individuales (cada columna de estadística)
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 10 // Un poco de rebote suave
    } 
  },
};

const StatsSection = () => {
  return (
    <section 
      // Fondo degradado de morado fuerte a magenta, similar a la imagen
      className="bg-gradient-to-r from-purple-700 to-pink-600 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center"
          variants={containerVariants}
          initial="hidden"
          // Usamos 'whileInView' para que la animación se dispare cuando el usuario desplace la vista
          // hasta esta sección. El 'viewport' asegura que solo se anime una vez.
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} 
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants} 
              className="flex flex-col items-center"
            >
              <div className="mb-4 p-4 bg-gray-100/20 rounded-xl">
                {stat.icon}
              </div>
              <p className="text-4xl md:text-5xl font-medium mb-1">
                {stat.value}
              </p>
              <h3 className="text-lg font-semibold opacity-90 mb-1">
                {stat.title}
              </h3>
              <p className="text-sm opacity-70">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StatsSection;
