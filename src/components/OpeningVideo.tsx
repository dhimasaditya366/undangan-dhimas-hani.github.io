"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@/config/wedding";

export const OpeningVideo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.4]);

  const handleOpen = () => {
    // Trigger audio
    window.dispatchEvent(new Event('start_audio'));

    // Scroll past the OpeningVideo (which is 200vh tall) to reach the Hero section
    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="h-[200vh] w-full relative bg-forest" style={{ position: "relative" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Fallback Background (if video fails) */}
        <div className="absolute inset-0 bg-olive-dark flex items-center justify-center">
           {/* Botanical SVG fallback */}
           <svg className="w-64 h-64 opacity-10 animate-pulse" style={{ color: '#D4A843' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
             <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
             <path d="M12 22V12" />
             <path d="M12 12L16 8" />
             <path d="M12 15L8 11" />
           </svg>
        </div>
        
        <motion.video
          style={{ scale }}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={(process.env.NODE_ENV === 'production' ? '/undangan-dhimas-hani.github.io' : '') + weddingConfig.openingVideo} type="video/mp4" />
        </motion.video>

        {/* Overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[rgba(28,52,10,0.38)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(16,44,6,0.65)_100%)] pointer-events-none z-[5]" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="font-display italic drop-shadow-lg" style={{ color: '#F5F2E8', fontSize: 'clamp(4.5rem, 16vw, 8rem)' }}>
            {weddingConfig.groomInitial} <span style={{ color: 'rgba(212,168,67,0.6)', fontSize: '60%' }}>&</span> {weddingConfig.brideInitial}
          </div>
          <button
            onClick={handleOpen}
            className="t7 px-10 py-4 transition-colors duration-500 backdrop-blur-sm font-medium hover:bg-[#D4A843] hover:text-[#2A2A0E]"
            style={{ border: '1px solid rgba(212,168,67,0.72)', color: '#F5F2E8', backgroundColor: 'rgba(212,168,67,0.15)', fontSize: '0.95rem', letterSpacing: '0.25em' }}
          >
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
};
