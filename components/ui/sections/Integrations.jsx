"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const integrations = [
  {
    name: "Slack",
    logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
  },
  {
    name: "Google Workspace",
    logo: "https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png",
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  },
  {
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  },
  {
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  },
  { name: "Zapier", logo: "https://cdn.worldvectorlogo.com/logos/zapier.svg" },
];

// Variantes de Framer Motion para la animación de entrada
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-20 bg-white text-center">
      <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 mx-2">
        Integrates with your favorite tools
      </h2>
      <p className="text-lg text-gray-500 mb-16 mx-4">
        Connect GetSweet AI with 100+ apps and services you already use
      </p>

      <motion.div
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {integrations.map((integration, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="py-2 rounded-full flex items-center justify-center bg-white border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:border-gray-200 group"
          >
            {/* Contenedor del Logo */}
            <div className="w-16 h-16 flex items-center justify-center p-2">
              <Image
                src={integration.logo}
                alt={integration.name}
                width={64}
                height={64}
                className="w-full h-full object-contain filter opacity-70 transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-16 text-center">
        <p className="text-gray-500 mb-4 mx-2">
          And 100+ more integrations via our API and Zapier
        </p>

        {/* <a
          href="#"
          className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors"
        >
          View all integrations
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </a> */}
      </div>
    </section>
  );
}

export default IntegrationsSection;
