import { describe, expect, it } from "vitest";
import { WAVE_SHAPES, waveCrest, wavePath } from "./wave";

describe("waveCrest", () => {
  it("stays inside the band however many harmonics are stacked", () => {
    for (const shape of Object.values(WAVE_SHAPES)) {
      for (let x = 0; x <= 1; x += 0.01) {
        const y = waveCrest(x, 120, shape.layers[0]!);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(120);
      }
    }
  });

  it("moves when the phase moves, so layers do not trace the same line", () => {
    const a = waveCrest(0.3, 120, { base: 0.5, harmonics: [{ cycles: 1.5, amp: 0.3, phase: 0 }] });
    const b = waveCrest(0.3, 120, { base: 0.5, harmonics: [{ cycles: 1.5, amp: 0.3, phase: 1.2 }] });
    expect(a).not.toBeCloseTo(b, 1);
  });
});

describe("wavePath", () => {
  const layer = WAVE_SHAPES.swell.layers[0]!;

  it("opens at the left edge, runs to the right edge, and closes along the bottom as a fill", () => {
    const d = wavePath(1440, 120, layer, { closed: true });
    expect(d.startsWith("M0 ")).toBe(true);
    expect(d).toContain("L1440 ");
    expect(d.endsWith("Z")).toBe(true);
  });

  it("is an open line for the hairline", () => {
    expect(wavePath(1440, 120, layer, { closed: false }).endsWith("Z")).toBe(false);
  });

  it("gives each named shape its own line", () => {
    const lines = Object.values(WAVE_SHAPES).map((s) => wavePath(1440, 120, s.layers[0]!, { closed: false }));
    expect(new Set(lines).size).toBe(lines.length);
  });
});
