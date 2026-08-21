"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useActionState } from "react";
import { uploadOwnerPhoto } from "@/app/actions";
import type { ActionResult } from "@/app/actions";

const INITIAL_STATE: ActionResult = { status: "idle" };
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;
const CROP_SIZE = 600;

import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;

    // Load the image to draw it onto the canvas
    const img = new window.Image();
    img.src = src;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      CROP_SIZE,
      CROP_SIZE
    );

    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
      },
      "image/webp",
      0.82
    );
  }, [croppedAreaPixels, src, onConfirm]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="mx-4 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gold-500/30 bg-[#12141c] shadow-2xl">
        <div className="p-5 pb-3">
          <h3 className="text-base font-bold text-slate-100">Crop your photo</h3>
          <p className="mt-1 text-sm text-slate-400">
            Drag to position. Pinch or scroll to zoom.
          </p>
        </div>

        <div className="relative h-72 w-full bg-black sm:h-80">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { background: "transparent" },
              cropAreaStyle: { border: "2px solid rgba(212, 175, 55, 0.5)" },
            }}
          />
        </div>

        <div className="p-5 pt-4">
          <div className="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-gold-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </div>

          <div className="flex items-center justify-end gap-3">
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
              className="rounded-md border border-gold-400 bg-gradient-to-r from-gold-500 to-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:from-gold-400 hover:to-amber-300"
            >
              Confirm crop
            </button>
          </div>
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
            // Use native <img> — Next.js <Image> does not support data: or blob: URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displaySrc}
              alt="Owner photo"
              className="absolute inset-0 h-full w-full object-cover"
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
