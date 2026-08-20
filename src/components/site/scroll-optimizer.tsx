"use client";

import { useEffect } from "react";

export function ScrollOptimizer() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    // ── Low-End Device & Constraint Detection ──────────────────────────
    // Detect low-CPU cores (<= 4 cores, typical of entry-level mobile devices),
    // low RAM (<= 4GB), or Save-Data / 2G/3G network modes.
    const isLowConcurrency =
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;

    const nav = navigator as unknown as {
      deviceMemory?: number;
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    };

    const isLowMemory = !!(nav.deviceMemory && nav.deviceMemory <= 4);
    const isDataSaver = !!(
      nav.connection &&
      (nav.connection.saveData ||
        nav.connection.effectiveType === "2g" ||
        nav.connection.effectiveType === "3g")
    );
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isLowConcurrency || isLowMemory || isDataSaver || prefersReducedMotion) {
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
