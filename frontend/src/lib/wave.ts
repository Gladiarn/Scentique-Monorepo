export interface Harmonic {
  /** Full sine cycles across the width. */
  cycles: number;
  /** Fraction of the band height. */
  amp: number;
  phase: number;
}

export interface WaveLayer {
  /** Resting height of the crest as a fraction of the band, 0 at the top. */
  base: number;
  harmonics: Harmonic[];
}

export interface WaveShape {
  /** Back to front: the last layer is the one that meets the next section. */
  layers: WaveLayer[];
}

const STEPS = 72;

/** Crest height in px at `x` (0..1). Harmonics are summed, then clamped so a layer never leaves its band. */
export function waveCrest(x: number, height: number, layer: WaveLayer): number {
  const swing = layer.harmonics.reduce((sum, h) => sum + h.amp * Math.sin(2 * Math.PI * h.cycles * x + h.phase), 0);
  return Math.min(height, Math.max(0, (layer.base + swing) * height));
}

/** SVG path for one layer: an open line along the crest, or a closed fill down to the bottom of the band. */
export function wavePath(width: number, height: number, layer: WaveLayer, { closed }: { closed: boolean }): string {
  const points: string[] = [];
  for (let i = 0; i <= STEPS; i += 1) {
    const x = i / STEPS;
    points.push(`${i === 0 ? "M" : "L"}${+(x * width).toFixed(1)} ${+waveCrest(x, height, layer).toFixed(1)}`);
  }
  return closed ? `${points.join(" ")} L${width} ${height} L0 ${height} Z` : points.join(" ");
}

/** The same layer moved sideways by `offset` (a fraction of the width) and with its swing scaled by `swell`. */
export function travel(layer: WaveLayer, offset: number, swell = 1): WaveLayer {
  return {
    base: layer.base,
    harmonics: layer.harmonics.map((h) => ({ cycles: h.cycles, amp: h.amp * swell, phase: h.phase + 2 * Math.PI * h.cycles * offset })),
  };
}

/** How far a band has crossed the screen: 0 as it enters at the bottom, 1 as it leaves at the top. */
export function passProgress(top: number, height: number, viewport: number): number {
  return (viewport - top) / (viewport + height);
}

/** Five seams, five different lines: a slow swell, a double tide, a leaning ridge, a rippled shore and a deep roll. */
export const WAVE_SHAPES = {
  swell: {
    layers: [
      { base: 0.34, harmonics: [{ cycles: 1.25, amp: 0.22, phase: 0.4 }] },
      { base: 0.5, harmonics: [{ cycles: 1.25, amp: 0.2, phase: 1.1 }] },
      { base: 0.66, harmonics: [{ cycles: 1.25, amp: 0.18, phase: 1.8 }] },
    ],
  },
  tide: {
    layers: [
      { base: 0.36, harmonics: [{ cycles: 1, amp: 0.16, phase: 2.2 }, { cycles: 2.6, amp: 0.08, phase: 0.3 }] },
      { base: 0.5, harmonics: [{ cycles: 1, amp: 0.14, phase: 2.9 }, { cycles: 2.6, amp: 0.08, phase: 1.1 }] },
      { base: 0.64, harmonics: [{ cycles: 1, amp: 0.12, phase: 3.6 }, { cycles: 2.6, amp: 0.07, phase: 1.9 }] },
    ],
  },
  ridge: {
    layers: [
      { base: 0.38, harmonics: [{ cycles: 0.75, amp: 0.2, phase: 0.2 }, { cycles: 1.5, amp: 0.1, phase: 1.4 }] },
      { base: 0.52, harmonics: [{ cycles: 0.75, amp: 0.18, phase: 0.8 }, { cycles: 1.5, amp: 0.09, phase: 2 }] },
      { base: 0.66, harmonics: [{ cycles: 0.75, amp: 0.16, phase: 1.4 }, { cycles: 1.5, amp: 0.08, phase: 2.6 }] },
    ],
  },
  shore: {
    layers: [
      { base: 0.4, harmonics: [{ cycles: 0.6, amp: 0.14, phase: 1 }, { cycles: 5, amp: 0.05, phase: 0.2 }] },
      { base: 0.52, harmonics: [{ cycles: 0.6, amp: 0.13, phase: 1.5 }, { cycles: 5, amp: 0.05, phase: 1.2 }] },
      { base: 0.64, harmonics: [{ cycles: 0.6, amp: 0.12, phase: 2 }, { cycles: 5, amp: 0.045, phase: 2.2 }] },
    ],
  },
  roll: {
    layers: [
      { base: 0.34, harmonics: [{ cycles: 1.75, amp: 0.2, phase: 3 }] },
      { base: 0.5, harmonics: [{ cycles: 1.75, amp: 0.18, phase: 3.6 }, { cycles: 0.5, amp: 0.1, phase: 0 }] },
      { base: 0.66, harmonics: [{ cycles: 1.75, amp: 0.16, phase: 4.2 }, { cycles: 0.5, amp: 0.1, phase: 0.6 }] },
    ],
  },
} satisfies Record<string, WaveShape>;

export type WaveName = keyof typeof WAVE_SHAPES;
