"use client";

import { useEffect, useRef, useState } from "react";

export type UseInViewOptions = {
  /** Fraction of the element that must be visible (0-1). */
  threshold?: number | number[];
  /** Root margin -- negative bottom pulls the trigger zone up. */
  rootMargin?: string;
  /** Only animate the first time the element enters the viewport. */
  once?: boolean;
};

// ── Shared IntersectionObserver pool ───────────────────────────────
// One observer per (threshold + rootMargin) key to avoid creating
// hundreds of observers when many <Reveal> / <Stagger> elements are
// on the same page.

type Callbacks = {
  onEnter: () => void;
  onLeave?: () => void;
};

const callbackMap = new WeakMap<Element, Callbacks>();

/** Lazy singleton observers keyed by serialized options. */
const observers = new Map<string, IntersectionObserver>();

function getObserver(
  threshold: number | number[],
  rootMargin: string
): IntersectionObserver {
  const key = `${JSON.stringify(threshold)}|${rootMargin}`;
  let obs = observers.get(key);
  if (obs) return obs;

  obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const cb = callbackMap.get(entry.target);
        if (!cb) continue;
        if (entry.isIntersecting) {
          cb.onEnter();
        } else {
          cb.onLeave?.();
        }
      }
    },
    { threshold, rootMargin }
  );
  observers.set(key, obs);
  return obs;
}

/**
 * Returns true if the element's bounding rect overlaps the current viewport
 * by at least `threshold` fraction of its height. Used for the synchronous
 * "already in view at mount" fast-path that fixes desktop animations.
 */
function isAlreadyInView(el: HTMLElement, threshold: number): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  const visibleFraction = visible / (rect.height || 1);
  return visibleFraction >= threshold;
}

/**
 * Modular scroll-intersection hook. Uses a shared IntersectionObserver
 * pool so the total number of OS observers stays small regardless of how
 * many Reveal / Stagger elements exist on the page.
 *
 * KEY FIX: Synchronously checks if the element is already inside the
 * viewport at mount time (getBoundingClientRect fast-path). This prevents
 * the race condition on desktop where:
 *   1. `js` class is added  → element hides (opacity:0)
 *   2. IntersectionObserver fires in the same/next frame → misses the transition
 *
 * Automatically bypasses on low-end device constraints or reduced motion
 * to eliminate observer scheduling overhead and prevent dropped frames.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.05,
  rootMargin = "0px 0px 0px 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fast-path bypass for accessibility (reduced motion)
    if (
      typeof window !== "undefined" &&
      (document.documentElement.classList.contains("reduce-motion") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        typeof IntersectionObserver === "undefined")
    ) {
      setInView(true);
      return;
    }

    // ── Desktop / above-the-fold fix ──────────────────────────────────
    // If the element is already visible in the viewport right now, we MUST
    // allow the browser to paint the 'hidden' state first (applied via the .js class).
    // If we set inView to true synchronously, the browser batches the updates
    // and skips the transition entirely (it just pops in).
    const thresholdVal = Array.isArray(threshold) ? threshold[0] : threshold;
    if (isAlreadyInView(el, thresholdVal)) {
      // Use requestAnimationFrame + setTimeout to guarantee one full frame
      // paints the `opacity: 0` state before we trigger the reveal.
      let timer: ReturnType<typeof setTimeout>;
      const raf = requestAnimationFrame(() => {
        timer = setTimeout(() => setInView(true), 50);
      });
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    const observer = getObserver(threshold, rootMargin);

    callbackMap.set(el, {
      onEnter: () => {
        setInView(true);
        if (once) observer.unobserve(el);
      },
      onLeave: once
        ? undefined
        : () => {
            setInView(false);
          },
    });

    observer.observe(el);

    return () => {
      observer.unobserve(el);
      callbackMap.delete(el);
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
