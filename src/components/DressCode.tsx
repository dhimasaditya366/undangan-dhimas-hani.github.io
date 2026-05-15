"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@/config/wedding";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

export const DressCode = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 bg-sage-light relative">
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="t1 text-text-main mb-4">Dress Code</h2>
          <GoldDivider variant="short" theme="light" />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
          {weddingConfig.dresscodeColors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: index * 0.1 
              }}
              className="flex flex-col items-center"
            >
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border shadow-lg mb-4"
                style={{ backgroundColor: color.hex, borderColor: 'rgba(107, 107, 42, 0.22)' }}
              />
              <span className="t5 text-olive-text">
                {color.name}
              </span>
            </motion.div>
          ))}
        </div>

          <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="t6 text-text-main max-w-md mx-auto"
        >
          "{weddingConfig.dresscodeNote}"
        </motion.p>
      </div>
    </section>
  );
};
