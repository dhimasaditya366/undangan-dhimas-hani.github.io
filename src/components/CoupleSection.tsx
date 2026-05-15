"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@/config/wedding";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

export const CoupleSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 bg-sage-cream relative overflow-hidden">
      {/* Background Ornament Full */}
      <BaroqueOrnament variant="full" opacity={0.15} className="text-gold-warm" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="t1 text-text-main mb-4">Mempelai</h2>
          <GoldDivider variant="short" theme="light" />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-xs"
          >
            <PhotoPlaceholder initial={weddingConfig.groomInitial} size="lg" className="mb-8" />
            <h3 className="t2 text-text-main mb-2">{weddingConfig.groomFullName}</h3>
            <p className="t5 text-olive-text mb-4">{weddingConfig.groomParents}</p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-gold-warm/50 flex items-center justify-center text-gold-warm hover:bg-gold-warm hover:text-sage-cream transition-colors">
                 <span className="sr-only">Instagram</span>
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </motion.div>

          {/* Center Ornament */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:flex text-gold-warm opacity-50"
          >
            <svg width="2" height="80" viewBox="0 0 2 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="1" y1="0" x2="1" y2="80" stroke="currentColor" strokeDasharray="4 4" />
            </svg>
          </motion.div>

          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-xs"
          >
            <PhotoPlaceholder initial={weddingConfig.brideInitial} size="lg" className="mb-8" />
            <h3 className="t2 text-text-main mb-2">{weddingConfig.brideFullName}</h3>
            <p className="t5 text-olive-text mb-4">{weddingConfig.brideParents}</p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-gold-warm/50 flex items-center justify-center text-gold-warm hover:bg-gold-warm hover:text-sage-cream transition-colors">
                 <span className="sr-only">Instagram</span>
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
