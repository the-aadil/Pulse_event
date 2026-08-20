import { cn } from "@/lib/utils";

export interface BubbleConfig {
  id: number;
  size: number; // px
  leftPercent: number; // 0-100%
  durationSec: number; // seconds
  delaySec: number; // seconds
  opacity: number; // 0-1
  glowColor?: string;
}

const DEFAULT_BUBBLES: readonly BubbleConfig[] = [
  { id: 1, size: 28, leftPercent: 12, durationSec: 14, delaySec: 0, opacity: 0.25 },
  { id: 2, size: 16, leftPercent: 28, durationSec: 18, delaySec: 3, opacity: 0.35 },
  { id: 3, size: 36, leftPercent: 45, durationSec: 16, delaySec: 7, opacity: 0.2 },
  { id: 4, size: 22, leftPercent: 62, durationSec: 13, delaySec: 2, opacity: 0.3 },
  { id: 5, size: 32, leftPercent: 78, durationSec: 19, delaySec: 5, opacity: 0.22 },
  { id: 6, size: 18, leftPercent: 90, durationSec: 15, delaySec: 9, opacity: 0.28 },
  { id: 7, size: 24, leftPercent: 38, durationSec: 17, delaySec: 11, opacity: 0.24 },
  { id: 8, size: 14, leftPercent: 82, durationSec: 21, delaySec: 1, opacity: 0.32 },
] as const;

/**
 * Ultra-optimized pure-CSS floating bubbles background component.
 *
 * Performance Rules Enforced:
 * 1. Animates ONLY `transform: translateY(...)` and `opacity` (100% GPU composited).
 * 2. Uses `will-change: transform` for dedicated GPU layer allocation.
 * 3. Bypasses on low-end devices (`.low-perf`) and prefers-reduced-motion.
 * 4. Lightweight fixed DOM footprint (8 lightweight spans).
 */
export function FloatingBubbles({
  className,
  count = 8,
}: {
  className?: string;
  count?: number;
}) {
  const bubbles = DEFAULT_BUBBLES.slice(0, count);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="floating-bubble absolute rounded-full bg-gradient-to-t from-gold-500/30 to-amber-300/40 border border-gold-400/30 shadow-[0_0_12px_rgba(234,179,8,0.2)]"
          style={
            {
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.leftPercent}%`,
              "--bubble-duration": `${b.durationSec}s`,
              "--bubble-delay": `${b.delaySec}s`,
              "--bubble-opacity": b.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
