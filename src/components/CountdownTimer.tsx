"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { weddingConfig } from "@/config/wedding";

const FlipDigit = ({ digit, label }: { digit: number; label: string }) => {
  const [currentValue, setCurrentValue] = useState(digit);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (digit !== currentValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setCurrentValue(digit);
        setIsAnimating(false);
      }, 300); // Half of transition duration
      return () => clearTimeout(timer);
    }
  }, [digit, currentValue]);

  const formattedDigit = currentValue.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <div className="relative w-16 h-20 md:w-20 md:h-24 bg-olive-dark border rounded-md flex items-center justify-center overflow-hidden [perspective:1000px]" style={{ borderColor: 'rgba(212,168,67,0.3)' }}>
        {/* Static Background Digit */}
        <span className="opacity-50" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 300, letterSpacing: '2px', color: '#F5F2E8', fontVariantNumeric: 'tabular-nums' }}>
          {formattedDigit}
        </span>
        
        {/* Animating Top Half (simulate flip down) */}
        <motion.div
          initial={false}
          animate={{ rotateX: isAnimating ? -90 : 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="absolute top-0 left-0 right-0 bottom-1/2 bg-olive-dark flex items-end justify-center overflow-hidden border-b origin-bottom"
          style={{ borderColor: 'rgba(212,168,67,0.3)' }}
        >
          <span className="translate-y-[50%]" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 300, letterSpacing: '2px', color: '#F5F2E8', fontVariantNumeric: 'tabular-nums' }}>
            {formattedDigit}
          </span>
        </motion.div>

        {/* Animating Bottom Half (simulate flip up) */}
        <motion.div
          initial={false}
          animate={{ rotateX: isAnimating ? 0 : 90 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: isAnimating ? 0.3 : 0 }}
          className="absolute top-1/2 left-0 right-0 bottom-0 bg-olive-dark flex items-start justify-center overflow-hidden origin-top"
        >
          <span className="-translate-y-[50%]" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 300, letterSpacing: '2px', color: '#F5F2E8', fontVariantNumeric: 'tabular-nums' }}>
            {digit.toString().padStart(2, "0")}
          </span>
        </motion.div>
      </div>
      <span className="t3 mt-3" style={{ color: 'rgba(212,168,67,0.55)' }}>
        {label}
      </span>
    </div>
  );
};

export const CountdownTimer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(weddingConfig.weddingDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-olive-dark relative overflow-hidden flex justify-center items-center">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 border-t border-l rounded-tl-full -translate-x-1/2 -translate-y-1/2" style={{ borderColor: 'rgba(212,168,67,0.3)' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r rounded-br-full translate-x-1/2 translate-y-1/2" style={{ borderColor: 'rgba(212,168,67,0.3)' }} />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center items-center relative z-10"
      >
        <FlipDigit digit={timeLeft.days} label="Hari" />
        <FlipDigit digit={timeLeft.hours} label="Jam" />
        <FlipDigit digit={timeLeft.minutes} label="Menit" />
        <FlipDigit digit={timeLeft.seconds} label="Detik" />
      </motion.div>
    </section>
  );
};
