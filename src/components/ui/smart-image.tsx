"use client";

import { useCallback, useState, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { CameraIcon } from "@/components/icons";

/**
 * Tiny brand-matched gradient (dark navy -> deep gold) used as the blur-up
 * placeholder for every optimized image, so frames never sit empty.
 */
export const IMAGE_BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADdSURBVDhPndHJEoIwEARQ7rIEkH1VRP3/Hxx7gkNRqSRaHPr4uqdqgkuoKESiaEscK0oSRQpJlaKMkyrKkWuWUJEnVCLVdUsQGlBjIMEbPOAvrJGmQIFtVeN9Ve2rOwZk3JYocK3aTubVI+4qFPhWbSczFNzXKPi1ap7MULAu+GfVhgdOg4Izq4xH4IkLXO9xYiDBc4sC13tcqxoDMr51KJBVLzZWBd97FLje41tlyFmGmIIzqwvyAOYEJpb3+FYZrshzRIHtZF418XF1BWT8mlDgOpnhjo1Vwe85pg/m7D2xhigkmAAAAABJRU5ErkJggg==";

type LoadStatus = "loading" | "loaded" | "error";

type SmartImageProps = Omit<ImageProps, "onLoad" | "onError" | "alt"> & {
  alt: string;
  /** Classes for the positioning wrapper around the img element. */
  wrapperClassName?: string;
  /** Loading affordance painted over the blurred image. */
  indicator?: "shimmer" | "none";
  /** Replaces the image entirely when loading fails. */
  fallback?: ReactNode;
};

/**
 * next/image with an elegant loading experience built in:
 *
 *  1. The browser immediately paints a stretched, blurred brand-gradient
 *     placeholder (next/image `placeholder="blur"`), so every frame has the
 *     correct size and tone from the first paint.
 *  2. A subtle gold shimmer sweeps over it while the real image decodes.
 *  3. The shimmer disappears the moment pixels are ready - cached images are
 *     detected via a completeness check in the ref callback so they never
 *     flash the shimmer at all.
 *
 * The img element itself is never hidden: hiding it would also hide the blur
 * placeholder. Overlays fade away instead.
 */
export function SmartImage({
  alt,
  wrapperClassName,
  indicator = "shimmer",
  fallback,
  placeholder = "blur",
  blurDataURL = IMAGE_BLUR_PLACEHOLDER,
  className,
  ...imgProps
}: SmartImageProps) {
  const [status, setStatus] = useState<LoadStatus>("loading");

  // Cached images can finish decoding before React attaches onLoad; the ref
  // callback catches that race so the shimmer never flashes for them.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, []);

  const handleLoad = useCallback(() => setStatus("loaded"), []);
  const handleError = useCallback(() => setStatus("error"), []);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        imgProps.fill && "absolute inset-0",
        wrapperClassName
      )}
    >
      <Image
        {...imgProps}
        alt={alt}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={className}
        ref={imgRef}
        onLoad={handleLoad}
        onError={handleError}
        draggable={false}
      />

      {status === "loading" && indicator === "shimmer" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden bg-[#12141c]"
        >
          <div className="absolute inset-0 animate-pulse bg-white/[0.02]" />
          <div className="animate-lb-shimmer absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gold-400/[0.05] to-transparent" />
          <span className="relative z-10 inline-flex h-6 w-6 animate-spin rounded-full border-2 border-gold-400/20 border-t-gold-400 motion-reduce:animate-none" />
        </div>
      )}

      {status === "error" &&
        (fallback ?? (
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2 bg-[#12141c] text-center">
            <CameraIcon className="h-6 w-6 text-gold-400/50" aria-hidden="true" />
            <p className="px-3 text-xs text-cream/40">Photo unavailable</p>
          </div>
        ))}
    </div>
  );
}
