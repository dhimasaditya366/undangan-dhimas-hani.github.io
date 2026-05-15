"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@/config/wedding";

export const Footer = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <footer ref={sectionRef} className="pt-24 pb-12 bg-gradient-to-b from-olive-dark to-[#2A2A0E] relative overflow-hidden">
      {/* Decorative full-width botanical SVG */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
          <path d="M0,0 C25,50 75,50 100,0" stroke="currentColor" strokeWidth="1" className="text-gold-warm" />
          <path d="M0,20 C25,70 75,70 100,20" stroke="currentColor" strokeWidth="0.5" className="text-gold-warm" />
        </svg>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <div className="t2 text-gold-warm mb-6" style={{ fontSize: 'clamp(2rem, 7vw, 3rem)' }}>
            {weddingConfig.groomInitial} <span className="t9 mx-2">&</span> {weddingConfig.brideInitial}
          </div>
          
          <div className="w-16 h-[1px] mx-auto mb-6" style={{ backgroundColor: 'rgba(212,168,67,0.4)' }} />

          <p className="t4 text-gold-warm/80 mb-2">
            {weddingConfig.weddingDateDisplay}
          </p>
          <p className="t4 text-gold-warm/80 mb-12">
            {weddingConfig.venueName}
          </p>

          <p className="font-display italic font-light max-w-lg mx-auto mb-20 leading-relaxed" style={{ color: 'rgba(212,168,67,0.7)' }}>
            "{weddingConfig.closingQuote}"
          </p>

          <p className="t5 text-gold-warm opacity-35">
            Made with ♥
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
