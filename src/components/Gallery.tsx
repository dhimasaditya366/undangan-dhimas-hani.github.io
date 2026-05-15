"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GoldDivider } from "./GoldDivider";

export const Gallery = () => {
  const photos = weddingConfig.galleryPhotos;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-advance every 4s
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => go(1), 4000);
    return () => clearInterval(t);
  }, [isPaused, go]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: '#EEF2DC' }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 px-4"
      >
        <p className="t3 mb-3" style={{ color: 'rgba(90,120,32,0.65)' }}>Potret Kebersamaan</p>
        <h2 className="t1 mb-4" style={{ color: '#2C4A10' }}>Galeri Momen</h2>
        <GoldDivider variant="short" theme="light" />
      </motion.div>

      {/* Slideshow */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative mx-auto"
        style={{ maxWidth: '520px', padding: '0 16px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Outer decorative frame */}
        <div
          className="relative"
          style={{
            padding: '10px',
            background: 'linear-gradient(135deg, rgba(212,168,67,0.22) 0%, rgba(90,120,32,0.08) 100%)',
            border: '1px solid rgba(212,168,67,0.35)',
          }}
        >
          {/* Corner accents */}
          {[['top-0 left-0', 'border-t border-l'], ['top-0 right-0', 'border-t border-r'], ['bottom-0 left-0', 'border-b border-l'], ['bottom-0 right-0', 'border-b border-r']].map(([pos, borders], i) => (
            <div
              key={i}
              className={`absolute ${pos} w-5 h-5 ${borders} z-20`}
              style={{ borderColor: 'rgba(212,168,67,0.8)', margin: '-1px' }}
            />
          ))}

          {/* Image area */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '3/4', background: 'linear-gradient(135deg, #C5CFA0, #A8B87A)' }}
          >
            {/* Placeholder number */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <span className="font-display italic text-4xl" style={{ color: 'rgba(44,74,16,0.25)' }}>
                {current + 1}
              </span>
            </div>

            {/* Sliding images */}
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <Image
                  src={photos[current]}
                  alt={`Foto ${current + 1}`}
                  fill
                  className="object-cover"
                  priority={current === 0}
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />

                {/* Subtle inner vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 60px rgba(20,50,10,0.3)' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: 'rgba(20,50,10,0.45)', border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', backdropFilter: 'blur(4px)' }}
              onClick={() => go(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: 'rgba(20,50,10,0.45)', border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', backdropFilter: 'blur(4px)' }}
              onClick={() => go(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Counter + progress */}
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="font-body text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(90,120,32,0.6)' }}>
              {String(current + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>

            {/* Progress dots */}
            <div className="flex gap-1.5 items-center">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className="transition-all duration-400"
                  style={{
                    width: i === current ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: i === current ? '#D4A843' : 'rgba(90,120,32,0.3)',
                  }}
                />
              ))}
            </div>

            {/* Auto-play status */}
            <span className="font-body text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(90,120,32,0.35)' }}>
              {isPaused ? 'PAUSED' : 'AUTO'}
            </span>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className="relative overflow-hidden transition-all duration-300"
              style={{
                width: '48px',
                height: '64px',
                border: i === current ? '1.5px solid #D4A843' : '1.5px solid rgba(90,120,32,0.25)',
                opacity: i === current ? 1 : 0.55,
                transform: i === current ? 'scale(1.08)' : 'scale(1)',
                borderRadius: '1px',
              }}
            >
              {/* thumb placeholder */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #C5CFA0, #A8B87A)' }}>
                <span className="absolute inset-0 flex items-center justify-center font-display italic text-xs" style={{ color: 'rgba(44,74,16,0.4)' }}>{i + 1}</span>
              </div>
              <Image src={src} alt="" fill className="object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
