"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useActionState } from "react";
import { uploadOwnerPhoto } from "@/app/actions";
import type { ActionResult } from "@/app/actions";

const INITIAL_STATE: ActionResult = { status: "idle" };

function compressOwnerPhoto(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => {
      const img = document.createElement("img");
      img.onerror = () => reject(new Error("Failed to decode image."));
      img.onload = () => {
        const MAX_WIDTH = 600;
        const ratio = Math.min(1, MAX_WIDTH / img.naturalWidth);
        const w = Math.round(img.naturalWidth * ratio);
        const h = Math.round(img.naturalHeight * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable."));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed."))),
          "image/webp",
          0.82
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function OwnerPhotoUpload({ currentSrc }: { currentSrc: string | null }) {
  const [state, formAction, pending] = useActionState(uploadOwnerPhoto, INITIAL_STATE);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const busy = pending || isPending;

  const uploadResult = state.data as { src?: string } | undefined;
  const displaySrc =
    state.status === "success" && uploadResult?.src
      ? uploadResult.src
      : preview ?? currentSrc;

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const compressed = await compressOwnerPhoto(file);
      const compressedFile = new File([compressed], "owner-profile.webp", {
        type: "image/webp",
      });

      const fd = new FormData();
      fd.append("photo", compressedFile);
      startTransition(() => {
        formAction(fd);
      });
    } catch {
      setError("Failed to compress image. Please try another file.");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }, [formAction]);

  return (
    <div className="admin-card p-6">
      <h2 className="text-base font-bold text-slate-100">Owner Photo</h2>
      <p className="mt-1 text-sm text-slate-400">
        This photo appears on the About page. Uploaded image is compressed to WebP automatically.
      </p>
      <div className="admin-gold-rule mt-4" />

      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-gold-500/40 bg-[#181a24]">
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt="Owner photo"
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-gold-500/40">
              ?
            </span>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <label
            htmlFor="owner-photo-input"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gold-500/30 bg-[#12141c] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-gold-400 hover:text-slate-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            {displaySrc ? "Change photo" : "Upload photo"}
          </label>
          <input
            ref={inputRef}
            id="owner-photo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            disabled={busy}
          />
          <p className="mt-2 text-xs text-slate-500">JPEG, PNG, or WebP. Max 2 MB.</p>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}
      {state.status === "error" && (
        <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="mt-3 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {state.message}
        </p>
      )}
    </div>
  );
}
