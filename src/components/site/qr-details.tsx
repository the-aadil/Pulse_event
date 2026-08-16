"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { SITE_CONFIG } from "@/lib/config";

interface PureShinyGoldenQRProps {
  url: string;
  label: string;
  size?: number;
}

export function PureShinyGoldenQR({ url, label, size = 115 }: PureShinyGoldenQRProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 1,
      color: {
        dark: "#f5c542", // Vivid Metallic Golden Yellow for high contrast on black
        light: "#0a0a0a", // Deep Black Background
      },
      errorCorrectionLevel: "M",
    })
      .then((data) => setDataUrl(data))
      .catch((err) => console.error("QR error", err));
  }, [url, size]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
      title={`Open ${label}`}
    >
      {/* Black Background Container with Golden QR modules */}
      <div className="bg-[#0a0a0a] p-2.5 rounded-xl shadow-md">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`${label} Golden QR Code`}
            style={{ width: size, height: size }}
            className="block rounded object-contain"
          />
        ) : (
          <div
            className="animate-pulse bg-neutral-900 rounded"
            style={{ width: size, height: size }}
          />
        )}
      </div>

      <span className="text-xs font-bold tracking-wider text-gold-600 group-hover:text-gold-400 transition-colors">
        {label}
      </span>
    </a>
  );
}

export function QRSection() {
  return (
    <div className="flex items-center justify-center gap-8 py-2">
      <PureShinyGoldenQR label="WhatsApp" url={SITE_CONFIG.socials.whatsapp} size={115} />
      <PureShinyGoldenQR label="Instagram" url={SITE_CONFIG.socials.instagram} size={115} />
    </div>
  );
}
