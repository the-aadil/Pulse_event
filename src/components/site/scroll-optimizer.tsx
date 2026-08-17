"use client";

import { useEffect } from "react";

export function ScrollOptimizer() {
  useEffect(() => {
    document.documentElement.classList.add("js");

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
