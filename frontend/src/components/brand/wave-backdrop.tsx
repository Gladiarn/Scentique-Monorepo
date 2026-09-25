import { wavePath } from "@/lib/wave";

/*
 * Tonal browns only. The wave at each outer edge is the page colour, so the section blends into whatever sits above and
 * below it; every wave inside it is a lighter brown (more --color-woody mixed into the page colour). Layers are listed
 * back to front, lightest first. Even period counts, so the half-width drift loops seamlessly.
 */
const brown = (percent: number) => `color-mix(in oklab, var(--color-woody) ${percent}%, var(--color-page))`;
const opts = (base: number, amplitude: number, periods: number, phase = 0) => ({ width: 2880, height: 320, base, amplitude, periods, phase });

interface Layer {
  d: string;
  fill: string;
  seconds: number;
  reverse: boolean;
}

const layer = (o: ReturnType<typeof opts>, fill: string, seconds: number, reverse: boolean): Layer => ({ d: wavePath(o), fill, seconds, reverse });

const BOTTOM: Layer[] = [
  layer(opts(150, 42, 4), brown(36), 58, false),
  layer(opts(184, 36, 6, 1.1), brown(26), 46, true),
  layer(opts(218, 30, 8, 2.2), brown(15), 36, false),
  layer(opts(252, 24, 6, 3.3), "var(--color-page)", 28, true),
];

/* Top edge: same idea, different phases so it is not a mirror image of the bottom. Drawn upside down by its wrapper. */
const TOP: Layer[] = [
  layer(opts(160, 36, 6, 0.6), brown(36), 62, true),
  layer(opts(192, 30, 8, 1.7), brown(26), 50, false),
  layer(opts(222, 26, 6, 2.8), brown(15), 40, true),
  layer(opts(252, 20, 8, 4.0), "var(--color-page)", 32, false),
];

/* The sky between the two edges: the lightest brown, a little darker toward the waves. */
const SKY = `linear-gradient(180deg, ${brown(44)} 0%, ${brown(46)} 50%, ${brown(40)} 100%)`;

function WaveSvg({ seconds, reverse, children, height }: { seconds: number; reverse: boolean; children: React.ReactNode; height: string }) {
  return (
    <svg
      viewBox="0 0 2880 320"
      preserveAspectRatio="none"
      className={`animate-wave-drift absolute bottom-0 left-0 w-[200%] ${height}`}
      style={{ animationDuration: `${seconds}s`, animationDirection: reverse ? "reverse" : "normal" }}
    >
      {children}
    </svg>
  );
}

/** Layered waving banner in tonal browns, waves on both edges, in the spirit of capsule-render's "waving" type. Self-hosted. */
export function WaveBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ background: SKY }}>
      <div data-edge="top" className="absolute inset-x-0 -top-px h-[calc(22%+1px)] rotate-180 overflow-hidden">
        {TOP.map((l, i) => (
          <WaveSvg key={i} seconds={l.seconds} reverse={l.reverse} height="h-full">
            <path d={l.d} fill={l.fill} />
          </WaveSvg>
        ))}
      </div>
      <div data-edge="bottom" className="absolute inset-x-0 -bottom-px h-[calc(34%+1px)] overflow-hidden">
        {BOTTOM.map((l, i) => (
          <WaveSvg key={i} seconds={l.seconds} reverse={l.reverse} height="h-full">
            <path d={l.d} fill={l.fill} />
          </WaveSvg>
        ))}
      </div>
    </div>
  );
}
