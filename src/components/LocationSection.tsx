"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@/config/wedding";
import { MapPin, Navigation } from "lucide-react";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

export const LocationSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 bg-sage-cream relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="t1 text-text-main mb-4">Lokasi Acara</h2>
          <GoldDivider variant="short" theme="light" />
        </motion.div>

        <div className="bg-sage-pale border p-2 md:p-4 rounded-sm shadow-xl relative" style={{ borderColor: 'rgba(107, 107, 42, 0.2)' }}>
          <BaroqueOrnament variant="corner" position="tl" className="opacity-30 -m-2 text-gold-warm" />
          <BaroqueOrnament variant="corner" position="tr" className="opacity-30 -m-2 text-gold-warm" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full aspect-video md:aspect-[21/9] bg-gray-200 relative overflow-hidden"
          >
            <iframe 
              src={`https://maps.google.com/maps?q=${weddingConfig.venueLat},${weddingConfig.venueLng}&hl=id&z=15&output=embed`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-90 mix-blend-multiply"
            ></iframe>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8 text-center"
          >
            <div className="t3 mb-2 text-olive-text">Akad & Resepsi</div>
            <h3 className="t2 text-text-main mb-2" style={{ fontSize: '1rem' }}>{weddingConfig.venueName}</h3>
            <p className="t4 mb-8 max-w-lg mx-auto text-text-main">{weddingConfig.venueAddress}</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href={weddingConfig.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t7 flex items-center justify-center gap-2 px-6 py-3 transition-colors duration-300 font-medium"
                style={{ backgroundColor: 'rgba(107,107,42,0.08)', border: '1px solid rgba(107,107,42,0.35)', color: '#6B6B2A' }}
              >
                <MapPin size={16} />
                Buka Google Maps
              </a>
              <a 
                href={weddingConfig.venueWazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="t7 flex items-center justify-center gap-2 px-6 py-3 transition-colors duration-300 font-medium"
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(107,107,42,0.35)', color: '#6B6B2A' }}
              >
                <Navigation size={16} />
                Buka Waze
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
