"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GuestRow,
  STORAGE_KEYS,
  buildCheckinEntry,
  createGuestId,
  createGuestLink,
  createWhatsAppLink,
  decodeQrPayload,
  exportCsv,
  parseGuestCsv,
  CheckinEntry,
} from "@/lib/wedding-utils";

const isBarcodeDetectorSupported = typeof window !== "undefined" && "BarcodeDetector" in window;

export default function AdminCheckinPage() {
  const [guestList, setGuestList] = useState<GuestRow[]>([]);
  const [checkinList, setCheckinList] = useState<CheckinEntry[]>([]);
  const [scanMessage, setScanMessage] = useState("Tekan tombol START SCAN untuk memindai QR.");
  const [scannedPayload, setScannedPayload] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "ok" | "error">("idle");

  const pushToFirebase = async (partial: { guestList?: GuestRow[]; checkinList?: CheckinEntry[] }) => {
    const { isRemoteEnabled, saveAllRemote } = await import("@/lib/firebase-sync");
    if (!isRemoteEnabled()) return;
    setSyncStatus("syncing");
    try {
      const rsvpList = JSON.parse(localStorage.getItem("wedding_rsvp") || "[]");
      await saveAllRemote({ ...partial, rsvpList });
      setSyncStatus("ok");
    } catch {
      setSyncStatus("error");
    }
  };
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    const savedGuest = localStorage.getItem(STORAGE_KEYS.guestList);
    const savedCheckin = localStorage.getItem(STORAGE_KEYS.checkinList);
    if (savedGuest) {
      try {
        setGuestList(JSON.parse(savedGuest) as GuestRow[]);
      } catch {
        setGuestList([]);
      }
    }
    if (savedCheckin) {
      try {
        setCheckinList(JSON.parse(savedCheckin) as CheckinEntry[]);
      } catch {
        setCheckinList([]);
      }
    }

    // Mulai real-time listener Firestore jika Firebase dikonfigurasi
    let cleanup: (() => void) | undefined;
    import("@/lib/firebase-sync").then(({ isRemoteEnabled, startListening, stopListening }) => {
      if (!isRemoteEnabled()) return;
      startListening((data) => {
        if (data.guestList) {
          localStorage.setItem(STORAGE_KEYS.guestList, JSON.stringify(data.guestList));
          setGuestList(data.guestList);
        }
        if (data.checkinList) {
          localStorage.setItem(STORAGE_KEYS.checkinList, JSON.stringify(data.checkinList));
          setCheckinList(data.checkinList);
        }
        if (data.rsvpList) {
          localStorage.setItem("wedding_rsvp", JSON.stringify(data.rsvpList));
          window.dispatchEvent(new Event("rsvp_updated"));
        }
      });
      cleanup = stopListening;
    });

    return () => cleanup?.();
  }, []);

  const saveGuestList = (list: GuestRow[]) => {
    localStorage.setItem(STORAGE_KEYS.guestList, JSON.stringify(list));
    setGuestList(list);
    pushToFirebase({ guestList: list });
  };

  const clearGuestList = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data tamu yang telah diupload? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem(STORAGE_KEYS.guestList);
      setGuestList([]);
      setScanMessage("Semua data tamu telah dihapus.");
    }
  };

  const clearRsvpData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data RSVP, ucapan, dan doa? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem("wedding_rsvp");
      window.dispatchEvent(new Event("rsvp_updated"));
      setScanMessage("Semua data RSVP, ucapan, dan doa telah dihapus.");
    }
  };

  const deleteCheckinEntry = (guestId: string) => {
    const updated = checkinList.filter((entry) => entry.guestId !== guestId);
    saveCheckinList(updated);
    setScanMessage(`Satu data check-in telah dihapus.`);
  };

  const clearAllCheckinData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus SEMUA data kehadiran/check-in? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem(STORAGE_KEYS.checkinList);
      setCheckinList([]);
      setScanMessage("Semua data check-in telah dihapus.");
    }
  };

  const saveCheckinList = (list: CheckinEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.checkinList, JSON.stringify(list));
    setCheckinList(list);
    pushToFirebase({ checkinList: list });
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseGuestCsv(text).map((guest) => ({
      guestId: guest.guestId || createGuestId(),
      name: guest.name,
      phone: guest.phone,
    }));
    saveGuestList(parsed);
    setScanMessage(`Daftar tamu berhasil diimpor (${parsed.length} tamu).`);
    event.target.value = "";
  };

  const guestBlastRows = useMemo(
    () =>
      guestList.map((guest) => ({
        guestId: guest.guestId,
        name: guest.name,
        phone: guest.phone,
        guestLink: createGuestLink(guest),
        whatsappLink: createWhatsAppLink(guest),
      })),
    [guestList]
  );

  const handleOpenAllWhatsApp = () => {
    guestBlastRows.forEach((row) => {
      window.open(row.whatsappLink, "_blank", "noopener,noreferrer");
    });
  };

  const handleDownloadBlastCsv = () => {
    const csv = exportCsv(guestBlastRows, ["guestId", "name", "phone", "guestLink", "whatsappLink"]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wa_blast_links.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadGuestCsv = () => {
    const csv = exportCsv(guestList, ["guestId", "name", "phone"]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "guest_list.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCheckinCsv = () => {
    const csv = exportCsv(checkinList, ["guestId", "guestName", "phone", "attendance", "guests", "checkedInAt"]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "checkin_list.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  const handleDetectedPayload = (rawValue: string) => {
    const payload = decodeQrPayload(rawValue);
    if (!payload) {
      setScanMessage("QR tidak valid. Pastikan QR dibuat dari undangan ini.");
      return;
    }

    const existing = checkinList.find((entry) => entry.guestId === payload.guestId);
    setScannedPayload({ payload, alreadyCheckedIn: Boolean(existing) });
    setScanMessage("QR berhasil terdeteksi. Konfirmasi detail di bawah.");
  };

  useEffect(() => {
    if (!isScanning || !cameraActive || !videoRef.current) return;

    let animationFrameId: number;
    let stopped = false;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if (isBarcodeDetectorSupported) {
          detectorRef.current = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        }

        const scanFrame = async () => {
          if (stopped || !videoRef.current) return;
          try {
            if (detectorRef.current) {
              const barcodes = await detectorRef.current.detect(videoRef.current);
              if (barcodes.length > 0) {
                handleDetectedPayload(barcodes[0].rawValue);
                setIsScanning(false);
                return;
              }
            }
          } catch {
            // ignore read errors
          }
          animationFrameId = window.requestAnimationFrame(scanFrame);
        };

        scanFrame();
      } catch (error) {
        setScanMessage("Tidak dapat mengakses kamera. Coba refresh atau gunakan browser lain.");
        setIsScanning(false);
      }
    };

    startVideo();

    return () => {
      stopped = true;
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraActive, checkinList, isScanning]);

  const startScan = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setScanMessage("Perangkat Anda tidak mendukung kamera. Silakan gunakan input manual jika perlu.");
      return;
    }
    setScanMessage("Mencari QR... arahkan kamera ke QR kode tamu.");
    setCameraActive(true);
    setIsScanning(true);
    setScannedPayload(null);
  };

  const markAsCheckedIn = () => {
    if (!scannedPayload) return;
    const payload = scannedPayload.payload;
    const entry = buildCheckinEntry(payload);
    const updated = [...checkinList.filter((item) => item.guestId !== payload.guestId), entry];
    saveCheckinList(updated);
    setScannedPayload({ payload, alreadyCheckedIn: true });
    setScanMessage("Tamu ditandai hadir dan tersimpan di daftar check-in.");
  };

  const copyBlastLinks = async () => {
    const text = guestBlastRows.map((item) => item.whatsappLink).join("\n");
    await navigator.clipboard.writeText(text);
    setScanMessage("Semua link WA blast sudah disalin.");
  };

  return (
    <main className="min-h-screen bg-olive-dark text-text-light py-12 px-4">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-gold-warm/30 bg-olive-dark/80 p-8 shadow-2xl">
          <h1 className="t2 text-gold-warm mb-4">Admin Check-in & Blast</h1>
          <p className="t5 mb-4 text-text-light/80">
            Import CSV tamu, generate link undangan personal, dan scan QR di pintu masuk.
          </p>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <label className="block text-text-light/70 mb-2">
                CSV Tamu (header: guestId, name, phone)
              </label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsvUpload}
                className="block w-full rounded-lg border border-gold-warm/30 bg-olive-dark/90 px-3 py-2 text-text-light"
              />
              <p className="mt-2 text-xs text-text-light/60">
                Upload CSV baru akan menimpa (replace) data tamu yang sudah ada sebelumnya.
              </p>
            </div>

            <div className="rounded-2xl border border-gold-warm/20 bg-black/15 p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="t5 text-text-light/80">Status Import</span>
                <div className="flex gap-2">
                  <span className="rounded-full bg-gold-warm/20 px-3 py-1 text-[0.85rem] text-gold-warm">{guestList.length} tamu</span>
                  <span className={`rounded-full px-3 py-1 text-[0.85rem] ${
                    syncStatus === "ok" ? "bg-emerald-500/20 text-emerald-400" :
                    syncStatus === "syncing" ? "bg-blue-500/20 text-blue-400" :
                    syncStatus === "error" ? "bg-red-500/20 text-red-400" :
                    "bg-white/10 text-text-light/40"
                  }`}>
                    {syncStatus === "ok" ? "● Tersinkron" :
                     syncStatus === "syncing" ? "● Menyinkron..." :
                     syncStatus === "error" ? "● Gagal sinkron" :
                     "● Lokal"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-text-light/70">{scanMessage}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            {/* Grup: Kirim Undangan */}
            <div className="rounded-2xl border border-gold-warm/20 bg-black/10 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-warm/60">Kirim Undangan</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl bg-gold-warm px-5 py-3 text-center text-olive-dark font-medium transition hover:bg-gold-warm/90"
                  onClick={copyBlastLinks}
                >
                  Salin Semua Link WA
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gold-warm/40 px-5 py-3 text-center text-text-light transition hover:bg-white/5"
                  onClick={handleOpenAllWhatsApp}
                >
                  Buka Semua Chat WA
                </button>
              </div>
            </div>

            {/* Grup: Unduh Data */}
            <div className="rounded-2xl border border-gold-warm/20 bg-black/10 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-warm/60">Unduh Data</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border border-gold-warm/40 px-5 py-3 text-center text-text-light transition hover:bg-white/5"
                  onClick={handleDownloadGuestCsv}
                >
                  Unduh Daftar Tamu (.csv)
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gold-warm/40 px-5 py-3 text-center text-text-light transition hover:bg-white/5"
                  onClick={handleDownloadBlastCsv}
                >
                  Unduh Link WA Blast (.csv)
                </button>
              </div>
            </div>

            {/* Grup: Sinkronisasi */}
            <div className="rounded-2xl border border-blue-500/20 bg-black/10 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-400/60">Sinkronisasi Antar Perangkat</p>
              <p className="mb-3 text-xs text-text-light/40">Kirim data ke cloud agar bisa diakses di HP/laptop lain</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border border-blue-500/40 px-5 py-3 text-center text-blue-400 transition hover:bg-blue-500/10"
                  onClick={async () => {
                    const { isRemoteEnabled, saveAllRemote } = await import("@/lib/firebase-sync");
                    if (!isRemoteEnabled()) return setScanMessage("Firebase belum dikonfigurasi.");
                    setSyncStatus("syncing");
                    try {
                      await saveAllRemote({ guestList, checkinList, rsvpList: JSON.parse(localStorage.getItem("wedding_rsvp") || "[]") });
                      setSyncStatus("ok");
                      setScanMessage("Data berhasil dikirim ke cloud.");
                    } catch {
                      setSyncStatus("error");
                      setScanMessage("Gagal kirim ke cloud. Cek koneksi internet.");
                    }
                  }}
                >
                  ↑ Kirim ke Cloud
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-blue-500/40 px-5 py-3 text-center text-blue-400 transition hover:bg-blue-500/10"
                  onClick={async () => {
                    const { isRemoteEnabled, loadAllRemote } = await import("@/lib/firebase-sync");
                    if (!isRemoteEnabled()) return setScanMessage("Firebase belum dikonfigurasi.");
                    setSyncStatus("syncing");
                    try {
                      const data = await loadAllRemote();
                      if (data) {
                        if (data.guestList) { localStorage.setItem(STORAGE_KEYS.guestList, JSON.stringify(data.guestList)); setGuestList(data.guestList); }
                        if (data.checkinList) { localStorage.setItem(STORAGE_KEYS.checkinList, JSON.stringify(data.checkinList)); setCheckinList(data.checkinList); }
                        if (data.rsvpList) { localStorage.setItem("wedding_rsvp", JSON.stringify(data.rsvpList)); window.dispatchEvent(new Event("rsvp_updated")); }
                        setSyncStatus("ok");
                        setScanMessage("Data berhasil diambil dari cloud.");
                      } else {
                        setSyncStatus("idle");
                        setScanMessage("Belum ada data di cloud.");
                      }
                    } catch {
                      setSyncStatus("error");
                      setScanMessage("Gagal ambil dari cloud. Cek koneksi internet.");
                    }
                  }}
                >
                  ↓ Ambil dari Cloud
                </button>
              </div>
            </div>

            {/* Grup: Zona Berbahaya */}
            <div className="rounded-2xl border border-red-500/20 bg-black/10 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-red-400/60">Hapus Data</p>
              <p className="mb-3 text-xs text-text-light/40">Tindakan ini tidak dapat dibatalkan</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border border-red-500/40 px-5 py-3 text-center text-red-400 transition hover:bg-red-500/10"
                  onClick={clearGuestList}
                >
                  Hapus Semua Data Tamu
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-500/40 px-5 py-3 text-center text-red-400 transition hover:bg-red-500/10"
                  onClick={clearRsvpData}
                >
                  Hapus Ucapan & Doa
                </button>
              </div>
            </div>

          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-gold-warm/20 bg-black/10 p-8">
            <h2 className="t3 text-gold-warm mb-4">Daftar Tamu</h2>
            <div className="overflow-x-auto rounded-3xl border border-gold-warm/10 bg-olive-dark/80">
              <table className="min-w-full divide-y divide-gold-warm/15 text-sm text-text-light">
                <thead className="bg-olive-dark/90 text-left text-text-light/80">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">HP</th>
                    <th className="px-4 py-3">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-warm/10 bg-black/10">
                  {guestList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-text-light/60">
                        Belum ada data tamu.
                      </td>
                    </tr>
                  ) : (
                    guestList.map((guest) => (
                      <tr key={guest.guestId}>
                        <td className="px-4 py-3 align-top text-text-light/70">{guest.guestId.slice(0, 8)}</td>
                        <td className="px-4 py-3 align-top">{guest.name}</td>
                        <td className="px-4 py-3 align-top">{guest.phone}</td>
                        <td className="px-4 py-3 align-top">
                          <a
                            href={createGuestLink(guest)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold-warm underline"
                          >
                            buka
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-gold-warm/20 bg-black/10 p-8">
            <h2 className="t3 text-gold-warm mb-4">Scan QR & Check-in</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="rounded-full bg-gold-warm px-5 py-3 text-olive-dark transition hover:bg-gold-warm/90"
                  onClick={startScan}
                >
                  START SCAN
                </button>
                <button
                  type="button"
                  className="rounded-full border border-gold-warm/50 px-5 py-3 text-text-light transition hover:bg-white/5"
                  onClick={stopCamera}
                >
                  STOP CAMERA
                </button>
              </div>

              <div className="rounded-3xl border border-gold-warm/10 bg-olive-dark/80 p-4">
                <p className="text-text-light/70 mb-3">{scanMessage}</p>
                {cameraActive ? (
                  <video ref={videoRef} className="h-64 w-full rounded-3xl bg-black object-cover" muted playsInline />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-gold-warm/30 bg-black/10 text-text-light/60">
                    Kamera belum aktif.
                  </div>
                )}
              </div>

              {scannedPayload ? (
                <div className="rounded-3xl border border-gold-warm/20 bg-black/10 p-5">
                  <div className="grid gap-3">
                    <div>
                      <div className="text-text-light/60 text-sm">Nama</div>
                      <div className="text-text-light font-medium">{scannedPayload.payload.guestName}</div>
                    </div>
                    <div>
                      <div className="text-text-light/60 text-sm">Nomor HP</div>
                      <div className="text-text-light font-medium">{scannedPayload.payload.phone}</div>
                    </div>
                    <div>
                      <div className="text-text-light/60 text-sm">Status RSVP</div>
                      <div className="text-text-light font-medium">{scannedPayload.payload.attendance}</div>
                    </div>
                    <div>
                      <div className="text-text-light/60 text-sm">Jumlah Tamu</div>
                      <div className="text-text-light font-medium">{scannedPayload.payload.guests}</div>
                    </div>
                    <div>
                      <div className="text-text-light/60 text-sm">Check-in</div>
                      <div className={`font-medium ${scannedPayload.alreadyCheckedIn ? "text-emerald-300" : "text-gold-warm"}`}>
                        {scannedPayload.alreadyCheckedIn ? "Sudah Hadir" : "Belum Hadir"}
                      </div>
                    </div>
                    {!scannedPayload.alreadyCheckedIn ? (
                      <button
                        type="button"
                        className="mt-3 rounded-full bg-gold-warm px-5 py-3 text-olive-dark transition hover:bg-gold-warm/90"
                        onClick={markAsCheckedIn}
                      >
                        Tandai Hadir
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gold-warm/20 bg-black/10 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="t3 text-gold-warm">Daftar Check-in</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-full border border-gold-warm/50 px-5 py-3 text-text-light transition hover:bg-white/5"
                onClick={handleDownloadCheckinCsv}
              >
                Export Check-in CSV
              </button>
              <button
                type="button"
                className="rounded-full border border-red-500/50 px-5 py-3 text-red-500 transition hover:bg-red-500/10"
                onClick={clearAllCheckinData}
              >
                Reset Semua Kehadiran
              </button>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto rounded-3xl border border-gold-warm/10 bg-olive-dark/80">
            <table className="min-w-full divide-y divide-gold-warm/15 text-sm text-text-light">
              <thead className="bg-olive-dark/90 text-left text-text-light/80">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">HP</th>
                  <th className="px-4 py-3">Kehadiran</th>
                  <th className="px-4 py-3">Tamu</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-warm/10 bg-black/10">
                {checkinList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-text-light/60">
                      Belum ada check-in.
                    </td>
                  </tr>
                ) : (
                  checkinList.map((entry) => (
                    <tr key={entry.guestId}>
                      <td className="px-4 py-3">{entry.guestName}</td>
                      <td className="px-4 py-3">{entry.phone}</td>
                      <td className="px-4 py-3">{entry.attendance}</td>
                      <td className="px-4 py-3">{entry.guests}</td>
                      <td className="px-4 py-3">{new Date(entry.checkedInAt).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-400 transition text-sm"
                          onClick={() => deleteCheckinEntry(entry.guestId)}
                          title="Hapus data check-in ini"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
