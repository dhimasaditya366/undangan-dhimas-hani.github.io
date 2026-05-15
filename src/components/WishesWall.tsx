"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

type RsvpData = {
  name: string;
  attendance: string;
  message: string;
  date: string;
};

export const WishesWall = () => {
  const [wishes, setWishes] = useState<RsvpData[]>([]);

  const fetchWishes = () => {
    const saved = localStorage.getItem("wedding_rsvp");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishes(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  useEffect(() => {
    fetchWishes();
    window.addEventListener('rsvp_updated', fetchWishes);
    return () => window.removeEventListener('rsvp_updated', fetchWishes);
  }, []);

  if (wishes.length === 0) return null;

  return (
    <section className="py-24 relative" style={{ backgroundColor: '#2C4A10' }}>
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="t1 text-text-light mb-4">Ucapan & Doa</h2>
          <GoldDivider variant="short" theme="dark" />
        </motion.div>

        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {wishes.map((wish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.5) }}
              className="break-inside-avoid border p-6 rounded-sm relative"
              style={{ backgroundColor: 'rgba(122,138,58,0.25)', borderColor: 'rgba(212,168,67,0.22)' }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none" style={{ color: '#D4A843' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L16.426 14.285L17.5 14.5L18.5 10L14.017 8V4.5C14.017 3.671 14.688 3 15.517 3H17.517V0H15.517C13.036 0 11.017 2.019 11.017 4.5V8H9V14.5L10.074 14.285L12.483 21H14.017ZM7.01709 21L9.42609 14.285L10.5 14.5L11.5 10L7.01709 8V4.5C7.01709 3.671 7.68809 3 8.51709 3H10.5171V0H8.51709C6.03609 0 4.01709 2.019 4.01709 4.5V8H2V14.5L3.07409 14.285L5.48309 21H7.01709Z" />
                </svg>
              </div>
              <h4 className="t2 mb-1" style={{ fontSize: '0.85rem', color: '#D4A843' }}>{wish.name}</h4>
              <span className="t5 inline-block px-2 py-0.5 border text-gold-warm/80 mb-4" style={{ borderColor: 'rgba(212,168,67,0.3)' }}>
                {wish.attendance}
              </span>
              <p className="t6 whitespace-pre-wrap" style={{ color: 'rgba(245,242,232,0.8)' }}>{wish.message}</p>
            </motion.div>
          ))}
        </div>

        {/* Tombol Clear Data (Untuk Testing) */}
        <div className="mt-16 text-center">
          <button
            onClick={() => {
              if (confirm("Hapus semua data ucapan dummy?")) {
                localStorage.removeItem("wedding_rsvp");
                setWishes([]);
                window.dispatchEvent(new Event('rsvp_updated'));
              }
            }}
            className="t5 text-xs px-4 py-2 border rounded-sm transition-colors opacity-50 hover:opacity-100"
            style={{ color: '#D4A843', borderColor: 'rgba(212,168,67,0.3)' }}
          >
            Reset Dummy Data (Testing)
          </button>
        </div>
      </div>
    </section>
  );
};
