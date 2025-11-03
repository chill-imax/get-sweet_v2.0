"use client";
import React from 'react';
import { motion } from 'framer-motion';

// Iconos simples para las características inferiores (usando inline SVG o FontAwesome, aquí usamos texto/emoji para simplicidad)
const FeatureIcon = ({ icon, text }) => (
  <div className="flex items-center text-sm text-gray-700">
    <span className="mr-2 text-xl">{icon}</span>
    {text}
  </div>
);

// Contenedor principal de la animación (staggering)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Introduce cada elemento con un pequeño retraso
      delayChildren: 0.3, // Retraso antes de que comience la primera animación
    },
  },
};

// Variantes para los elementos individuales (texto y botones)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  },
};

// Variante especial para el texto del título (ligeramente más agresiva)
const titleVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 } 
  },
};


const HeroSection = () => {
  return (
    // El gradiente de fondo radial (from-white/purple-100 to-transparent)
    // Se usa un color muy claro en el centro para dar el efecto de luz.
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 
      bg-radial-gradient-to-t from-white via-white to-purple-50/50" 
      style={{
        // Este CSS simula un gradiente radial sutil, similar al de la imagen
        // Va de un color casi blanco en el centro a un morado muy suave en los bordes
        background: 'radial-gradient(circle at center top, #ffffff 0%, #ffffff 30%, #f3e8ff 70%, #d8b4fe 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* Contenedor de la animación */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          
          {/* Tag de la característica */}
          <motion.div 
            variants={itemVariants}
            className="mb-4 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100"
          >
            <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
            Now powered by advanced AI
          </motion.div>

          {/* Título Principal */}
          <motion.h1 
            variants={titleVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gray-900">AI That Understands Your</span>
            <br />
            {/* Gradiente en el texto para replicar el estilo de la imagen */}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600">
              Business
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p 
            variants={itemVariants}
            className="max-w-3xl text-xl text-gray-500 mb-10"
          >
            Transform your workflow with intelligent automation. Sweet AI helps you work smarter, faster, and more efficiently than ever before.
          </motion.p>

          {/* Botones */}
          <motion.div 
            variants={itemVariants}
            className="flex space-x-4 mb-16"
          >
            {/* Botón Principal (con gradiente y hover) */}
            <a
              href="#start"
              className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold 
                       hover:shadow-lg hover:shadow-purple-400/50 hover:scale-[1.02] transition duration-200 flex items-center"
            >
              Start Free Trial →
            </a>
            
            {/* Botón Secundario (Watch Demo) */}
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold 
                       hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Demo
            </a>
          </motion.div>

          {/* Características Inferiores (con stagger) */}
          <motion.div 
            variants={containerVariants}
            className="flex justify-center space-x-8 max-w-xl flex-wrap gap-4"
          >
            <motion.div variants={itemVariants}>
              <FeatureIcon icon="⚡" text="No credit card required" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureIcon icon="🔒" text="Enterprise security" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureIcon icon="🚀" text="Setup in minutes" />
            </motion.div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
