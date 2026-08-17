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
// on the same page.  Entries are registered/deregistered via a Map
// keyed by the element reference, and the callback maps back to the
// element so no closures are captured per-element.

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
 * Modular scroll-intersection hook.  Uses a shared IntersectionObserver
 * pool so the total number of OS observers stays small regardless of how
 * many Reveal / Stagger elements exist on the page.
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
