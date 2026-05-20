"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isMounted) return null;

  // Posisi X untuk 8 petals yang jatuh agar merata
  const petalLefts = ["12%", "24%", "38%", "52%", "63%", "74%", "85%", "44%"];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
        >
          {/* z-0 : Image Background */}
          {/* 📝 GANTI: ganti /public/images/Loading-Screen.jpeg dengan gambar kamu jika berbeda */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/Loading-Screen.jpeg"
              alt="Loading Background"
              fill
              className="object-cover"
              priority={true}
            />
          </div>

          {/* z-1 : Dark Overlay merata */}
          <div className="absolute inset-0 bg-[rgba(32,58,12,0.45)] z-[1]" />

          {/* z-2 : Vignette Radial Gradient */}
          <div 
            className="absolute inset-0 z-[2]"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(20,45,8,0.65) 100%)'
            }}
          />

          {/* z-3 : Falling Petals & Shimmer Sparkles */}
          <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
            {/* Falling Petals */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`petal-${i}`}
                className="absolute"
                style={{
                  left: petalLefts[i],
                  width: `${Math.random() * 2 + 5}px`,
                  height: `${Math.random() * 3 + 7}px`,
                  borderRadius: "50% 50% 50% 0",
                  backgroundColor: "rgba(255, 200, 175, 0.72)",
                  top: "-10px",
                }}
                animate={{
                  y: [-10, typeof window !== 'undefined' ? window.innerHeight + 20 : 1000],
                  x: [0, (Math.random() * 50) - 25],
                  rotate: [0, Math.random() * 200 + 200],
                  opacity: [0, 0.85, 0.85, 0],
                }}
                transition={{
                  duration: Math.random() * 2.5 + 4,
                  delay: Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
            
            {/* Shimmer Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-[2px] h-[2px] rounded-full bg-[#C9A96E]"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  bottom: `${10 + Math.random() * 30}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 1 + 1.5,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* z-4 : Golden Glow Pulse */}
          <div className="absolute z-[4] pointer-events-none animate-glow-pulse" 
               style={{
                 left: '50%', 
                 top: '48%', 
                 width: '120px', 
                 height: '160px', 
                 background: 'rgba(106,136,40,0.15)', 
                 borderRadius: '50%'
               }} 
          />

          {/* z-10 : Konten Utama */}
          <div className="relative z-[10] flex flex-col items-center justify-center text-center">
            
            {/* 1. Monogram Ring */}
            <div 
              className="rounded-full flex items-center justify-center relative animate-ring-glow"
              style={{
                width: '180px',
                height: '180px',
                backgroundColor: 'rgba(32,58,12,0.3)',
                backdropFilter: 'blur(2px)',
                border: '1.5px solid rgba(212,168,67,0.55)'
              }}
            >
              <div 
                className="absolute rounded-full" 
                style={{
                  top: '10px', bottom: '10px', left: '10px', right: '10px',
                  border: '1px solid rgba(212,168,67,0.22)'
                }} 
              />
              <span 
                className="italic whitespace-nowrap leading-none"
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '42px', 
                  color: '#D4A843',
                  letterSpacing: '4px'
                }}
              >
                {weddingConfig.groomInitial} <span style={{fontSize: '28px', opacity: 0.7}}>&</span> {weddingConfig.brideInitial}
              </span>
            </div>

            {/* 2. Ornamen Divider */}
            <div className="flex items-center" style={{ marginTop: '14px' }}>
              <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(212,168,67,0.4)' }} />
              <div style={{ width: '6px', height: '6px', backgroundColor: 'rgba(212,168,67,0.4)', transform: 'rotate(45deg)', margin: '0 6px' }} />
              <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(212,168,67,0.4)' }} />
            </div>

            {/* 3. Judul */}
            <div 
              className="italic"
              style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                color: '#F5F2E8',
                letterSpacing: '5px',
                marginTop: '20px',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)'
              }}
            >
              Wedding Invitation
            </div>


            {/* 5. Progress Bar */}
            <div 
              className="relative overflow-hidden"
              style={{
                marginTop: '32px',
                width: '160px',
                height: '2px',
                backgroundColor: 'rgba(212,168,67,0.15)',
                borderRadius: '2px'
              }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full"
                style={{ backgroundColor: 'rgba(212,168,67,0.82)', borderRadius: '2px' }}
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
              />
            </div>

            {/* 6. Teks Loading */}
            <div 
              className="uppercase font-extralight animate-fade-text"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                letterSpacing: '6px',
                color: 'rgba(212,168,67,0.5)',
                marginTop: '12px'
              }}
            >
              MEMUAT UNDANGAN
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
