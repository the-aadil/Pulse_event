"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useActionState } from "react";
import { uploadOwnerPhoto } from "@/app/actions";
import type { ActionResult } from "@/app/actions";

const INITIAL_STATE: ActionResult = { status: "idle" };
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;
const CROP_SIZE = 600;

/* ── Crop Modal ─────────────────────────────────────────────────────────── */

function CropModal({
  src,
  onConfirm,
  onCancel,
}: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [containerSize, setContainerSize] = useState(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fitScale = containerSize > 0 && imgNatural.w > 0
    ? Math.min(containerSize / imgNatural.w, containerSize / imgNatural.h)
    : 1;

  const displayW = imgNatural.w * fitScale;
  const displayH = imgNatural.h * fitScale;

  /* Center image when it loads */
  const onImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    setImgNatural({ w: natW, h: natH });
    setReady(true);
  }, []);

  /* Re-center when container resizes */
  useEffect(() => {
    if (!ready) return;
    setOffset({ x: 0, y: 0 });
  }, [ready, containerSize]);

  const maxDragX = Math.max(0, (displayW - containerSize) / 2);
  const maxDragY = Math.max(0, (displayH - containerSize) / 2);

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    /* Capture on the CONTAINER so move/up events always reach us */
    containerRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({
      x: clamp(prev.x + dx, -maxDragX, maxDragX),
      y: clamp(prev.y + dy, -maxDragY, maxDragY),
    }));
  }, [maxDragX, maxDragY]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  /* Draw the cropped region from the original image onto a canvas */
  const handleConfirm = useCallback(() => {
    const img = imgRef.current;
    if (!img || !ready) return;

    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /*
     * The container is a square crop circle.
     * The visible area inside the circle is `containerSize x containerSize`.
     * The image is centered in the container, then shifted by `offset`.
     *
     * Image top-left in container coords:
     *   imgX = (containerSize - displayW) / 2 + offset.x
     *   imgY = (containerSize - displayH) / 2 + offset.y
     *
     * The crop picks the CENTER `containerSize x containerSize` area.
     * So the source rect origin in image-pixels is:
     *   srcX = ((containerSize - displayW) / 2 + offset.x - (containerSize - displayW) / 2) / fitScale
     *        = offset.x / fitScale
     *   (same for Y)
     *
     * And the source rect size in image-pixels is:
     *   srcDim = containerSize / fitScale
     */
    const srcSize = containerSize / fitScale;
    const srcX = imgNatural.w / 2 - srcSize / 2 - offset.x / fitScale;
    const srcY = imgNatural.h / 2 - srcSize / 2 - offset.y / fitScale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, CROP_SIZE, CROP_SIZE);

    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/webp",
      0.82
    );
  }, [containerSize, offset, displayW, displayH, fitScale, imgNatural, ready, onConfirm]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="mx-4 w-full max-w-lg rounded-2xl border border-gold-500/30 bg-[#12141c] p-6 shadow-2xl">
        <h3 className="text-base font-bold text-slate-100">Crop your photo</h3>
        <p className="mt-1 text-sm text-slate-400">Drag to position the image inside the circle, then confirm.</p>

        <div
          ref={containerRef}
          className="relative mx-auto mt-4 aspect-square w-full max-w-[300px] overflow-hidden rounded-full border-2 border-gold-500/40 bg-[#0b0c10] touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: dragging.current ? "grabbing" : "grab" }}
        >
          <img
            ref={imgRef}
            src={src}
            alt="Crop preview"
            onLoad={onImgLoad}
            draggable={false}
            className="pointer-events-none absolute top-0 left-0 select-none"
            style={{
              width: displayW || "100%",
              height: displayH || "100%",
              transform: `translate(${containerSize / 2 - displayW / 2 + offset.x}px, ${containerSize / 2 - displayH / 2 + offset.y}px)`,
              opacity: ready ? 1 : 0,
            }}
          />

          {/* Visual guides */}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-inset ring-gold-400/50" />
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]" />
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gold-500/30 bg-[#181a24] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-gold-400 hover:text-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!ready}
            className="rounded-md border border-gold-400 bg-gradient-to-r from-gold-500 to-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:from-gold-400 hover:to-amber-300 disabled:opacity-50"
          >
            Confirm crop
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export function OwnerPhotoUpload({ currentSrc }: { currentSrc: string | null }) {
  const [state, formAction, pending] = useActionState(uploadOwnerPhoto, INITIAL_STATE);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const busy = pending || isPending;

  const uploadResult = state.data as { src?: string } | undefined;
  const displaySrc =
    state.status === "success" && uploadResult?.src
      ? uploadResult.src
      : preview ?? currentSrc;

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type "${file.type || "unknown"}". Accepted: JPEG, PNG, WebP.`;
    }
    if (file.size > MAX_SIZE) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return `File is ${mb} MB — exceeds the 2 MB limit. Compress or resize the image first.`;
    }
    return null;
  }, []);

  const uploadBlob = useCallback((blob: Blob) => {
    const file = new File([blob], "owner-profile.webp", { type: "image/webp" });
    const fd = new FormData();
    fd.append("photo", file);
    startTransition(() => {
      formAction(fd);
    });
  }, [formAction]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
    if (inputRef.current) inputRef.current.value = "";
  }, [validateFile]);

  const handleCropConfirm = useCallback((blob: Blob) => {
    setCropSrc(null);
    const objectUrl = URL.createObjectURL(blob);
    setPreview(objectUrl);
    uploadBlob(blob);
  }, [uploadBlob]);

  const handleCropCancel = useCallback(() => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }, [cropSrc]);

  const handleRemovePreview = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  return (
    <div className="admin-card p-6">
      <h2 className="text-base font-bold text-slate-100">Owner Photo</h2>
      <p className="mt-1 text-sm text-slate-400">
        This photo appears on the About page. Select, crop, and upload.
      </p>
      <div className="admin-gold-rule mt-4" />

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        {/* Preview */}
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-gold-500/40 bg-[#181a24] shadow-lg">
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt="Owner photo"
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500/30"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="text-[10px] font-medium text-gold-500/40">No photo</span>
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
              <span className="text-[10px] font-medium text-gold-300">Uploading...</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <label
            htmlFor="owner-photo-input"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gold-500/30 bg-[#12141c] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-gold-400 hover:text-slate-100"
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
          <p className="text-xs text-slate-500">JPEG, PNG, or WebP. Max 2 MB.</p>

          {displaySrc && !busy && (
            <button
              type="button"
              onClick={handleRemovePreview}
              className="text-xs font-medium text-red-400/80 transition-colors hover:text-red-300"
            >
              Remove current photo
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-red-500/10 px-3 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-red-400"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      {state.status === "error" && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-red-500/10 px-3 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-red-400"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <div className="text-sm text-red-300">
            <p className="font-medium">Upload failed</p>
            <p className="mt-0.5 text-red-300/80">{state.message}</p>
          </div>
        </div>
      )}
      {state.status === "success" && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-emerald-500/10 px-3 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div className="text-sm text-emerald-300">
            <p className="font-medium">Photo updated</p>
            <p className="mt-0.5 text-emerald-300/80">{state.message}</p>
          </div>
        </div>
      )}

      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
