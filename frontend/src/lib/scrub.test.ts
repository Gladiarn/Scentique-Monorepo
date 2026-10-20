import { describe, expect, it } from "vitest";
import { noteTierAt, sectionEdges, sectionProgress, videoTimeAt } from "./scrub";

describe("sectionProgress", () => {
  it("is 0 while the section's top is at or below the viewport top, 1 when its bottom meets the viewport bottom", () => {
    expect(sectionProgress({ top: 0, height: 2600 }, 1000)).toBe(0);
    expect(sectionProgress({ top: -800, height: 2600 }, 1000)).toBe(0.5);
    expect(sectionProgress({ top: -1600, height: 2600 }, 1000)).toBe(1);
  });

  it("clamps before and after the section", () => {
    expect(sectionProgress({ top: 300, height: 2600 }, 1000)).toBe(0);
    expect(sectionProgress({ top: -4000, height: 2600 }, 1000)).toBe(1);
  });

  it("is 0 when the section is no taller than the viewport, so nothing scrubs", () => {
    expect(sectionProgress({ top: -100, height: 900 }, 1000)).toBe(0);
    expect(sectionProgress({ top: 0, height: 1000 }, 1000)).toBe(0);
  });
});

describe("videoTimeAt", () => {
  it("maps progress onto the clip, staying just inside its last frame", () => {
    expect(videoTimeAt(0, 8)).toBe(0);
    expect(videoTimeAt(0.5, 8)).toBe(4);
    expect(videoTimeAt(1, 8)).toBeLessThan(8);
    expect(videoTimeAt(1, 8)).toBeGreaterThan(7.9);
  });

  it("clamps progress and survives a clip that has not loaded", () => {
    expect(videoTimeAt(-1, 8)).toBe(0);
    expect(videoTimeAt(2, 8)).toBe(videoTimeAt(1, 8));
    expect(videoTimeAt(0.5, 0)).toBe(0);
    expect(videoTimeAt(0.5, Number.NaN)).toBe(0);
  });
});

describe("noteTierAt", () => {
  it("walks top, heart, base as the scent develops, in equal thirds", () => {
    expect(noteTierAt(0)).toBe("top");
    expect(noteTierAt(0.32)).toBe("top");
    expect(noteTierAt(0.34)).toBe("heart");
    expect(noteTierAt(0.66)).toBe("heart");
    expect(noteTierAt(0.67)).toBe("base");
    expect(noteTierAt(1)).toBe("base");
  });

  it("clamps outside 0..1", () => {
    expect(noteTierAt(-3)).toBe("top");
    expect(noteTierAt(9)).toBe("base");
    expect(noteTierAt(Number.NaN)).toBe("top");
  });
});

describe("sectionEdges", () => {
  it("enter grows from 0 as the section's top rises from the viewport bottom to the viewport top", () => {
    expect(sectionEdges({ top: 900, bottom: 3500 }, 900).enter).toBe(0);
    expect(sectionEdges({ top: 450, bottom: 3500 }, 900).enter).toBeCloseTo(0.5);
    expect(sectionEdges({ top: 0, bottom: 3500 }, 900).enter).toBe(1);
    expect(sectionEdges({ top: -2000, bottom: 1500 }, 900).enter).toBe(1);
  });

  it("exit is 0 while the section's bottom is below the viewport, then grows as it leaves through the top", () => {
    expect(sectionEdges({ top: -1000, bottom: 1800 }, 900).exit).toBe(0);
    expect(sectionEdges({ top: -2000, bottom: 900 }, 900).exit).toBe(0);
    expect(sectionEdges({ top: -2000, bottom: 450 }, 900).exit).toBeCloseTo(0.5);
    expect(sectionEdges({ top: -2000, bottom: -50 }, 900).exit).toBe(1);
  });

  it("survives a zero-height viewport", () => {
    expect(sectionEdges({ top: 0, bottom: 100 }, 0)).toEqual({ enter: 0, exit: 0 });
  });
});

