import { wavePath } from "@/lib/wave";

/* Even period counts, so the half-width drift loops seamlessly. */
const LAYERS = [
  { d: wavePath({ width: 2880, height: 320, base: 168, amplitude: 46, periods: 4 }), fill: "color-mix(in oklab, var(--color-oud) 60%, transparent)", seconds: 52, reverse: false },
  { d: wavePath({ width: 2880, height: 320, base: 204, amplitude: 34, periods: 6, phase: 1.1 }), fill: "color-mix(in oklab, var(--color-accent) 42%, transparent)", seconds: 38, reverse: true },
  { d: wavePath({ width: 2880, height: 320, base: 250, amplitude: 26, periods: 8, phase: 2.2 }), fill: "var(--color-page)", seconds: 30, reverse: false },
] as const;

const GRADIENT = [
  "linear-gradient(118deg,",
  "var(--color-page) 0%,",
  "color-mix(in oklab, var(--color-oud) 34%, var(--color-page)) 42%,",
  "color-mix(in oklab, var(--color-woody) 40%, var(--color-page)) 74%,",
  "color-mix(in oklab, var(--color-accent) 32%, var(--color-page)) 100%)",
].join(" ");

/** Layered waving banner in the brand's warm gradient, in the spirit of capsule-render's "waving" type. Self-hosted, no external service. */
export function WaveBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ background: GRADIENT }}>
      {LAYERS.map((layer, i) => (
        <svg
          key={i}
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          className="animate-wave-drift absolute bottom-0 left-0 h-[46%] w-[200%]"
          style={{ animationDuration: `${layer.seconds}s`, animationDirection: layer.reverse ? "reverse" : "normal" }}
        >
          <path d={layer.d} fill={layer.fill} />
        </svg>
      ))}
    </div>
  );
}
