"use client";

import { useEffect, useRef, useState } from "react";

function parseStat(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, decimals: 0, suffix: value };
  const raw = match[1];
  return {
    target: parseFloat(raw),
    decimals: (raw.split(".")[1] ?? "").length,
    suffix: match[2],
  };
}

function durationFor(target: number, decimals: number) {
  if (decimals > 0) return 7000;
  if (target <= 20) return 8500;
  if (target <= 100) return 10500;
  return 14000;
}

export function CountUp({
  value,
  delay = 0,
}: {
  value: string;
  delay?: number;
}) {
  const { target, decimals, suffix } = parseStat(value);
  const rootRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const pop = (scale: number, durationMs: number) => {
      numRef.current?.animate(
        [
          { transform: "scale(1)" },
          { transform: `scale(${scale})` },
          { transform: "scale(1)" },
        ],
        { duration: durationMs, easing: "ease-out" }
      );
    };

    let observer: IntersectionObserver | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    let start: number | null = null;
    let cancelled = false;

    const animate = (now: number) => {
      if (cancelled) return;
      const duration = reduceMotion ? 700 : durationFor(target, decimals);
      if (start === null) {
        start = now;
        if (!reduceMotion) pop(1.12, 180);
      }
      const t = Math.min((now - start) / duration, 1);
      // easeInQuad: slow start that accelerates — slow enough to follow
      // each number, fast enough to land with a satisfying rush
      const eased = t * t;
      const raw = Math.min(target * eased, target);
      setDisplay(decimals > 0 ? raw : Math.round(raw));
      if (barRef.current) barRef.current.style.width = `${eased * 100}%`;
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setDisplay(target);
        if (barRef.current) barRef.current.style.width = "100%";
        if (!reduceMotion) pop(1.18, 320);
      }
    };

    const run = () => {
      if (cancelled) return;
      if (delay > 0) {
        // one-shot delay — apply it exactly once, then start the loop
        timer = setTimeout(() => {
          if (!cancelled) raf = requestAnimationFrame(animate);
        }, delay);
        return;
      }
      raf = requestAnimationFrame(animate);
    };

    if (typeof IntersectionObserver === "undefined") {
      timer = setTimeout(run, delay);
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            run();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(root);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, decimals, delay]);

  return (
    <span ref={rootRef} className="inline-flex flex-col items-center">
      <span
        ref={numRef}
        className="inline-block text-white tabular-nums"
      >
        {display.toFixed(decimals)}
        {suffix}
      </span>
      <span
        aria-hidden
        className="mt-2.5 block h-1 w-16 overflow-hidden rounded-full bg-white/10"
      >
        <span
          ref={barRef}
          className="block h-full w-full rounded-full bg-white"
          style={{ width: "0%" }}
        />
      </span>
    </span>
  );
}
