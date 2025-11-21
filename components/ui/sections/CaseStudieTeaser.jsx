"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const teaserCases = [
  {
    title: "A Picture’s Worth a 1,000-Word Prompt",
    description:
      "Sweet AI built an agentic visual-to-prompt engine that turns sketches into production-grade visuals.",
  },
  {
    title: "Scalable Amazon Listing Content for Targus",
    description:
      "A fully automated content pipeline generating localized listings, videos, and scripts at scale.",
  },
  {
    title: "100% Automated Social Channels",
    description:
      "Idea generation → visuals → copy → optimization → scheduling — all agentic, with human QA touchpoints.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function CaseStudiesTeaser() {
  return (
    <section className="py-24 relative overflow-hidden bg-linear-to-b from-[#faf7ff] to-white rounded-bl-4xl rounded-t-4xl">
      {/* Glow effects (cubren todo el fondo) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-300 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-300 blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Sweet AI Case Studies
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Real agentic automation powering global brands.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="
    flex space-x-6 overflow-x-auto scrollbar-hide 
    py-6

    xl:grid xl:grid-cols-3 xl:gap-6 xl:space-x-0 xl:overflow-visible
  "
        >
          {teaserCases.map((item, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{
                scale: 1.06,
                rotateX: 4,
                rotateY: -4,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="
        bg-white p-7 rounded-3xl shadow-xl 
        border border-gray-100 
        backdrop-blur-sm 
        cursor-pointer select-none transform-gpu

        min-w-[320px] xl:min-w-0
      "
            >
              <h3 className="text-xl font-bold text-purple-700 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/case-studies"
            className="inline-flex items-center text-purple-700 font-semibold hover:underline text-lg"
          >
            View All Case Studies <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
