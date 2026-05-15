"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { BaroqueOrnament } from "./BaroqueOrnament";
import { GoldDivider } from "./GoldDivider";

type RsvpData = {
  name: string;
  phone: string;
  attendance: "Hadir" | "Tidak Hadir" | "Masih Ragu";
  guests: number;
  message: string;
  date: string;
};

export const RSVPForm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    attendance: "Hadir" as "Hadir" | "Tidak Hadir" | "Masih Ragu",
    guests: 1,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("wedding_rsvp");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRsvpCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch (e) {
        setRsvpCount(0);
      }
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newEntry: RsvpData = {
        ...formData,
        date: new Date().toISOString(),
      };

      const existingStr = localStorage.getItem("wedding_rsvp");
      let existingData: RsvpData[] = [];
      if (existingStr) {
        try {
          existingData = JSON.parse(existingStr);
          if (!Array.isArray(existingData)) existingData = [];
        } catch (e) {
          existingData = [];
        }
      }

      existingData.unshift(newEntry);
      localStorage.setItem("wedding_rsvp", JSON.stringify(existingData));
      
      // Dispatch event to update WishesWall
      window.dispatchEvent(new Event('rsvp_updated'));

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section ref={containerRef} className="min-h-screen w-full relative flex flex-col justify-center items-center py-24 overflow-hidden" style={{ backgroundColor: '#2C4A10' }}>
      <BaroqueOrnament variant="full" opacity={0.15} className="text-gold-warm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl px-4 relative z-10"
      >
          <div className="text-center mb-8">
            <h2 className="t1 text-text-light mb-4">Konfirmasi Kehadiran</h2>
            <GoldDivider variant="short" theme="dark" />
            <p className="t5 text-gold-warm/80 mt-2">
              {rsvpCount > 0 ? `${rsvpCount} orang sudah konfirmasi` : "Harap isi form di bawah ini"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit} 
                className="backdrop-blur-md border p-6 md:p-10 shadow-2xl rounded-sm"
                style={{ backgroundColor: 'rgba(122,138,58,0.25)', borderColor: 'rgba(212,168,67,0.22)' }}
              >
                <div className="space-y-6">
                  {/* Nama */}
                  <motion.div>
                    <label className="t3 block text-gold-warm mb-2">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="t5 w-full bg-transparent border-b text-text-light py-2 focus:outline-none focus:border-gold-warm transition-colors placeholder:text-text-light/20"
                      style={{ borderColor: 'rgba(212,168,67,0.3)' }}
                      placeholder="Tulis nama Anda"
                    />
                  </motion.div>

                  {/* WA */}
                  <motion.div>
                    <label className="t3 block text-gold-warm mb-2">Nomor WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="t5 w-full bg-transparent border-b text-text-light py-2 focus:outline-none focus:border-gold-warm transition-colors placeholder:text-text-light/20"
                      style={{ borderColor: 'rgba(212,168,67,0.3)' }}
                      placeholder="0812..."
                    />
                  </motion.div>

                  {/* Kehadiran */}
                  <motion.div>
                    <label className="t3 block text-gold-warm mb-3">Kehadiran</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {(["Hadir", "Tidak Hadir", "Masih Ragu"] as const).map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({...formData, attendance: option})}
                          className={`t5 flex-1 py-3 transition-colors border ${
                            formData.attendance === option 
                              ? "bg-gold-warm border-gold-warm text-olive-dark" 
                              : "text-text-light hover:border-gold-warm/80"
                          }`}
                          style={{ borderColor: formData.attendance === option ? '' : 'rgba(212,168,67,0.3)' }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tamu */}
                  {formData.attendance === "Hadir" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="t3 block text-gold-warm mb-2">Jumlah Tamu</label>
                      <select 
                        value={formData.guests}
                        onChange={e => setFormData({...formData, guests: Number(e.target.value)})}
                        className="t5 w-full bg-olive-dark border-b text-text-light py-2 focus:outline-none focus:border-gold-warm appearance-none cursor-pointer"
                        style={{ borderColor: 'rgba(212,168,67,0.3)' }}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Orang</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Ucapan */}
                  <motion.div>
                    <label className="t3 block text-gold-warm mb-2">Ucapan & Doa</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="t5 w-full bg-transparent border-b text-text-light py-2 focus:outline-none focus:border-gold-warm transition-colors placeholder:text-text-light/20 resize-none"
                      style={{ borderColor: 'rgba(212,168,67,0.3)' }}
                      placeholder="Tulis ucapan untuk mempelai"
                    ></textarea>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="t7 w-full py-4 transition-colors duration-300 mt-8 flex justify-center items-center gap-2 font-medium"
                    style={{ backgroundColor: '#D4A843', color: '#2A2A0E', border: '1px solid rgba(212,168,67,0.65)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Konfirmasi"
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="backdrop-blur-md border p-12 text-center rounded-sm relative overflow-hidden"
                style={{ backgroundColor: 'rgba(122,138,58,0.25)', borderColor: 'rgba(212,168,67,0.22)' }}
              >
                {/* Botanical Confetti Background */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ top: "-10%", left: `${Math.random() * 100}%`, rotate: 0 }}
                      animate={{ top: "110%", left: `${Math.random() * 100}%`, rotate: 360 }}
                      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                      className="absolute text-gold-warm w-6 h-6"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 20 18 20 12C20 6 12 2 12 2Z"/></svg>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <CheckCircle className="mx-auto text-gold-warm mb-6" size={64} />
                </motion.div>
                <h3 className="font-serif text-3xl text-text-light mb-4 italic">Terima Kasih!</h3>
                <p className="font-sans text-gold-warm mb-8">Kami menantikan kehadiran Anda di hari bahagia kami.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
    </section>
  );
};
