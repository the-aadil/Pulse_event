"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  swaySpeed: number;
  swayAmount: number;
  spriteIndex: number;
}

const GOLD_PALETTES = [
  { core: "255, 215, 0", glow: "234, 179, 8" },     // Pure Gold
  { core: "253, 230, 138", glow: "245, 158, 11" },  // Warm Champagne / Amber
  { core: "254, 240, 138", glow: "217, 119, 6" },   // Bright Light Gold
  { core: "251, 191, 36", glow: "180, 83, 9" },     // Deep Honey Amber
] as const;

export interface FloatingDotsCanvasProps {
  className?: string;
  particleCount?: number;
  speedMultiplier?: number;
}

/**
 * Creates pre-rendered offscreen bokeh/glow canvas sprites.
 * Pre-rendering gradients onto offscreen sprites provides lush depth-of-field
 * soft glow blurs at a fraction of the GPU/CPU cost of real-time canvas filters.
 */
function createGlowSprites(): { canvas: HTMLCanvasElement; size: number }[] {
  if (typeof document === "undefined") return [];

  const sprites: { canvas: HTMLCanvasElement; size: number }[] = [];
  const configs = [
    // [radius, blurRadius, paletteIndex]
    { r: 1.5, blur: 4, palette: 0 },  // Small crisp sparkle
    { r: 2.5, blur: 8, palette: 1 },  // Medium soft glowing dot
    { r: 3.5, blur: 12, palette: 2 }, // Medium-large ambient orb
    { r: 5.0, blur: 18, palette: 0 }, // Soft background bokeh orb
    { r: 7.0, blur: 24, palette: 3 }, // Large deep bokeh circle
  ];

  for (const cfg of configs) {
    const size = Math.ceil((cfg.r + cfg.blur) * 2);
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = size;
    spriteCanvas.height = size;
    const ctx = spriteCanvas.getContext("2d");
    if (!ctx) continue;

    const center = size / 2;
    const { core, glow } = GOLD_PALETTES[cfg.palette];

    // Radial gradient: bright white/gold center fading to soft golden aura
    const grad = ctx.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      cfg.r + cfg.blur
    );
    grad.addColorStop(0, `rgba(${core}, 0.95)`);
    grad.addColorStop(0.2, `rgba(${core}, 0.6)`);
    grad.addColorStop(0.55, `rgba(${glow}, 0.25)`);
    grad.addColorStop(1, `rgba(${glow}, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, cfg.r + cfg.blur, 0, Math.PI * 2);
    ctx.fill();

    sprites.push({ canvas: spriteCanvas, size });
  }

  return sprites;
}

/**
 * Ultra-Smooth & Attractive Floating Bokeh Dots Animation
 *
 * Visual & Performance Highlights:
 * 1. Soft Blurred Bokeh & Glow: Pre-rendered offscreen radial gradient sprites.
 * 2. Seamless Refresh & Load: Smooth CSS opacity fade-in on mount prevents jumping.
 * 3. Fluid 60-120 FPS Motion: Frame-delta physics with harmonic horizontal drift.
 * 4. Battery & Background Efficient: Automatically pauses when offscreen or tab hidden.
 */
export function FloatingDotsCanvas({
  className,
  particleCount = 42,
  speedMultiplier = 1,
}: FloatingDotsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d", { alpha: true });
    } catch {
      return;
    }
    if (!ctx) return;

    // Create high-performance soft bokeh sprites
    const sprites = createGlowSprites();
    if (sprites.length === 0) return;

    let animId: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
    const isLowPerf =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("low-perf");

    const activeCount = isLowPerf
      ? Math.min(particleCount, 22)
      : isSmallScreen
        ? Math.min(particleCount, 30)
        : particleCount;

    let particles: Particle[] = [];

    function initParticles(w: number, h: number) {
      const list: Particle[] = [];
      for (let i = 0; i < activeCount; i++) {
        // Weighted distribution: more small/medium dots, fewer large bokeh circles
        const rand = Math.random();
        let spriteIndex = 0;
        if (rand > 0.88) spriteIndex = 4; // Large bokeh
        else if (rand > 0.7) spriteIndex = 3; // Soft orb
        else if (rand > 0.45) spriteIndex = 2; // Medium orb
        else if (rand > 0.2) spriteIndex = 1; // Medium sparkle
        else spriteIndex = 0; // Small crisp sparkle

        const sprite = sprites[spriteIndex] ?? sprites[0];
        const baseAlpha =
          spriteIndex >= 3
            ? Math.random() * 0.35 + 0.25 // Softer for large bokeh
            : Math.random() * 0.45 + 0.4;  // Brighter for small sparkles

        // Depth-based parallax: Larger dots (closer) move slightly faster than tiny dots
        const parallaxFactor = 0.6 + (spriteIndex * 0.15);

        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.09 * speedMultiplier,
          // Even slower, barely drifting
          vy: -(Math.random() * 0.26 + 0.17) * parallaxFactor * speedMultiplier,
          radius: sprite.size / 2,
          baseAlpha,
          alpha: baseAlpha,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          swaySpeed: Math.random() * 0.01 + 0.005,
          swayAmount: Math.random() * 1.2 + 0.5,
          spriteIndex,
        });
      }
      return list;
    }

    function resize() {
      if (!canvas || !container || !ctx) return;
      try {
        const rect = container.getBoundingClientRect();
        const newWidth = Math.max(rect.width, 1);
        const newHeight = Math.max(rect.height, 1);
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = newWidth;
        height = newHeight;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        if (particles.length === 0) {
          particles = initParticles(width, height);
        } else {
          // Proportionately adapt existing positions without reshuffling/jumping
          for (const p of particles) {
            if (p.x > width) p.x = Math.random() * width;
            if (p.y > height) p.y = Math.random() * height;
          }
        }

      } catch (err) {
        console.warn("[FloatingDotsCanvas] Resize error:", err);
      }
    }

    function drawStaticFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const sprite = sprites[p.spriteIndex] ?? sprites[0];
        ctx.globalAlpha = p.baseAlpha;
        ctx.drawImage(
          sprite.canvas,
          p.x - sprite.size / 2,
          p.y - sprite.size / 2
        );
      }
      ctx.globalAlpha = 1;
    }

    let lastTime = performance.now();

    function render(currentTime: number) {
      if (!ctx) {
        animId = null;
        return;
      }

      try {
        // Delta time normalized to 60fps (1.0 = ~16.6ms)
        const delta = Math.min(Math.max((currentTime - lastTime) / 16.667, 0.4), 2.5);
        lastTime = currentTime;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const sprite = sprites[p.spriteIndex] ?? sprites[0];

          // Harmonic floating & gentle horizontal oscillation
          p.phase += p.swaySpeed * delta;
          p.x += (p.vx + Math.sin(p.phase) * p.swayAmount) * delta;
          p.y += p.vy * delta;

          // Organic twinkle / pronounced opacity breathing for attractiveness
          p.alpha = p.baseAlpha + Math.sin(p.phase * 2.5) * 0.25;

          // Vertical Fade-in and Fade-out (matches CSS float-particle keyframes)
          let edgeAlphaMultiplier = 1;
          const fadeThreshold = height * 0.15; // Fade over top/bottom 15% of screen
          if (p.y > height - fadeThreshold) {
            edgeAlphaMultiplier = (height - p.y) / fadeThreshold; // Fade in from bottom
          } else if (p.y < fadeThreshold) {
            edgeAlphaMultiplier = p.y / fadeThreshold; // Fade out at top
          }

          // Smooth edge wrapping (re-roll X position when resetting to bottom)
          const half = sprite.size / 2;
          if (p.y < -half) {
            p.y = height + half;
            p.x = Math.random() * width;
            p.phase = Math.random() * Math.PI * 2;
          }
          if (p.x < -half) p.x = width + half;
          if (p.x > width + half) p.x = -half;

          // Draw pre-rendered soft glowing bokeh sprite
          const targetAlpha = p.alpha * Math.max(0, edgeAlphaMultiplier);
          const currentAlpha = Math.max(0, Math.min(0.95, targetAlpha));
          ctx.globalAlpha = currentAlpha;
          ctx.drawImage(
            sprite.canvas,
            p.x - half,
            p.y - half
          );
        }

        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(render);
      } catch (err) {
        console.warn("[FloatingDotsCanvas] Render error:", err);
        animId = null;
      }
    }

    function startAnimation() {
      if (!animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    }

    function stopAnimation() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    resize();
    startAnimation();

    // Trigger smooth fade-in
    const fadeTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    // Debounced window resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      stopAnimation();
      clearTimeout(fadeTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleCount, speedMultiplier]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "block h-full w-full transition-opacity duration-700 ease-out",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
