"use client";

import { useState, useRef, useEffect } from "react";
import { Disc3, VolumeX } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { motion } from "framer-motion";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt auto-play on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Silently catch autoplay block
      });
    }

    const startAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('start_audio', startAudio);
    window.addEventListener('click', startAudio, { once: true });
    window.addEventListener('scroll', startAudio, { once: true });
    window.addEventListener('touchstart', startAudio, { once: true });

    return () => {
      window.removeEventListener('start_audio', startAudio);
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 📝 GANTI: ganti file di /public/audio/wedding-song.mp3 */}
      <audio 
        ref={audioRef} 
        src={(process.env.NODE_ENV === 'production' ? '/undangan-dhimas-hani.github.io' : '') + weddingConfig.backgroundMusic} 
        loop 
        preload="auto"
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <button
        onClick={togglePlay}
        className="w-11 h-11 bg-forest border border-gold rounded-full flex items-center justify-center text-gold shadow-lg hover:bg-forest/90 transition-colors"
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Disc3 size={20} />
          </motion.div>
        ) : (
          <VolumeX size={20} />
        )}
      </button>
    </div>
  );
};
