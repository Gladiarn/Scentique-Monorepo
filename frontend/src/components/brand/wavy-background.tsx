"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface WavyBackgroundProps {
  /** Token names (without --color-) used for the wave lines. */
  colors?: string[];
  lines?: number;
  className?: string;
}

const DEFAULT_COLORS = ["accent", "woody", "floral", "oud"];

/** Slow layered sine waves in brand tints. Static under reduced motion, paused off-screen. */
export function WavyBackground({ colors = DEFAULT_COLORS, lines = 7, className }: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = getComputedStyle(document.documentElement);
    const palette = colors.map((name) => root.getPropertyValue(`--color-${name}`).trim() || "currentColor");

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.25;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.strokeStyle = palette[i % palette.length] ?? "currentColor";
        ctx.globalAlpha = 0.5;
        const baseline = height * (0.28 + i * 0.09);
        for (let x = 0; x <= width; x += 8) {
          const y =
            baseline +
            Math.sin(x * 0.0042 + t * (1 + i * 0.12) + i) * height * 0.06 +
            Math.sin(x * 0.0013 - t * 0.7 + i * 2) * height * 0.09;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(1.2);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    intersection.observe(canvas);

    if (!reduced) {
      const loop = (now: number) => {
        if (visible) draw(now * 0.0004);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [colors, lines]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
