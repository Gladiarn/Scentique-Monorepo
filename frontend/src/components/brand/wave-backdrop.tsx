import { wavePath } from "@/lib/wave";

/*
 * Tonal browns only. The wave in front is the page colour, so it flows into whatever follows; each wave behind
 * it is a lighter brown (more of --color-woody mixed into the page colour). Back to front, so lightest first.
 * Even period counts, so the half-width drift loops seamlessly.
 */
const brown = (percent: number) => `color-mix(in oklab, var(--color-woody) ${percent}%, var(--color-page))`;

const LAYERS = [
  { d: wavePath({ width: 2880, height: 320, base: 150, amplitude: 42, periods: 4 }), fill: brown(36), seconds: 58, reverse: false },
  { d: wavePath({ width: 2880, height: 320, base: 184, amplitude: 36, periods: 6, phase: 1.1 }), fill: brown(26), seconds: 46, reverse: true },
  { d: wavePath({ width: 2880, height: 320, base: 218, amplitude: 30, periods: 8, phase: 2.2 }), fill: brown(15), seconds: 36, reverse: false },
  { d: wavePath({ width: 2880, height: 320, base: 252, amplitude: 24, periods: 6, phase: 3.3 }), fill: "var(--color-page)", seconds: 28, reverse: true },
] as const;

/* The sky above the waves: the lightest brown, fading a little darker toward the waves. */
const SKY = `linear-gradient(180deg, ${brown(46)} 0%, ${brown(40)} 100%)`;

/** Layered waving banner in tonal browns, in the spirit of capsule-render's "waving" type. Self-hosted, no external service. */
export function WaveBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ background: SKY }}>
      {LAYERS.map((layer, i) => (
        <svg
          key={i}
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          className="animate-wave-drift absolute bottom-0 left-0 h-[52%] w-[200%]"
          style={{ animationDuration: `${layer.seconds}s`, animationDirection: layer.reverse ? "reverse" : "normal" }}
        >
          <path d={layer.d} fill={layer.fill} />
        </svg>
      ))}
    </div>
  );
}
