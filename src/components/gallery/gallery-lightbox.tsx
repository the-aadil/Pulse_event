"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent as ReactSyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";
import { IMAGE_BLUR_PLACEHOLDER } from "@/components/ui/smart-image";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  ExpandIcon,
  MinusIcon,
  PlusIcon,
  ShrinkIcon,
} from "@/components/icons";

/* ---------------------------------------------------------------------------
 * Gesture constants
 * ------------------------------------------------------------------------- */
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const BUTTON_SCALE_STEP = 1.5;
const WHEEL_ZOOM_INTENSITY = 0.0022;
const TRACKPAD_PINCH_INTENSITY = 0.01;
const DOUBLE_TAP_WINDOW_MS = 300;
const DOUBLE_TAP_SLOP_PX = 40;
const TAP_SLOP_PX = 6;
const SWIPE_THRESHOLD_PX = 60;
const ZOOMED_CURSOR_CLASS = "cursor-grab";
const HI_RES_TRIGGER_SCALE = 1.3;

type Transform = { scale: number; x: number; y: number };

type PointerTrack = { x: number; y: number };

type GestureState = {
  pointers: Map<number, PointerTrack>;
  /** Incremental reference frame for pinch math. */
  pinchPrev: {
    dist: number;
    midX: number;
    midY: number;
    midXRel: number;
    midYRel: number;
  } | null;
  panStart: { px: number; py: number; tx: number; ty: number } | null;
  /** True while any multi-pointer or pressed interaction is live. */
  interacting: boolean;
  /** Accumulated movement of the current press, to distinguish taps from drags. */
  movedPx: number;
  lastTap: { t: number; x: number; y: number } | null;
  singleTapTimeout?: number;
};

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

type LoadStatus = "loading" | "loaded" | "error";

/**
 * The lightbox photo with an elegant loading experience:
 *  - Gold shimmer sweep + spinner skeleton while the full-size image decodes
 *  - 500ms fade-in once ready (cached images resolve instantly via a
 *    completeness check in the ref callback, so they never flash the skeleton)
 *  - Friendly error card with retry if the fetch fails
 *
 * State lives here (not in the parent) and the component is keyed by src,
 * so switching photos resets it without any effects.
 */
