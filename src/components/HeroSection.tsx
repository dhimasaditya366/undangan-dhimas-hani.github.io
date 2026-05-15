"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { GoldDivider } from "./GoldDivider";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: false, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-60px"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div ref={containerRef} className="h-[150vh] w-full relative bg-olive-dark" style={{ position: "relative" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Parallax Background */}
        <motion.div 
          style={{ y: yBackground }}
          className="absolute left-0 right-0 h-[130vh] -top-[30vh]"
        >
          <div className="absolute inset-0 bg-olive-dark z-0"></div>
          <Image
            src={weddingConfig.heroBg}
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-olive-dark/40 via-transparent to-olive-dark z-0"></div>
        </motion.div>



        {/* Floating Botanicals */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-8 h-8 opacity-30"
               style={{
                 left: `${20 + i * 15}%`,
                 top: `${10 + (i % 3) * 20}%`,
                 color: '#6A8828'
               }}
               animate={{
                 y: [0, -20, 0],
                 rotate: [0, 10, -10, 0],
               }}
               transition={{
                 duration: 6 + i,
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
             >
               <svg viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C12 2 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
               </svg>
             </motion.div>
           ))}
        </div>

        {/* Content */}
        <motion.div 
          ref={textRef}
          style={{ y: yContent, opacity: opacityContent }}
          className="relative z-20 flex flex-col items-center text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0, duration: 1 }}
            className="t3 mb-4"
            style={{ color: 'rgba(212,168,67,0.68)', fontSize: '1rem' }}
          >
            The Wedding Of
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="t2"
            style={{ color: '#F5F2E8', fontSize: 'clamp(2.4rem, 7vw, 4rem)' }}
          >
            {weddingConfig.groomName}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-display italic"
            style={{ color: 'rgba(212,168,67,0.6)', margin: '4px 0', fontSize: '1.4rem' }}
          >
            &
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="t2"
            style={{ color: '#F5F2E8', fontSize: 'clamp(2.4rem, 7vw, 4rem)' }}
          >
            {weddingConfig.brideName}
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <GoldDivider variant="ornate" theme="dark" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="t4"
            style={{ color: 'rgba(245,242,232,0.85)', letterSpacing: '3px', fontSize: '1.3rem' }}
          >
            {weddingConfig.weddingDateDisplay}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="t5 mt-2"
            style={{ color: 'rgba(245,242,232,0.55)', fontSize: '1rem' }}
          >
            {weddingConfig.akadTime} · {weddingConfig.venueName}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <span className="font-sans text-[0.6rem] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(212,168,67,0.4)' }}>Scroll</span>
          <motion.div 
            animate={{ height: ["0px", "40px", "0px"], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px]"
            style={{ backgroundColor: 'rgba(212,168,67,0.4)' }}
          />
        </div>
      </div>
    </div>
  );
};
