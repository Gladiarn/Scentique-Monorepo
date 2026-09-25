import { describe, expect, it } from "vitest";
import { wavePath } from "./wave";

describe("wavePath", () => {
  const d = wavePath({ width: 2880, height: 320, base: 160, amplitude: 40, periods: 4 });

  it("draws a closed shape that starts at the left edge and fills to the bottom", () => {
    expect(d.startsWith("M0 ")).toBe(true);
    expect(d.trim().endsWith("Z")).toBe(true);
    expect(d).toContain("L2880 320");
    expect(d).toContain("L0 320");
  });

  it("starts and ends at the same height so it tiles seamlessly when it loops", () => {
    const first = Number(d.match(/^M0 ([\d.-]+)/)?.[1]);
    const last = Number(d.match(/L2880 ([\d.-]+) L2880 320/)?.[1]);
    expect(Math.abs(first - last)).toBeLessThan(0.5);
  });

  it("stays within the height so nothing is clipped", () => {
    const ys = [...d.matchAll(/[ML]-?[\d.]+ (-?[\d.]+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(320);
  });
});
