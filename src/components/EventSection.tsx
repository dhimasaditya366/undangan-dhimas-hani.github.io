"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@/config/wedding";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

export const EventSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const events = [
    {
      title: "Akad Nikah",
      date: weddingConfig.weddingDateDisplay,
      time: weddingConfig.akadTime,
      delay: 0,
    },
    {
      title: "Resepsi",
      date: weddingConfig.weddingDateDisplay,
      time: weddingConfig.resepsiTime,
      delay: 0.15,
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-sage-cream relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="t1 text-text-main mb-4">Rangkaian Acara</h2>
          <GoldDivider variant="short" theme="light" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: event.delay }}
              className="relative w-full max-w-md bg-sage-pale border p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(107,107,42,0.15)] group"
              style={{ borderColor: 'rgba(107, 107, 42, 0.22)' }}
            >
              {/* Corner Ornaments */}
              <BaroqueOrnament variant="corner" position="tl" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />
              <BaroqueOrnament variant="corner" position="tr" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />
              <BaroqueOrnament variant="corner" position="bl" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />
              <BaroqueOrnament variant="corner" position="br" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />

              <h3 className="t1 text-text-main mb-6" style={{ fontSize: '1.4rem' }}>{event.title}</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="t3 text-olive-text mb-1">Tanggal</p>
                  <p className="t4 text-text-main">{event.date}</p>
                </div>
                <div>
                  <p className="t3 text-olive-text mb-1">Waktu</p>
                  <p className="t4 text-text-main">{event.time}</p>
                </div>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: 'rgba(107, 107, 42, 0.22)' }}>
                <p className="t3 text-olive-text mb-1">Lokasi</p>
                <p className="t4 text-text-main mb-2">{weddingConfig.venueName}</p>
                <p className="t5 text-olive-text">{weddingConfig.venueAddress}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
