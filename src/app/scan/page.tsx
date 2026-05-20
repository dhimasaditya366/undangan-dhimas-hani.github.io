"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { weddingConfig } from "@/config/wedding";
import {
  STORAGE_KEYS,
  buildCheckinEntry,
  decodeQrPayload,
  CheckinEntry,
} from "@/lib/wedding-utils";

type ScanState = "scanning" | "success" | "duplicate" | "invalid";

const isBarcodeDetectorSupported =
  typeof window !== "undefined" && "BarcodeDetector" in window;

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const lockRef = useRef(false); // prevent double-scan

  const [checkinList, setCheckinList] = useState<CheckinEntry[]>([]);
  const [scanState, setScanState] = useState<ScanState>("scanning");
  const [lastGuest, setLastGuest] = useState<CheckinEntry | null>(null);
  const [totalToday, setTotalToday] = useState(0);
  const [cameraError, setCameraError] = useState(false);

  // Load checkin list from localStorage + Firebase real-time
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.checkinList);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CheckinEntry[];
        setCheckinList(parsed);
        setTotalToday(parsed.length);
      } catch { /* ignore */ }
    }

    let cleanup: (() => void) | undefined;
    import("@/lib/firebase-sync").then(({ isRemoteEnabled, startListening, stopListening }) => {
      if (!isRemoteEnabled()) return;
      startListening((data) => {
        if (data.checkinList) {
          localStorage.setItem(STORAGE_KEYS.checkinList, JSON.stringify(data.checkinList));
          setCheckinList(data.checkinList);
          setTotalToday(data.checkinList.length);
        }
      });
      cleanup = stopListening;
    });
    return () => cleanup?.();
  }, []);

  const saveCheckinList = useCallback(async (list: CheckinEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.checkinList, JSON.stringify(list));
    setCheckinList(list);
    setTotalToday(list.length);

    const { isRemoteEnabled, saveAllRemote } = await import("@/lib/firebase-sync");
    if (!isRemoteEnabled()) return;
    try {
      const rsvpList = JSON.parse(localStorage.getItem("wedding_rsvp") || "[]");
      const guestList = JSON.parse(localStorage.getItem(STORAGE_KEYS.guestList) || "[]");
      await saveAllRemote({ checkinList: list, rsvpList, guestList });
    } catch { /* ignore sync error, data is saved locally */ }
  }, []);

  const resetToScanning = useCallback(() => {
    setScanState("scanning");
    setLastGuest(null);
    lockRef.current = false;
  }, []);

  const handleDetected = useCallback(async (rawValue: string, currentList: CheckinEntry[]) => {
    if (lockRef.current) return;
    lockRef.current = true;

    const payload = decodeQrPayload(rawValue);
    if (!payload) {
      setScanState("invalid");
      setTimeout(resetToScanning, 2500);
      return;
    }

    const alreadyIn = currentList.find((e) => e.guestId === payload.guestId);
    if (alreadyIn) {
      setLastGuest(alreadyIn);
      setScanState("duplicate");
      setTimeout(resetToScanning, 3000);
      return;
    }

    const entry = buildCheckinEntry(payload);
    const updated = [...currentList, entry];
    await saveCheckinList(updated);
    setLastGuest(entry);
    setScanState("success");
    setTimeout(resetToScanning, 3500);
  }, [resetToScanning, saveCheckinList]);

  // Start camera & scanning loop
  useEffect(() => {
    let stopped = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        if (isBarcodeDetectorSupported) {
          detectorRef.current = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        }
      } catch {
        setCameraError(true);
        return;
      }

      const loop = async () => {
        if (stopped) return;
        if (!lockRef.current && detectorRef.current && videoRef.current) {
          try {
            const codes = await detectorRef.current.detect(videoRef.current);
            if (codes.length > 0) {
              // read latest checkinList from localStorage to avoid stale closure
              const saved = localStorage.getItem(STORAGE_KEYS.checkinList);
              const current: CheckinEntry[] = saved ? JSON.parse(saved) : [];
              await handleDetected(codes[0].rawValue, current);
            }
          } catch { /* ignore frame errors */ }
        }
        animFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    };

    start();
    return () => {
      stopped = true;
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [handleDetected]);

  const stateConfig = {
    success: {
      bg: "bg-emerald-900/95",
      border: "border-emerald-400/60",
      icon: "✓",
      iconColor: "text-emerald-400",
      title: "Selamat Datang!",
      titleColor: "text-emerald-300",
    },
    duplicate: {
      bg: "bg-amber-900/95",
      border: "border-amber-400/60",
      icon: "⚠",
      iconColor: "text-amber-400",
      title: "Sudah Check-in",
      titleColor: "text-amber-300",
    },
    invalid: {
      bg: "bg-red-900/95",
      border: "border-red-400/60",
      icon: "✕",
      iconColor: "text-red-400",
      title: "QR Tidak Valid",
      titleColor: "text-red-300",
    },
  };

  const cfg = scanState !== "scanning" ? stateConfig[scanState] : null;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">

      {/* Camera feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
      />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/70 to-transparent">
        <div>
          <p className="text-gold-warm/80 text-xs tracking-widest uppercase">Check-in Mandiri</p>
          <p className="text-white/90 text-sm font-medium">
            {weddingConfig.brideName} & {weddingConfig.groomName}
          </p>
        </div>
        <div className="rounded-full bg-black/40 border border-gold-warm/30 px-4 py-1.5 text-center backdrop-blur-sm">
          <span className="text-gold-warm text-lg font-semibold">{totalToday}</span>
          <span className="text-white/50 text-xs ml-1">tamu hadir</span>
        </div>
      </div>

      {/* Scan frame */}
      {scanState === "scanning" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
              "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
              "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
            ].map((cls, i) => (
              <div key={i} className={`absolute w-8 h-8 border-gold-warm ${cls}`} />
            ))}

            {/* Scan line animation */}
            <div className="absolute inset-x-2 overflow-hidden" style={{ top: "4px", bottom: "4px" }}>
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-warm to-transparent animate-scan-line"
              />
            </div>
          </div>

          <p className="mt-6 text-white/70 text-sm tracking-wide">Arahkan QR ke bingkai di atas</p>
        </div>
      )}

      {/* Result overlay */}
      {scanState !== "scanning" && cfg && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
          <div className={`w-full max-w-sm rounded-3xl border ${cfg.border} ${cfg.bg} p-8 text-center shadow-2xl backdrop-blur-md`}>
            <div className={`text-6xl mb-4 ${cfg.iconColor}`}>{cfg.icon}</div>
            <h2 className={`text-2xl font-semibold mb-2 ${cfg.titleColor}`}>{cfg.title}</h2>

            {lastGuest && (
              <>
                <p className="text-white text-xl font-medium mt-4">{lastGuest.guestName}</p>
                {lastGuest.phone && (
                  <p className="text-white/50 text-sm mt-1">{lastGuest.phone}</p>
                )}
                {scanState === "success" && (
                  <div className="mt-4 rounded-xl bg-white/10 px-4 py-2 inline-block">
                    <span className="text-white/70 text-sm">
                      {lastGuest.guests} orang · {lastGuest.attendance}
                    </span>
                  </div>
                )}
                {scanState === "duplicate" && (
                  <p className="mt-3 text-amber-300/70 text-sm">
                    Tamu ini sudah tercatat hadir sebelumnya.
                  </p>
                )}
              </>
            )}

            {scanState === "invalid" && (
              <p className="mt-3 text-red-300/70 text-sm">
                QR tidak dikenali. Pastikan tamu membuka undangan dan mengisi RSVP terlebih dahulu.
              </p>
            )}

            <p className="mt-6 text-white/30 text-xs">Kembali scan otomatis...</p>
          </div>
        </div>
      )}

      {/* Camera error */}
      {cameraError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center px-6 bg-black/90">
          <div className="text-center">
            <p className="text-4xl mb-4">📷</p>
            <p className="text-white text-lg font-medium mb-2">Kamera tidak dapat diakses</p>
            <p className="text-white/50 text-sm mb-6">Izinkan akses kamera di browser, lalu muat ulang halaman.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full border border-gold-warm/50 px-6 py-3 text-gold-warm hover:bg-gold-warm/10 transition"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      {scanState === "scanning" && !cameraError && (
        <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
          <p className="text-white/30 text-xs tracking-widest uppercase">
            {weddingConfig.weddingDateDisplay}
          </p>
        </div>
      )}
    </div>
  );
}
