import { useId } from "react";
import { cn } from "@/lib/cn";
import { WAVE_SHAPES, wavePath, type WaveName } from "@/lib/wave";

const W = 1440;
const H = 160;

/** Back layers glow warm before the quiz and the close; elsewhere they are the lighter brown of the surfaces. */
const TONES = { raised: "var(--color-raised)", glow: "var(--color-accent)" } as const;

/**
 * A wavy seam between two sections. It sits across the boundary (half over each side) and draws three layers: lighter
 * bands behind, then a front wave in the page colour, each fading to nothing underneath, so whatever the next section
 * starts with shows through and no edge is ever cut. A champagne hairline rides the middle crest.
 */
export function Seam({ shape, tone = "raised", flip = false }: { shape: WaveName; tone?: keyof typeof TONES; flip?: boolean }) {
  const id = useId();
  const layers = WAVE_SHAPES[shape].layers;
  const back = TONES[tone];
  const fills = [
    { id: `${id}-a`, colour: back, top: tone === "glow" ? 0.14 : 0.65, mid: tone === "glow" ? 0.07 : 0.3 },
    { id: `${id}-b`, colour: back, top: tone === "glow" ? 0.22 : 0.9, mid: tone === "glow" ? 0.1 : 0.45 },
    { id: `${id}-c`, colour: "var(--color-page)", top: 1, mid: 0.9 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-10 h-[var(--seam)] -my-[calc(var(--seam)/2)] overflow-hidden"
      style={{ "--seam": "clamp(7rem, 14vw, 13rem)" } as React.CSSProperties}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={cn("block h-full w-full", flip && "-scale-x-100")}>
        <defs>
          {fills.map((f) => (
            <linearGradient key={f.id} id={f.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={f.colour} stopOpacity={f.top} />
              <stop offset="0.45" stopColor={f.colour} stopOpacity={f.mid} />
              <stop offset="1" stopColor={f.colour} stopOpacity="0" />
            </linearGradient>
          ))}
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {layers.map((layer, i) => (
          <path key={i} data-layer="fill" d={wavePath(W, H, layer, { closed: true })} fill={`url(#${fills[i]!.id})`} />
        ))}
        <path data-layer="rim" d={wavePath(W, H, layers[1]!, { closed: false })} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <path data-layer="rim" d={wavePath(W, H, layers[0]!, { closed: false })} fill="none" stroke={`url(#${id}-rim)`} strokeOpacity="0.4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
