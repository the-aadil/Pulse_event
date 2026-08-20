"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight top-bar progress indicator for perceived navigation speed.
 *
 * Shows a slim animated gold bar at the top of the viewport during route
 * transitions. Uses only `transform` for GPU-composited animation (zero
 * layout thrash). Auto-completes and fades out when the new route loads.
 *
 * Performance: No dependencies, no interval timers, zero paint during idle.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = useCallback(() => {
    setProgress(0);
    setVisible(true);

    // Simulate incremental progress
    let current = 0;
    const tick = () => {
      current += Math.random() * 15 + 5;
      if (current > 90) current = 90;
      setProgress(current);
      if (current < 90) {
        timerRef.current = setTimeout(tick, 200 + Math.random() * 300);
      }
    };
    timerRef.current = setTimeout(tick, 100);
  }, []);

  const complete = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      complete();
      prevPathRef.current = pathname;
    }
  }, [pathname, complete]);

  // Start progress on click of internal links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external, hash-only, tel:, mailto:, and download links
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("target") === "_blank"
      ) {
        return;
      }

      // Only trigger if it's a different route
      if (href !== prevPathRef.current) {
        start();
      }
    };

    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, [start]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[9999] h-[3px] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-transform duration-200 ease-out"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: "left",
          opacity: progress >= 100 ? 0 : 1,
          transition:
            progress >= 100
              ? "transform 200ms ease-out, opacity 300ms ease-out 100ms"
              : "transform 200ms ease-out",
        }}
      />
    </div>
  );
}
