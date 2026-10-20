import { describe, expect, it } from "vitest";
import { WAVE_SHAPES, passProgress, travel, waveCrest, wavePath, type WaveLayer } from "./wave";

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

describe("travel", () => {
  const layer: WaveLayer = { base: 0.5, harmonics: [{ cycles: 1.25, amp: 0.2, phase: 0.4 }, { cycles: 3, amp: 0.05, phase: 1 }] };

  it("is the same line when it has not moved", () => {
    expect(travel(layer, 0)).toEqual(layer);
  });

  it("slides the line sideways: after moving by d, the crest at x is the old crest at x + d", () => {
    const moved = travel(layer, 0.1);
    for (const x of [0, 0.2, 0.55, 0.9]) expect(waveCrest(x, 100, moved)).toBeCloseTo(waveCrest(x + 0.1, 100, layer), 6);
  });

  it("swells or calms the swing without moving the resting height", () => {
    const calm = travel(layer, 0, 0.5);
    expect(calm.base).toBe(layer.base);
    expect(calm.harmonics[0]!.amp).toBeCloseTo(0.1);
  });
});

describe("passProgress", () => {
  it("is 0 as the band enters the bottom of the screen, 0.5 when centred, 1 as it leaves the top", () => {
    expect(passProgress(800, 100, 800)).toBeCloseTo(0);
    expect(passProgress(350, 100, 800)).toBeCloseTo(0.5);
    expect(passProgress(-100, 100, 800)).toBeCloseTo(1);
  });
});
