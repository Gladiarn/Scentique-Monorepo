"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

export interface EmberSpec {
  /** Position as a percentage of the plane. */
  x: number;
  y: number;
  /** Diameter in px. */
  size: number;
  /** How far it rises over the whole scroll, in viewport heights: each ember at its own rate. */
  rate: number;
  opacity: number;
}

/** Small deterministic PRNG, so server and client render the same embers. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function emberSpecs(count: number): EmberSpec[] {
  const rand = mulberry32(2026);
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 2 + rand() * 3,
    rate: 30 + rand() * 120,
    opacity: 0.25 + rand() * 0.45,
  }));
}

const SPECS = emberSpecs(26);

/** The near plane: warm sparks that rise faster than the scroll (the nearer, the faster), in front of the clip. */
export function Embers() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div data-plane="front" aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPECS.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-pill bg-accent will-change-transform"
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            width: e.size,
            height: e.size,
            opacity: e.opacity,
            transform: `translate3d(0, calc(var(--p, 0) * -${e.rate.toFixed(1)}vh), 0)`,
          }}
        />
      ))}
    </div>
  );
}
