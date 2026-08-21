"use client";

import { useEffect } from "react";

export function ScrollOptimizer() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    // ── Device & Constraint Detection ──────────────────────────────────
    // We only disable rich CSS animations (glows, floating particles) if the
    // user has explicitly requested data savings or reduced motion.
    // (We removed the CPU/RAM checks because many standard dual-core laptops
    // were incorrectly being flagged as 'low-perf', hiding the animations).
    const nav = navigator as unknown as {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    };

    const isDataSaver = !!(
      nav.connection &&
      (nav.connection.saveData ||
        nav.connection.effectiveType === "2g" ||
        nav.connection.effectiveType === "3g")
    );
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isDataSaver || prefersReducedMotion) {
      root.classList.add("low-perf");
    }

    if (prefersReducedMotion) {
      root.classList.add("reduce-motion");
    }

    // ── Passive Scroll Debouncer ──────────────────────────────────────
    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (!document.body.classList.contains("is-scrolling")) {
        document.body.classList.add("is-scrolling");
      }
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  return null;
}
