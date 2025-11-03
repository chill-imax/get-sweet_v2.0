"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Settings, CheckCircle, TrendingUp, Zap } from 'lucide-react'; 

//Datos de los Pasos de "How It Works"
const stepsData = [
  {
    icon: Rocket,
    step: "Step 01",
    title: "Sign up & onboard",
    description: "Create your account in secconds. Our AI-guided onboarding gets you up and running in under 5 minutes.",
  },
  {
    icon: Settings,
    step: "Step 02",
    title: "Customize your workflow",
    description: "Connect your tools and customize GetSweet AI to match your unique business processes and requirements.",
  },
  {
    icon: Zap,
    step: "Step 03",
    title: "Automate & scale",
    description: "Watch as GetSweet AI automates repetitive tasks, freeing your team to focus on what matters most.",
  },
  {
    icon: CheckCircle,
    step: "Step 04",
    title: "Optimize & grow",
    description: "Use powerful analytics to identify opportunities and continuously improve your operations",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, 
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};


const GradientIcon = ({ Icon }) => (
  <div className="relative p-3 rounded-xl shadow-lg bg-white overflow-hidden w-fit">
    {/* Fondo de gradiente */}
    <div 
        className="absolute inset-0 rounded-xl"
    
        style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' }}
    />
    {/* El ícono centrado y de color blanco */}
    <Icon className="relative z-10 w-8 h-8 text-white" strokeWidth={2.5} />
  </div>
);


const StepCard = ({ step, title, description, icon: Icon, isLast }) => (
  <motion.div
    className="flex mb-12 md:mb-16 last:mb-0 relative"
    variants={stepVariants}
  >
    {/* Contenedor del Ícono y la Línea */}
    <div className="flex flex-col items-center mr-6 md:mr-10">
      {/* Ícono */}
      <GradientIcon Icon={Icon} />
      
      {/* Línea Vertical de Conexión */}
      {!isLast && (
        <div className="flex grow w-0.5 h-100 bg-linear-to-b from-purple-400 to-pink-400 opacity-70 mt-2"
             style={{ height: '100px' }}> {/* Altura fija para la línea */}
        </div>
      )}
    </div>

    {/* Contenido del Paso */}
    <div className="flex-1 pt-2">
      <span className="text-sm font-normal bg-purple-100 rounded-full py-1 px-3 text-purple-600 ">
        {step}
      </span>
      <h3 className="text-2xl mt-2 font-normal text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 max-w-lg">
        {description}
      </p>
    </div>
  </motion.div>
);

const HowItWorksSection = () => {
  return (
    <section id='how-it-works' className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Título */}
         <motion.h2
         className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
          How It Works
        </motion.h2>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-16">
          Get started in minutes and see results in days
        </p>

        {/* Contenedor de la Línea de Tiempo */}
        <motion.div
          className="max-w-3xl mx-auto text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              {...step}
              isLast={index === stepsData.length - 1}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
