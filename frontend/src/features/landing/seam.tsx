"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { WAVE_SHAPES, passProgress, travel, wavePath, type WaveLayer, type WaveName } from "@/lib/wave";

const W = 1440;
const H = 160;

/**
 * What lies behind the front wave. The tones follow the scent as it develops down the page (smoke, cedar, rose, amber,
 * oxblood), so the seams are the story of a fragrance opening: top notes, heart, base.
 */
const TONES = {
  raised: { colour: "var(--color-raised)", back: [0.65, 0.9], mid: [0.3, 0.45] },
  woody: { colour: "var(--color-woody)", back: [0.2, 0.32], mid: [0.08, 0.14] },
  floral: { colour: "var(--color-floral)", back: [0.16, 0.26], mid: [0.07, 0.12] },
  glow: { colour: "var(--color-accent)", back: [0.14, 0.22], mid: [0.07, 0.1] },
  oud: { colour: "var(--color-oud)", back: [0.4, 0.6], mid: [0.16, 0.26] },
} as const;

export type SeamTone = keyof typeof TONES;

/** Per layer, back to front: how far it slides across a whole pass (a fraction of the width) and which way. */
const DRIFT = [-0.32, 0.5, -0.8];

/** Where each drawn path lives in the markup: three fills, back to front, then the two crest hairlines. */
const PATHS: { layer: number; closed: boolean }[] = [
  { layer: 0, closed: true },
  { layer: 1, closed: true },
  { layer: 2, closed: true },
  { layer: 1, closed: false },
  { layer: 0, closed: false },
];

const lineAt = (layers: WaveLayer[], progress: number) =>
  PATHS.map(({ layer, closed }) => wavePath(W, H, travel(layers[layer]!, DRIFT[layer]! * (progress - 0.5), 0.75 + 0.5 * Math.sin(Math.PI * Math.min(1, Math.max(0, progress)))), { closed }));

/**
 * A wavy seam between two sections. It sits across the boundary (half over each side) and draws three layers: lighter
 * bands behind, then a front wave in the page colour, each fading to nothing underneath, so whatever the next section
 * starts with shows through and no edge is ever cut. A champagne hairline rides the middle crest. As the seam crosses
 * the screen the layers slide past each other and swell, so the line is alive under the visitor's hand. Redrawn
 * straight on the paths, never through React, and only while on screen.
 */
export function Seam({ shape, tone = "raised", flip = false }: { shape: WaveName; tone?: SeamTone; flip?: boolean }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const reduced = useReducedMotion();
  const layers = WAVE_SHAPES[shape].layers;
  const t = TONES[tone];
  const fills = [
    { id: `${id}-a`, colour: t.colour, top: t.back[0], mid: t.mid[0] },
    { id: `${id}-b`, colour: t.colour, top: t.back[1], mid: t.mid[1] },
    { id: `${id}-c`, colour: "var(--color-page)", top: 1, mid: 0.9 },
  ];
  const resting = lineAt(layers, 0.5);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    let frame = 0;
    let onScreen = typeof IntersectionObserver === "undefined";
    const paint = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const lines = lineAt(layers, passProgress(rect.top, rect.height, window.innerHeight));
      lines.forEach((d, i) => paths.current[i]?.setAttribute("d", d));
    };
    const queue = () => {
      if (onScreen && !frame) frame = requestAnimationFrame(paint);
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      queue();
    }, { rootMargin: "25% 0px" });
    observer?.observe(el);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [layers, reduced]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none relative z-10 h-[var(--seam)] -my-[calc(var(--seam)/2)] overflow-hidden"
      style={{ "--seam": "clamp(7rem, 14vw, 13rem)" } as CSSProperties}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={cn("block h-full w-full", flip && "-scale-x-100")}>
        <defs>
          {fills.map((f) => (
            <linearGradient key={f.id} id={f.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={f.colour} stopOpacity={f.top} />
              <stop offset="0.45" stopColor={f.colour} stopOpacity={f.mid} />
              <stop offset="0.85" stopColor={f.colour} stopOpacity="0" />
            </linearGradient>
          ))}
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {PATHS.map(({ closed }, i) =>
          closed ? (
            <path key={i} ref={(node) => void (paths.current[i] = node)} data-layer="fill" d={resting[i]} fill={`url(#${fills[i]!.id})`} />
          ) : (
            <path key={i} ref={(node) => void (paths.current[i] = node)} data-layer="rim" d={resting[i]} fill="none" stroke={`url(#${id}-rim)`} strokeOpacity={i === 4 ? 0.45 : 1} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          ),
        )}
      </svg>
    </div>
  );
}
