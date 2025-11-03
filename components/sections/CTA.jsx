"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export function CallToActionSection() {
  return (
    <section className="py-10 md:py-12 text-white text-center bg-linear-to-br from-purple-500 via-pink-600 to-indigo-500  -z-10">
 
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        
        {/* Banner de Oferta Limitada */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center px-4 py-2 mb-6 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white"
        >
          <Star className="w-4 h-4 mr-2 text-yellow-300 fill-yellow-300" />
          Limited Time Offer
        </motion.div>

        {/* Título Principal */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to transform your workflow?
        </h1>

        {/* Descripción */}
        <p className="text-lg md:text-xl text-white mb-10 max-w-3xl mx-auto">
          Join 10,000+ teams already using GetSweet AI to work smarter and faster. Start your 14-day free trial today.
        </p>

        {/* Contenedor de Botones */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          
          <motion.a
            href="/signup"
            className="inline-flex items-center px-8 py-3 rounded-xl font-semibold text-purple-700 bg-white shadow-lg transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </motion.a>

          {/* Botón Secundario (Schedule a Demo) - Outline */}
          <motion.a
            href="/demo"
            className="inline-flex px-8 py-3 rounded-xl font-semibold text-white border-2 border-white/50 transition-colors duration-300 hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule a Demo
          </motion.a>
        </div>

        {/* Notas Legales / de Confianza */}
        <p className="text-sm text-white/70">
          No credit card required • Cancel anytime • 24/7 support
        </p>
      </div>
    </section>
  );
}

export default CallToActionSection;