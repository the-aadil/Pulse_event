"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";
import { CloseIcon, ArrowRightIcon, ArrowLeftIcon } from "@/components/icons";

export function GalleryLightbox({
  item,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#0b0c10]/95 p-4 backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-cream/70">
          <span className="font-semibold text-cream">{item.category}</span> · {index + 1} / {total}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-cream/20 text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Close image viewer"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-4">
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-[#0b0c10]/60 text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Previous image"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="relative h-[70vh] h-[70dvh] w-full max-w-4xl">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-contain"
            priority
          />
        </div>
        <button
          type="button"
          onClick={onNext}
          className="absolute right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 bg-[#0b0c10]/60 text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
          aria-label="Next image"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <p className="mx-auto max-w-2xl text-center text-sm text-cream/70">
        {item.alt}
      </p>
    </div>
  );
}
