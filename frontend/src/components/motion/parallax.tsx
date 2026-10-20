"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** How far each depth layer drifts per pixel of distance from the viewport centre, and its travel limit in px. */
const DEPTH = {
  far: { speed: 0.12, max: 64 },
  mid: { speed: 0.06, max: 40 },
  near: { speed: -0.05, max: 32 },
} as const;
const PHONE_BELOW = 768;
const PHONE_FACTOR = 0.5;

export type Depth = keyof typeof DEPTH;

export function parallaxOffset(elementCentre: number, viewportCentre: number, speed: number, max: number): number {
  return Math.min(max, Math.max(-max, (elementCentre - viewportCentre) * speed));
}

/**
 * Drifts its content as the page scrolls, at the rate of its depth layer: far and mid lag behind the scroll, near runs
 * ahead. Only ever `transform`. Off under reduced motion; never put body copy on a parallax layer.
 */
export function Parallax({ depth, className, children }: { depth: Depth; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { speed, max } = DEPTH[depth];
      const k = window.innerWidth < PHONE_BELOW ? PHONE_FACTOR : 1;
      const rect = el.getBoundingClientRect();
      // Measure where the element would sit without its own offset, so the effect never feeds back on itself.
      const centre = rect.top - current + rect.height / 2;
      current = parallaxOffset(centre, window.innerHeight / 2, speed * k, max * k);
      el.style.transform = `translate3d(0, ${current}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [depth]);

  return (
    <div ref={ref} data-depth={depth} className={cn("will-change-transform motion-reduce:transform-none!", className)}>
      {children}
    </div>
  );
}
