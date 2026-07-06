"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { weddingConfig } from "@/config/wedding";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

export const BankTransfer = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (accountNumber: string, index: number) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 2000);
    } catch {
      setCopiedIndex(null);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-sage-light relative">
      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="t1 text-text-main mb-4">Wedding Gift</h2>
          <GoldDivider variant="short" theme="light" />
          <p className="t6 text-text-main max-w-md mx-auto">
            {weddingConfig.giftNote}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center items-stretch">
          {weddingConfig.bankAccounts.map((account, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative w-full max-w-xs mx-auto bg-sage-pale border p-8 text-center group"
              style={{ borderColor: 'rgba(107, 107, 42, 0.22)' }}
            >
              <BaroqueOrnament variant="corner" position="tl" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />
              <BaroqueOrnament variant="corner" position="tr" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />
              <BaroqueOrnament variant="corner" position="bl" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />
              <BaroqueOrnament variant="corner" position="br" className="opacity-50 group-hover:opacity-80 transition-opacity text-gold-warm" />

              <p className="t3 text-olive-text mb-3">{account.bank}</p>
              <p className="t2 text-text-main mb-2 tracking-wider" style={{ fontStyle: 'normal' }}>
                {account.accountNumber}
              </p>
              <p className="t5 text-olive-text mb-6">a.n. {account.accountName}</p>

              <button
                onClick={() => handleCopy(account.accountNumber, index)}
                className="t7 px-6 py-2 border transition-colors duration-300 hover:bg-gold-warm hover:text-sage-cream"
                style={{ borderColor: 'rgba(107,107,42,0.4)', color: '#3D5A18' }}
              >
                {copiedIndex === index ? "Tersalin!" : "Salin No. Rekening"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
