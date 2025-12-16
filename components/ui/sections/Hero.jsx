"use client";
import React from "react";
import { motion } from "framer-motion";

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
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Variantes para los elementos individuales (texto y botones)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

// Variante especial para el texto del título (ligeramente más agresiva)
const titleVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

const HeroSection = () => {
  return (
    <section
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 
      bg-radial-gradient-to-t from-white via-white to-purple-50/50 rounded-b-4xl"
      style={{
        background:
          "radial-gradient(circle at center top, #ffffff 0%, #ffffff 30%, #f3e8ff 70%, #d8b4fe 100%)",
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
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-flex items-center px-3 py-1 text-xs font-medium rounded-full text-green-700 bg-green-100"
          >
            <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
            Agentic automation. Human quality.
          </motion.div>

          <motion.h1
            variants={titleVariants}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            <span className=" bg-clip-text text-transparent uppercase bg-linear-to-r from-purple-600 to-pink-600">
              Your personal AI marketing campaign manager
            </span>
            <br />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl text-xl text-gray-500 mb-10"
          >
            A fully customized marketing system that not only generates strategy
            and content — but executes tasks autonomously with human-in-the-loop
            oversight every step of the way.
          </motion.p>
          {/* <motion.p
            variants={itemVariants}
            className="max-w-4xl text-xl text-gray-500 mb-10"
          >
            Sweet AI clarifies your value props, writes PRDs, creates campaigns,
            builds listings, launches ads, and runs continuous A/B tests — all
            through agentic workflows designed to complete tasks from start to
            finish.
          </motion.p> */}

          <motion.div variants={itemVariants} className="flex space-x-4 mb-16">
            <a
              href="/sign-up"
              className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold 
                       hover:shadow-lg hover:shadow-purple-400/50 hover:scale-[1.02] transition duration-200 flex items-center"
            >
              Create your test campaign now →
            </a>
          </motion.div>

          <motion.div
            variants={containerVariants} // Usamos containerVariants para un efecto escalonado
            className="flex justify-center space-x-6 max-w-xl flex-wrap gap-4 mb-16" // Ajusté el margen inferior aquí
          >
            <motion.div variants={itemVariants}>
              <FeatureIcon icon="📣" text="Brand Awareness" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureIcon icon="🚦" text="Traffic Building" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureIcon icon="🎯" text="Lead Generation" />
            </motion.div>
          </motion.div>

          {/* Características Inferiores (con stagger) */}
          {/* <motion.div
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
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
