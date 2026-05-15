"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
type BaroqueOrnamentProps = {
  variant?: "divider" | "corner" | "full";
  position?: "tl" | "tr" | "bl" | "br"; // For corner variant
  className?: string;
  opacity?: number;
};

export const BaroqueOrnament: React.FC<BaroqueOrnamentProps> = ({
  variant = "divider",
  position = "tl",
  className = "",
  opacity = 1,
}) => {
  const getTransform = () => {
    switch (position) {
      case "tr": return "scaleX(-1)";
      case "bl": return "scaleY(-1)";
      case "br": return "scale(-1, -1)";
      default: return "none";
    }
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  if (variant === "divider") {
    return (
      <div ref={ref} className={`flex items-center justify-center w-full max-w-xs mx-auto ${className}`} style={{ opacity }}>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="flex-grow border-t border-gold opacity-50 origin-right" 
        />
        <motion.div 
          initial={{ rotate: -90, scale: 0 }}
          animate={isInView ? { rotate: 0, scale: 1 } : { rotate: -90, scale: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="px-4 text-gold"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/>
          </svg>
        </motion.div>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="flex-grow border-t border-gold opacity-50 origin-left" 
        />
      </div>
    );
  }

  if (variant === "corner") {
    return (
      <div 
        className={`absolute w-12 h-12 text-gold ${className}`} 
        style={{ 
          opacity, 
          transform: getTransform(),
          top: position.includes("t") ? 0 : "auto",
          bottom: position.includes("b") ? 0 : "auto",
          left: position.includes("l") ? 0 : "auto",
          right: position.includes("r") ? 0 : "auto",
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 0 L40 0 C40 22 22 40 0 40 Z" fill="currentColor" />
          <path d="M10 10 L30 10 C30 20 20 30 10 30 Z" fill="transparent" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Full variant (background pattern)
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity }}>
      <Image 
        src={weddingConfig.baroqueBg}
        alt="Baroque Background"
        fill
        className="object-cover"
      />
    </div>
  );
};
