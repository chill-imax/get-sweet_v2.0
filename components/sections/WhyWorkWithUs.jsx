"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Users, TrendingUp, Sparkles } from "lucide-react";


const featuresData = [
  {
    icon: Brain,
    title: "Intelligent Automation",
    description: "Advanced AI that learns from your workflow and automates repetitive tasks seamlessly.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process tasks 10x faster with our optimized AI engine built for performance.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration and shared workspaces.",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Get actionable insights with powerful analytics and custom reporting dashboards.",
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    description: "AI-powered recommendations that help you make better decisions faster.",
  },
];

// Variante para el contenedor de las tarjetas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
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
    <div className="absolute inset-0 rounded-xl opacity-90"
         style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' }}>
    </div>
    <Icon className="relative z-10 w-6 h-6 text-white" />
  </div>
);


const FeaturesSection = () => {
  return (
    <section id='features' className="py-24 bg-white">
      <div className=" mx-auto px-6 text-center max-w-7xl">

        {/* Título y Subtítulo */}
         <motion.h2
         className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
          Why Work With Us
        </motion.h2>
        <motion.p
            className="text-xl text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
          Everything you need to supercharge your productivity and scale your business
        </motion.p>

        {/* Grid de Características */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-8 mt-10 rounded-2xl border-2 bg-card hover:bg-linear-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg hover:border-purple-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Ícono con Gradiente */}
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex mb-4 group-hover:scale-110 transition-transform">
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

export default FeaturesSection;
