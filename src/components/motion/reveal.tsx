"use client";

import type { CSSProperties, ElementType } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoom"
  | "fade"
  | "blur";

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration,
  distance,
  once = true,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  /** Direction/effect of the entrance animation. */
  variant?: RevealVariant;
  /** Stagger delay in ms (use with grouped lists, e.g. `i * 100`). */
  delay?: number;
  /** Override the default transition duration (ms). */
  duration?: number;
  /** Override the default travel distance in px (default 24). */
  distance?: number;
  /** Animate only once (default) or every time it re-enters. */
  once?: boolean;
  className?: string;
  as?: "div" | "li" | "span" | "figure" | "nav";
}) {
  const { ref, inView } = useInView<HTMLElement>({ once });

  const style: CSSProperties = {
    "--reveal-delay": `${delay}ms`,
    ...(duration !== undefined
      ? { "--reveal-duration": `${duration}ms` }
      : null),
    ...(distance !== undefined
      ? { "--reveal-distance": `${distance}px` }
      : null),
  } as CSSProperties;

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      style={style}
      className={cn(
        "reveal",
        inView ? "reveal-visible" : cn("reveal-hidden", `reveal-${variant}`),
        className
      )}
    >
      {children}
    </Tag>
  );
}
