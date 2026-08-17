"use client";

import { useEffect, useRef } from "react";

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

/** easeOutExpo — snappy onset, smooth settle. */
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ── Shared animation controller ────────────────────────────────────
// All active counters register here. A single rAF loop ticks every
// counter per frame, eliminating per-element scheduling overhead.

type CounterEntry = {
  numEl: HTMLSpanElement;
  barEl: HTMLSpanElement | null;
  target: number;
  decimals: number;
  suffix: string;
  duration: number;
  startMs: number | null;
  lastText: string;
};

let active: CounterEntry[] = [];
let ticking = false;

function tick(now: number) {
  let allDone = true;

  for (let i = 0; i < active.length; i++) {
    const c = active[i];
    if (c.startMs === null) c.startMs = now;

    const elapsed = now - c.startMs;
    const t = Math.min(elapsed / c.duration, 1);
    const eased = easeOutExpo(t);
    const raw = Math.min(c.target * eased, c.target);

    // Only write text when the displayed string actually changes.
    // For integer counters this skips ~70% of frames mid-animation.
    const text =
      c.decimals > 0
        ? raw.toFixed(c.decimals) + c.suffix
        : Math.round(raw).toString() + c.suffix;

    if (text !== c.lastText) {
      c.numEl.textContent = text;
      c.lastText = text;
    }

    // scaleX is GPU-composited — zero layout cost vs style.width
    if (c.barEl) c.barEl.style.transform = `scaleX(${eased})`;

    if (t < 1) allDone = false;
  }

  if (allDone) {
    for (let i = 0; i < active.length; i++) {
      const c = active[i];
      const final = c.target.toFixed(c.decimals) + c.suffix;
      if (final !== c.lastText) c.numEl.textContent = final;
      if (c.barEl) c.barEl.style.transform = "scaleX(1)";
    }
    active = [];
    ticking = false;
  } else {
    requestAnimationFrame(tick);
  }
}

function scheduleTick() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(tick);
  }
}

// ── Shared IntersectionObserver (lazy singleton) ────────────────────
let sharedObserver: IntersectionObserver | null = null;
const pendingRun = new Map<Element, () => void>();

function getSharedObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const run = pendingRun.get(entry.target);
          if (run) {
            pendingRun.delete(entry.target);
            sharedObserver!.unobserve(entry.target);
            run();
          }
        }
      }
    },
    { threshold: 0.2 }
  );
  return sharedObserver;
}

function formatInitial(decimals: number, suffix: string) {
  return decimals > 0 ? "0." + "0".repeat(decimals) + suffix : "0" + suffix;
}

// ── Component ──────────────────────────────────────────────────────

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

  useEffect(() => {
    const root = rootRef.current;
    const numEl = numRef.current;
    const barEl = barRef.current;
    if (!root || !numEl) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const duration = reduceMotion ? 500 :
      decimals > 0 ? 1200 :
      target <= 20 ? 800 :
      target <= 100 ? 1100 : 1400;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const register = () => {
      if (cancelled) return;
      active.push({
        numEl,
        barEl,
        target,
        decimals,
        suffix,
        duration,
        startMs: null,
        lastText: "",
      });
      scheduleTick();
    };

    const observer = getSharedObserver();

    if (delay > 0) {
      const run = () => {
        if (cancelled) return;
        timer = setTimeout(register, delay);
      };
      pendingRun.set(root, run);
      observer.observe(root);
    } else {
      pendingRun.set(root, register);
      observer.observe(root);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      pendingRun.delete(root);
      sharedObserver?.unobserve(root);
    };
  }, [target, decimals, suffix, delay]);

  const { decimals: dec, suffix: sfx } = parseStat(value);

  return (
    <span
      ref={rootRef}
      className="inline-flex flex-col items-center"
      style={{ contain: "layout style" }}
    >
      <span
        ref={numRef}
        className="inline-block text-white tabular-nums"
      >
        {formatInitial(dec, sfx)}
      </span>
      <span
        aria-hidden
        className="mt-2.5 block h-1 w-16 overflow-hidden rounded-full bg-white/10"
      >
        <span
          ref={barRef}
          className="block h-full w-full origin-left rounded-full bg-white"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
    </span>
  );
}
