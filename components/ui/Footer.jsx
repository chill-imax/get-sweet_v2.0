"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Sparkles,
  Facebook,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const linkClasses =
    "text-gray-400 hover:text-white transition-colors duration-300";

  return (
    <footer className="bg-[#0B0B14] text-gray-400 py-16 border-t border-gray-800 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo + Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/icons/logogetsweet.png"
                alt="GetSweet AI Logo"
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold text-white">
                GetSweet AI
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Transforming businesses with intelligent AI automation. Work
              smarter, not harder.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className={linkClasses}>
                  Features
                </a>
              </li>
              <li>
                <a href="#integrations" className={linkClasses}>
                  Integrations
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={linkClasses}>
                  How it works?
                </a>
              </li>
              <li>
                <a href="#pricing" className={linkClasses}>
                  Pricing
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className={linkClasses}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className={linkClasses}>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className={linkClasses}>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className={linkClasses}>
                  Press Kit
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className={linkClasses}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className={linkClasses}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500">
            © 2025 Sweeet AI LLC. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-3">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="https://www.facebook.com/groups/801589707636528"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition"
            >
              <Facebook className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="https://twitter.com/GetSweetAI/"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition"
            >
              <Twitter className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