function StageImage({
  src,
  alt,
  sizes,
  blurDataURL,
  onAspectReady,
}: {
  src: string;
  alt: string;
  sizes: string;
  blurDataURL: string;
  onAspectReady: (aspect: number) => void;
}) {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [attempt, setAttempt] = useState(0);

  const reportMetrics = useCallback(
    (img: HTMLImageElement) => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        onAspectReady(img.naturalWidth / img.naturalHeight);
      }
    },
    [onAspectReady]
  );

  // Cached images can finish decoding before React attaches onLoad; the ref
  // callback catches that race so the skeleton never flashes for them.
  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node && node.complete && node.naturalWidth > 0) {
        setStatus("loaded");
        reportMetrics(node);
      }
    },
    [reportMetrics]
  );

  const handleLoad = useCallback(
    (event: ReactSyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      reportMetrics(event.currentTarget);
    },
    [reportMetrics]
  );

  const handleError = useCallback(() => setStatus("error"), []);

  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Always visible: paints the blurred brand placeholder instantly, then
          the real pixels. Hiding it would hide the blur-up too, so loading
          state is expressed by the overlay below instead of opacity. */}
      <Image
        key={`${src}#${attempt}`}
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload
        placeholder="blur"
        blurDataURL={blurDataURL}
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
        className="object-contain"
      />

      {status === "loading" && (
        <div
          role="status"
          aria-label="Loading image"
          className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#12141c]/70" aria-hidden="true">
            <div className="animate-lb-shimmer absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gold-400/[0.08] to-transparent" />
          </div>
          <span
            aria-hidden="true"
            className="relative inline-flex h-12 w-12 animate-spin rounded-full border-2 border-gold-400/20 border-t-gold-400 motion-reduce:animate-none"
          />
          <p className="relative text-xs font-medium uppercase tracking-[0.35em] text-cream/40">
            Loading
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <AlertTriangleIcon className="h-9 w-9 text-gold-400/70" aria-hidden="true" />
          <p className="text-sm text-cream/60">
            This image couldn&apos;t be loaded.
          </p>
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-10 items-center justify-center rounded-md border border-gold-500/40 px-4 text-sm font-medium text-gold-400 transition-colors hover:border-gold-400 hover:bg-gold-500/10 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ---------------------------------------------------------------------------
 * GalleryLightbox
 *
 * Full-screen viewer with:
 *  - Anchor-point zoom (wheel, trackpad pinch, buttons, double tap/click)
 *  - Multi-touch pinch-zoom + drag-to-pan with photo-edge clamping
 *  - Horizontal swipe navigation at 1x
 *  - Native Fullscreen API with an immersive fallback for unsupported devices
 *
 * Performance model: transforms and the zoom read-out are written straight to
 * the DOM inside requestAnimationFrame, so gestures never trigger React
 * re-renders. React state only tracks discrete UI facts (bounds reached,
 * fullscreen mode, hi-res request tier).
 * ------------------------------------------------------------------------- */
export function GalleryLightbox({
  item,
  index,
  total,
  onClose,
  onNext,
  onPrev,
  nextSrc,
  prevSrc,
  initialBlurDataURL,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  nextSrc?: string;
  prevSrc?: string;
  /** Tiny snapshot of the clicked grid thumbnail, painted as the blur-up
   * placeholder while the full-size image loads. */
  initialBlurDataURL?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const zoomBadgeRef = useRef<HTMLSpanElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const transformRef = useRef<Transform>({ scale: 1, x: 0, y: 0 });
  const gestureRef = useRef<GestureState>({
    pointers: new Map(),
    pinchPrev: null,
    panStart: null,
    interacting: false,
    movedPx: 0,
    lastTap: null,
  });
  const rafRef = useRef(0);
  const photoAspectRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const suppressBackdropClickUntilRef = useRef(0);
  /** Captured once: the thumbnail snapshot is only valid for the photo that
   * was clicked, never for images reached via navigation. */
  const [openedSrc] = useState(item.src);

  const [uiScale, setUiScale] = useState(1);
  const [grabbing, setGrabbing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [hiRes, setHiRes] = useState(false);

  /* -----------------------------------------------------------------------
   * Transform plumbing
   * --------------------------------------------------------------------- */

  const syncUi = useCallback((scale: number) => {
    setUiScale(scale);
    if (scale > HI_RES_TRIGGER_SCALE) {
      setHiRes(true);
    }
  }, []);

  /**
   * Clamp the translation so the rendered photo never detaches from the
   * stage. Uses the photo's intrinsic aspect ratio (not the layer box), so
   * letterboxing from object-contain is respected exactly.
   */
  const clampTransform = useCallback((t: Transform): Transform => {
    const stage = stageRef.current;
    if (!stage) return t;

    let photoW = stage.clientWidth;
    let photoH = stage.clientHeight;
    const aspect = photoAspectRef.current;
    if (aspect && Number.isFinite(aspect) && aspect > 0) {
      if (photoW / photoH > aspect) {
        photoW = photoH * aspect;
      } else {
        photoH = photoW / aspect;
      }
    }

    const maxX = Math.max(0, (photoW * t.scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (photoH * t.scale - stage.clientHeight) / 2);

    return {
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale)),
      x: Math.min(maxX, Math.max(-maxX, t.x)),
      y: Math.min(maxY, Math.max(-maxY, t.y)),
    };
  }, []);

  const writeTransform = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const t = transformRef.current;
    layer.style.transform = `translate3d(${t.x.toFixed(2)}px, ${t.y.toFixed(2)}px, 0) scale(${t.scale.toFixed(4)})`;
    const badge = zoomBadgeRef.current;
    if (badge) {
      badge.textContent = `${Math.round(t.scale * 100)}%`;
    }
  }, []);

  const scheduleWrite = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      writeTransform();
    });
  }, [writeTransform]);

  /** Programmatic, animated transform change (buttons, double-tap, reset). */
  const commitTransform = useCallback(
    (next: Transform, animate = true) => {
      const layer = layerRef.current;
      const clamped = clampTransform(next);
      transformRef.current = clamped;
      if (layer) {
        layer.style.transition =
          animate && !reducedMotionRef.current
            ? "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "none";
      }
      writeTransform();
      scheduleWrite();
      syncUi(clamped.scale);
    },
    [clampTransform, scheduleWrite, syncUi, writeTransform]
  );

  /**
   * Scale around a stage-relative anchor point (px, py measured from the
   * stage centre) such that the photo pixel under the anchor stays put:
   *   x' = ax - (ax - x) * (s'/s)
   */
  const zoomAtPoint = useCallback(
    (nextScale: number, anchorX = 0, anchorY = 0, animate = false) => {
      const cur = transformRef.current;
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
      if (scale === cur.scale) return;
      const ratio = scale / cur.scale;
      commitTransform(
        {
          scale,
          x: anchorX - (anchorX - cur.x) * ratio,
          y: anchorY - (anchorY - cur.y) * ratio,
        },
        animate
      );
    },
    [commitTransform]
  );

  const resetZoom = useCallback(() => {
    commitTransform({ scale: 1, x: 0, y: 0 });
  }, [commitTransform]);

  const zoomStep = useCallback(
    (direction: 1 | -1) => {
      const cur = transformRef.current.scale;
      const next =
        direction === 1
          ? Math.min(MAX_SCALE, cur * BUTTON_SCALE_STEP)
          : Math.max(MIN_SCALE, cur / BUTTON_SCALE_STEP);
      commitTransform({ scale: next, x: transformRef.current.x, y: transformRef.current.y });
    },
    [commitTransform]
  );

  /* -----------------------------------------------------------------------
   * Lifecycle: reset per image, preload neighbours, lock scroll, hotkeys
   * --------------------------------------------------------------------- */

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion();
    const layer = layerRef.current;
    if (layer) layer.style.transition = "none";
    transformRef.current = { scale: 1, x: 0, y: 0 };
    photoAspectRef.current = null;
    writeTransform();
    const raf = requestAnimationFrame(() => syncUi(1));
    return () => cancelAnimationFrame(raf);
  }, [item.src, syncUi, writeTransform]);

  useEffect(() => {
    const urls = [nextSrc, prevSrc].filter((src): src is string => Boolean(src));
    if (urls.length === 0) return;
    let cancelled = false;
    const timers = urls.map((src) =>
      window.setTimeout(() => {
        if (cancelled) return;
        const img = new window.Image();
        img.src = src;
      }, 400)
    );
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [nextSrc, prevSrc]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      const doc = document as FullscreenDocument;
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        const exit =
          doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc);
        if (exit) {
          Promise.resolve(exit()).catch(() => {});
        }
      }
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const overlay = overlayRef.current as FullscreenElement | null;
    const doc = document as FullscreenDocument;
    const active = doc.fullscreenElement ?? doc.webkitFullscreenElement;

    if (active) {
      try {
        await (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc);
      } catch {
        /* user-agent refused; immersive state stays consistent via listener */
      }
      return;
    }

    if (overlay && typeof overlay.requestFullscreen === "function") {
      try {
        await overlay.requestFullscreen();
        return;
      } catch {
        /* fall through to immersive mode (e.g. iOS Safari on iPhone) */
      }
    } else if (overlay && typeof overlay.webkitRequestFullscreen === "function") {
      try {
        await overlay.webkitRequestFullscreen();
        return;
      } catch {
        /* fall through to immersive mode */
      }
    }

    setImmersive((value) => !value);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as FullscreenDocument;
      const active = Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
      setIsFullscreen(active);
      if (!active) setImmersive(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const doc = document as FullscreenDocument;
      const nativeFullscreenActive = Boolean(
        doc.fullscreenElement ?? doc.webkitFullscreenElement
      );

      switch (event.key) {
        case "Escape":
          if (nativeFullscreenActive) return; // browser exits fullscreen; listener syncs state
          onClose();
          break;
        case "ArrowRight":
          event.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onPrev();
          break;
        case "+":
        case "=":
          event.preventDefault();
          zoomStep(1);
          break;
        case "-":
        case "_":
          event.preventDefault();
          zoomStep(-1);
          break;
        case "0":
          event.preventDefault();
          resetZoom();
          break;
        case "f":
        case "F":
          event.preventDefault();
          void toggleFullscreen();
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev, resetZoom, toggleFullscreen, zoomStep]);

  /** Minimal focus trap: keep Tab cycling inside the overlay. */
  const trapTab = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !overlayRef.current) return;
    const focusables = overlayRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)");
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  /* -----------------------------------------------------------------------
   * Geometry helpers
   * --------------------------------------------------------------------- */

  /** Stage-relative coordinates measured from the stage centre. */
  const relativePoint = useCallback((clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const rect = stage.getBoundingClientRect();
    return {
      x: clientX - (rect.left + rect.width / 2),
      y: clientY - (rect.top + rect.height / 2),
    };
  }, []);

  const handlePhotoAspect = useCallback(
    (aspect: number) => {
      photoAspectRef.current = aspect;
      transformRef.current = clampTransform(transformRef.current);
      scheduleWrite();
    },
    [clampTransform, scheduleWrite]
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      transformRef.current = clampTransform(transformRef.current);
      scheduleWrite();
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [clampTransform, scheduleWrite]);

  /* -----------------------------------------------------------------------
   * Pointer gestures: pan, pinch, double-tap, swipe-to-navigate
   * --------------------------------------------------------------------- */

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary && event.pointerType === "mouse") return;
      const g = gestureRef.current;
      g.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      event.currentTarget.setPointerCapture(event.pointerId);

      g.interacting = true;
      g.movedPx = 0;
      g.pinchPrev = null;
      g.panStart = null;

      const layer = layerRef.current;
      if (layer) {
        layer.style.willChange = "transform";
        layer.style.transition = "none";
      }
      setGrabbing(true);

      if (g.pointers.size === 2) {
        const [a, b] = [...g.pointers.values()];
        const stage = stageRef.current;
        const rect = stage?.getBoundingClientRect();
        const centreX = (rect?.left ?? 0) + (rect?.width ?? 0) / 2;
        const centreY = (rect?.top ?? 0) + (rect?.height ?? 0) / 2;
        g.pinchPrev = {
          dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
          midX: (a.x + b.x) / 2,
          midY: (a.y + b.y) / 2,
          midXRel: (a.x + b.x) / 2 - centreX,
          midYRel: (a.y + b.y) / 2 - centreY,
        };
        g.panStart = null;
      } else if (g.pointers.size === 1) {
        const cur = transformRef.current;
        g.panStart = {
          px: event.clientX,
          py: event.clientY,
          tx: cur.x,
          ty: cur.y,
        };
      }
    },
    []
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g.pointers.has(event.pointerId)) return;
      g.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (g.pointers.size >= 2 && g.pinchPrev) {
        const [a, b] = [...g.pointers.values()];
        const stage = stageRef.current;
        const rect = stage?.getBoundingClientRect();
        const centreX = (rect?.left ?? 0) + (rect?.width ?? 0) / 2;
        const centreY = (rect?.top ?? 0) + (rect?.height ?? 0) / 2;
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const midXRel = midX - centreX;
        const midYRel = midY - centreY;

        const prev = g.pinchPrev;
        const cur = transformRef.current;
        const nextScale = cur.scale * (dist / prev.dist);
        const ratio = nextScale / cur.scale;

        // Anchor the zoom at the live pinch midpoint, then follow midpoint drift.
        const nextX =
          (midXRel - (midXRel - cur.x) * ratio) + (midXRel - prev.midXRel);
        const nextY =
          (midYRel - (midYRel - cur.y) * ratio) + (midYRel - prev.midYRel);

        g.pinchPrev = { dist, midX, midY, midXRel, midYRel };
        g.movedPx += Math.hypot(midX - prev.midX, midY - prev.midY);
        transformRef.current = clampTransform({
          scale: nextScale,
          x: nextX,
          y: nextY,
        });
        scheduleWrite();
        return;
      }

      if (g.panStart && g.pointers.size === 1) {
        const dx = event.clientX - g.panStart.px;
        const dy = event.clientY - g.panStart.py;
        g.movedPx = Math.max(g.movedPx, Math.hypot(dx, dy));
        if (transformRef.current.scale > 1) {
          transformRef.current = clampTransform({
            scale: transformRef.current.scale,
            x: g.panStart.tx + dx,
            y: g.panStart.ty + dy,
          });
          scheduleWrite();
        }
      }
    },
    [clampTransform, scheduleWrite]
  );

  const settleAfterGesture = useCallback(() => {
    const g = gestureRef.current;
    const layer = layerRef.current;
    g.interacting = false;
    g.pinchPrev = null;
    g.panStart = null;
    if (g.pointers.size === 0 && layer) {
      layer.style.willChange = "";
      setGrabbing(false);
      transformRef.current = clampTransform(transformRef.current);
      scheduleWrite();
      syncUi(transformRef.current.scale);
    }
  }, [clampTransform, scheduleWrite, syncUi]);

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g.pointers.has(event.pointerId)) return;
      g.pointers.delete(event.pointerId);
      const stage = stageRef.current;
      if (stage?.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }

      const wasPinching = g.pinchPrev !== null && g.pointers.size >= 1;

      if (g.pointers.size === 0) {
        // --- Tap / double-tap / swipe disambiguation -------------------
        const isTap = g.movedPx < TAP_SLOP_PX;
        const now = performance.now();

        if (isTap) {
          const last = g.lastTap;
          if (
            last &&
            now - last.t < DOUBLE_TAP_WINDOW_MS &&
            Math.hypot(event.clientX - last.x, event.clientY - last.y) < DOUBLE_TAP_SLOP_PX
          ) {
            if (g.singleTapTimeout) {
              window.clearTimeout(g.singleTapTimeout);
              g.singleTapTimeout = undefined;
            }
            g.lastTap = null;
            suppressBackdropClickUntilRef.current = now + 400;
            const cur = transformRef.current;
            const anchor = relativePoint(event.clientX, event.clientY);
            if (cur.scale > MIN_SCALE) {
              resetZoom();
            } else {
              zoomAtPoint(Math.min(MAX_SCALE, 2.5), anchor.x, anchor.y, true);
            }
          } else {
            g.lastTap = { t: now, x: event.clientX, y: event.clientY };
            const target = event.target as HTMLElement;
            const isImage = target.tagName === "IMG";
            g.singleTapTimeout = window.setTimeout(() => {
              if (transformRef.current.scale <= MIN_SCALE && isImage) {
                onClose();
              }
            }, DOUBLE_TAP_WINDOW_MS);
          }
        } else if (
          transformRef.current.scale === MIN_SCALE &&
          g.panStart
        ) {
          const dx = event.clientX - g.panStart.px;
          const dy = event.clientY - g.panStart.py;
          if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
            suppressBackdropClickUntilRef.current = performance.now() + 400;
            if (dx < 0) {
              onNext();
            } else {
              onPrev();
            }
          }
        }

        settleAfterGesture();
        return;
      }

      if (wasPinching && g.pointers.size === 1) {
        // Two fingers -> one: restart a clean pan from the remaining pointer.
        const [remaining] = [...g.pointers.values()];
        const cur = transformRef.current;
        g.pinchPrev = null;
        g.panStart = { px: remaining.x, py: remaining.y, tx: cur.x, ty: cur.y };
      }
    },
    [
      onClose,
      onNext,
      onPrev,
      relativePoint,
      resetZoom,
      settleAfterGesture,
      zoomAtPoint,
    ]
  );

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      g.pointers.delete(event.pointerId);
      settleAfterGesture();
    },
    [settleAfterGesture]
  );

  /* -----------------------------------------------------------------------
   * Wheel zoom (mouse wheel + trackpad pinch via ctrl+wheel)
   * --------------------------------------------------------------------- */

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const intensity = event.ctrlKey
        ? TRACKPAD_PINCH_INTENSITY
        : WHEEL_ZOOM_INTENSITY;
      const factor = Math.exp(-event.deltaY * intensity);
      const anchor = relativePoint(event.clientX, event.clientY);
      const cur = transformRef.current;
      const layer = layerRef.current;
      if (layer) layer.style.transition = "none";
      zoomAtPoint(cur.scale * factor, anchor.x, anchor.y);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [relativePoint, zoomAtPoint]);

  /** Debounced UI sync after wheel bursts finish. */
  useEffect(() => {
    if (uiScale === 1) return;
    const timer = window.setTimeout(() => {
      transformRef.current = clampTransform(transformRef.current);
      syncUi(transformRef.current.scale);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [uiScale, clampTransform, syncUi]);

  /* -----------------------------------------------------------------------
   * Backdrop click-to-dismiss (ignores photo, gestures and double-taps)
   * --------------------------------------------------------------------- */

  const onStageClick = useCallback(
    (event: ReactMouseEvent) => {
      if (performance.now() < suppressBackdropClickUntilRef.current) return;
      if (gestureRef.current.movedPx >= TAP_SLOP_PX) return;
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG") return;
      if (target.closest("button")) return;
      if (transformRef.current.scale > MIN_SCALE) return;
      onClose();
    },
    [onClose]
  );

  /* -----------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------- */

  const sizes = useMemo(
    () =>
      hiRes
        ? "(min-width: 1024px) 160vw, 200vw"
        : "(min-width: 1024px) 80vw, 100vw",
    [hiRes]
  );

  const atMinScale = uiScale <= MIN_SCALE + 0.001;
  const atMaxScale = uiScale >= MAX_SCALE - 0.001;
  const chromeHidden = immersive || isFullscreen;

  const controlButtonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-md border border-cream/20 text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-cream/20 disabled:hover:text-cream";

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${item.alt}`}
      onKeyDown={trapTab}
      className="fixed inset-0 z-[60] flex flex-col bg-[#0b0c10]/95 backdrop-blur-sm select-none"
    >
      {!chromeHidden && (
        <div className="flex items-center justify-between p-4 sm:px-8">
          <p className="text-sm text-cream/70">
            <span className="font-semibold text-cream">{item.category}</span> ·{" "}
            {index + 1} / {total}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={controlButtonClass}
            aria-label="Close image viewer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={onStageClick}
        onDoubleClick={(event) => event.preventDefault()}
        className={`relative flex-1 touch-none overflow-hidden ${
          grabbing
            ? "cursor-grabbing"
            : atMinScale
              ? "cursor-zoom-in"
              : ZOOMED_CURSOR_CLASS
        }`}
      >
        <div
          ref={layerRef}
          className="absolute inset-0"
          style={{ transformOrigin: "center center" }}
        >
          <StageImage
            key={item.src}
            src={item.src}
            alt={item.alt}
            sizes={sizes}
            blurDataURL={
              item.src === openedSrc
                ? initialBlurDataURL ?? IMAGE_BLUR_PLACEHOLDER
                : IMAGE_BLUR_PLACEHOLDER
            }
            onAspectReady={handlePhotoAspect}
          />
        </div>

        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/20 bg-[#0b0c10]/60 text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:left-4"
          aria-label="Previous image"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/20 bg-[#0b0c10]/60 text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 sm:right-4"
          aria-label="Next image"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 p-4 sm:px-8">
        {!chromeHidden && (
          <p className="line-clamp-2 text-center text-sm text-cream/70">{item.alt}</p>
        )}

        <div className="flex items-center gap-1.5" role="group" aria-label="Zoom and view controls">
          <button
            type="button"
            onClick={() => zoomStep(-1)}
            disabled={atMinScale}
            className={controlButtonClass}
            aria-label="Zoom out"
          >
            <MinusIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            disabled={atMinScale}
            className="inline-flex h-10 min-w-[4.25rem] items-center justify-center rounded-md border border-cream/20 px-2 text-sm font-medium tabular-nums text-cream transition-colors hover:border-gold-400 hover:text-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400 disabled:opacity-50"
            aria-label={`Zoom level ${Math.round(uiScale * 100)} percent. Activate to reset zoom.`}
          >
            <span ref={zoomBadgeRef}>100%</span>
          </button>

          <button
            type="button"
            onClick={() => zoomStep(1)}
            disabled={atMaxScale}
            className={controlButtonClass}
            aria-label="Zoom in"
          >
            <PlusIcon className="h-5 w-5" />
          </button>

          <span aria-hidden="true" className="mx-1 h-6 w-px bg-cream/20" />

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className={controlButtonClass}
            aria-label={
              isFullscreen || immersive ? "Exit full screen" : "Enter full screen"
            }
            aria-pressed={isFullscreen || immersive}
          >
            {isFullscreen || immersive ? (
              <ShrinkIcon className="h-5 w-5" />
            ) : (
              <ExpandIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
