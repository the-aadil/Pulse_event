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
 * Modular scroll-intersection hook. Uses a shared IntersectionObserver
 * pool so the total number of OS observers stays small regardless of how
 * many Reveal / Stagger elements exist on the page.
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
