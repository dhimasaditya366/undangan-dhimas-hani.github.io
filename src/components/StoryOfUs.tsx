"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { GoldDivider } from "./GoldDivider";

// ─── Placeholder photo (shown when image file doesn't exist) ─────────────────
const PhotoPlaceholder = ({
  index,
  gradientFrom,
  gradientTo,
}: {
  index: number;
  gradientFrom: string;
  gradientTo: string;
}) => (
  <div
    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
    style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
  >
    <span className="font-display italic text-2xl" style={{ color: 'rgba(44,74,16,0.35)' }}>
      Foto Cerita {index + 1}
    </span>
    <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: 'rgba(44,74,16,0.25)' }}>
      📝 story-{index + 1}.jpg
    </span>
  </div>
);

// ─── Gold corner ornament ─────────────────────────────────────────────────────
const GoldCorner = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: -1, left: -1, borderTop: '2px solid rgba(201,169,110,0.7)', borderLeft: '2px solid rgba(201,169,110,0.7)' },
    tr: { top: -1, right: -1, borderTop: '2px solid rgba(201,169,110,0.7)', borderRight: '2px solid rgba(201,169,110,0.7)' },
    bl: { bottom: -1, left: -1, borderBottom: '2px solid rgba(201,169,110,0.7)', borderLeft: '2px solid rgba(201,169,110,0.7)' },
    br: { bottom: -1, right: -1, borderBottom: '2px solid rgba(201,169,110,0.7)', borderRight: '2px solid rgba(201,169,110,0.7)' },
  };
  return (
    <div
      className="absolute w-5 h-5 pointer-events-none"
      style={styles[position]}
    />
  );
};

// ─── Leaf SVG ─────────────────────────────────────────────────────────────────
const Leaf = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M20 58C20 58 2 40 2 22C2 10.954 10.954 2 22 2C33.046 2 38 12 38 22C38 40 20 58 20 58Z" fill="#5A7820" opacity="0.12" />
    <path d="M20 58V10" stroke="#5A7820" strokeWidth="0.5" opacity="0.1" />
  </svg>
);

