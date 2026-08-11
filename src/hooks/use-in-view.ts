"use client";

import { useEffect, useRef, useState } from "react";

export type UseInViewOptions = {
  /** Fraction of the element that must be visible (0–1). */
  threshold?: number | number[];
  /** Root margin — negative bottom pulls the trigger zone up. */
  rootMargin?: string;
  /** Only animate the first time the element enters the viewport. */
  once?: boolean;
};

/**
 * Modular scroll-intersection hook. Pure IntersectionObserver —
 * no libraries required.
 *
 * Usage:
 *   const { ref, inView } = useInView<HTMLDivElement>();
 *   <div ref={ref} className={inView ? "..." : "..."}>
 *
 * Falls back gracefully when IntersectionObserver is missing.
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

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
