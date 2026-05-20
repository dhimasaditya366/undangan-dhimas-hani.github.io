"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  className?: string;
};

export const QRCodeFromString = ({ value, className = "" }: Props) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, { errorCorrectionLevel: "H" })
      .then((dataUrl) => setSrc(dataUrl))
      .catch(() => setSrc(""));
  }, [value]);

  if (!src) {
    return <div className={`rounded-xl bg-white/10 border border-gold-warm/30 p-8 text-center ${className}`}>Membuat QR...</div>;
  }

  return <img src={src} alt="QR Code Undangan" className={`rounded-xl bg-white/90 shadow-lg ${className}`} />;
};
