"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  className?: string;
  downloadName?: string;
  onDataUrl?: (url: string) => void;
};

export const QRCodeFromString = ({ value, className = "", downloadName, onDataUrl }: Props) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, { errorCorrectionLevel: "H", width: 512, margin: 2 })
      .then((dataUrl) => {
        setSrc(dataUrl);
        onDataUrl?.(dataUrl);
      })
      .catch(() => setSrc(""));
  }, [value]);

  const handleDownload = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = `${downloadName ?? "qr-undangan"}.png`;
    a.click();
  };

  if (!src) {
    return <div className={`rounded-xl bg-white/10 border border-gold-warm/30 p-8 text-center ${className}`}>Membuat QR...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img src={src} alt="QR Code Undangan" className={`rounded-xl bg-white/90 shadow-lg ${className}`} />
      {downloadName !== undefined && (
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-full border border-gold-warm/50 px-5 py-2 text-sm text-gold-warm hover:bg-gold-warm/10 transition"
        >
          ⬇ Simpan QR ke Galeri
        </button>
      )}
    </div>
  );
};
