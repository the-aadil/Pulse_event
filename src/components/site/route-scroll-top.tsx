"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures the document scrolls to (0, 0) on every route change.
 *
 * Next.js App Router normally handles this, but `scroll-behavior: smooth`
 * on the `html` element can interfere — the browser tries to smooth-scroll
 * to top during navigation which feels sluggish or fails if the document
 * hasn't fully rendered yet. This component forces an immediate scroll
 * reset, temporarily overriding smooth scrolling so the jump is instant.
 *
 * Performance note: This runs once per pathname change with zero DOM
 * observers or scroll listeners.
 */
export function RouteScrollTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Force instant scroll to avoid smooth-scroll delay during navigation
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    // Restore after a microtask so in-page smooth anchor scrolling still works
    requestAnimationFrame(() => {
      html.style.scrollBehavior = prev;
    });
  }, [pathname]);

  return null;
}
