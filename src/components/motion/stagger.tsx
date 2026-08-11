"use client";

import { Children, cloneElement, isValidElement } from "react";
import type { CSSProperties, ElementType } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import type { RevealVariant } from "@/components/motion/reveal";

/**
 * Scroll-triggered stagger container for grouped items (cards, schedules…).
 * A single IntersectionObserver watches the container; each child inherits a
 * per-index transition delay so items cascade in one-by-one.
 *
 * RSC-safe: children are passed as regular elements, not functions.
 *
 * Usage:
 *   <Stagger className="grid grid-cols-3 gap-6" itemClassName="h-full" gap={100}>
 *     {events.map((event) => <EventCard key={event.id} event={event} />)}
 *   </Stagger>
 */
export function Stagger({
  children,
  gap = 160,
  variant = "up",
  className,
  itemClassName,
  as = "div",
}: {
  children: React.ReactNode;
  /** Delay between each item, in ms. */
  gap?: number;  /** Entrance variant applied to every item. */
  variant?: RevealVariant;
  className?: string;
  /** Extra classes merged into every item (e.g. `h-full` in grids). */
  itemClassName?: string;
  as?: "div" | "ul" | "ol";
}) {
  const { ref, inView } = useInView<HTMLElement>();
  const Tag = as as ElementType;

  return (
    <Tag ref={ref} className={cn("reveal-stagger", className)}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const itemStyle: CSSProperties = {
          "--reveal-delay": `${i * gap}ms`,
        } as CSSProperties;
        const el = child as React.ReactElement<{
          className?: string;
          style?: CSSProperties;
        }>;
        return cloneElement(el, {
          className: cn(
            "reveal-item",
            inView
              ? "reveal-visible"
              : cn("reveal-hidden", `reveal-${variant}`),
            itemClassName,
            el.props.className
          ),
          style: { ...(el.props.style ?? {}), ...itemStyle },
        });
      })}
    </Tag>
  );
}