// ─── Individual chapter card ──────────────────────────────────────────────────
const Chapter = ({
  chapter,
  index,
  imageRight,
}: {
  chapter: (typeof weddingConfig.storyOfUs.chapters)[number];
  index: number;
  imageRight: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [imgError, setImgError] = useState(false);

  const gradients = [
    { from: "#C5CFA0", to: "#DDE8B8" },
    { from: "#8A9A50", to: "#C5CFA0" },
    { from: "#D5E8B0", to: "#EDF2E0" },
  ];
  const grad = gradients[index % gradients.length];

  const photoBlock = (
    <motion.div
      initial={{ opacity: 0, x: imageRight ? 30 : -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex-shrink-0"
      style={{ width: '180px', height: '240px' }}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          border: '1px solid rgba(90,120,32,0.2)',
          borderRadius: '4px',
        }}
      >
        <PhotoPlaceholder index={index} gradientFrom={grad.from} gradientTo={grad.to} />
        {!imgError && (
          <Image
            src={chapter.photo}
            alt={chapter.title}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {/* Corner accents — alternating by row */}
        <GoldCorner position={imageRight ? "tr" : "tl"} />
        <GoldCorner position={imageRight ? "bl" : "br"} />
      </div>
    </motion.div>
  );

  const textBlock = (
    <motion.div
      initial={{ opacity: 0, x: imageRight ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="relative flex-1 min-w-0 pt-2"
    >
      {/* Chapter number — decorative background */}
      <span
        className="font-display italic absolute -top-2 left-0 select-none pointer-events-none"
        style={{ fontSize: '3.5rem', fontWeight: 300, color: 'rgba(201,169,110,0.18)', lineHeight: 1 }}
      >
        {chapter.number}
      </span>

      {/* Chapter title */}
      <h3
        className="font-display italic relative z-10"
        style={{ fontSize: '1.3rem', fontWeight: 400, color: '#1E3A0C', marginTop: '8px' }}
      >
        {chapter.title}
      </h3>

      {/* Mini divider */}
      <div className="my-3 scale-75 origin-left">
        <GoldDivider variant="short" theme="light" />
      </div>

      {/* Body text */}
      <p
        className="font-body"
        style={{
          fontSize: '0.82rem',
          fontWeight: 300,
          color: '#3D5A18',
          lineHeight: 1.85,
        }}
      >
        {chapter.text}
      </p>

      {/* Closing quote (chapter 3 only) */}
      {chapter.closingQuote ? (
        <p
          className="font-display italic mt-4"
          style={{ fontSize: '0.88rem', fontWeight: 300, color: 'rgba(90,120,32,0.7)' }}
        >
          <span style={{ color: '#C9A96E', marginRight: '6px' }}>✦</span>
          {chapter.closingQuote}
        </p>
      ) : null}
    </motion.div>
  );

  return (
    <div ref={ref} className="relative">
      {/* Timeline dot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-6 z-10 hidden md:flex items-center justify-center"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          border: '1.5px solid #C9A96E',
          backgroundColor: '#EDF2E0',
        }}
      />
      {/* Mobile dot (left side) */}
      <div
        className="absolute left-0 top-6 z-10 flex md:hidden items-center justify-center -translate-x-1/2"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          border: '1.5px solid #C9A96E',
          backgroundColor: '#EDF2E0',
        }}
      />

      {/* Row layout */}
      <div
        className={`flex flex-col md:flex-row items-start gap-8 md:gap-10 ${imageRight ? 'md:flex-row-reverse' : ''}`}
      >
        {photoBlock}
        {textBlock}
      </div>
    </div>
  );
};

// ─── Main StoryOfUs component ─────────────────────────────────────────────────
export const StoryOfUs = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.4 });
  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.05 });

  const { eyebrow, title, subtitle, chapters } = weddingConfig.storyOfUs;

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: '#EDF2E0' }}
    >
      {/* ── Decorative botanical overlays ── */}
      <div className="absolute top-0 left-0 w-40 h-56 pointer-events-none select-none" style={{ transform: 'rotate(-20deg) translate(-20px,-20px)', opacity: 0.6 }}>
        <Leaf style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-56 pointer-events-none select-none" style={{ transform: 'rotate(160deg) translate(-20px,-20px)', opacity: 0.6 }}>
        <Leaf style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="container mx-auto px-6 max-w-3xl">

        {/* ── Section header ── */}
        <div ref={headerRef} className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="font-body uppercase"
            style={{ fontSize: '0.7rem', fontWeight: 300, letterSpacing: '6px', color: '#3D5A18', marginBottom: '10px' }}
          >
            {eyebrow}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display italic"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 400, color: '#1E3A0C' }}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display italic"
            style={{ fontSize: '0.9rem', fontWeight: 300, color: '#5A7820', letterSpacing: '0.5px', marginTop: '6px' }}
          >
            {subtitle}
          </motion.p>

          <div className="mt-5">
            <GoldDivider variant="short" theme="light" />
          </div>
        </div>

        {/* ── Timeline ── */}
        <div ref={timelineRef} className="relative">

          {/* Vertical line — desktop center, mobile left */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(201,169,110,0.22)' }}>
            <motion.div
              className="w-full origin-top"
              style={{ backgroundColor: 'rgba(201,169,110,0.4)' }}
              initial={{ scaleY: 0, height: '100%' }}
              animate={isTimelineInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
          <div
            className="md:hidden absolute top-0 bottom-0 w-px"
            style={{ left: '0', backgroundColor: 'rgba(201,169,110,0.3)' }}
          />

          {/* Chapters */}
          <div className="flex flex-col gap-16 md:gap-20 pl-6 md:pl-0">
            {chapters.map((chapter, i) => (
              <Chapter
                key={chapter.number}
                chapter={chapter}
                index={i}
                imageRight={i % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
