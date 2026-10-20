import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.join(__dirname, "..", "app", "globals.css"), "utf8");

describe("globals.css section surfaces", () => {
  it("defines the warm brown section surfaces from tokens only: no hex, no images", () => {
    for (const name of ["surface-umber", "surface-glow"]) expect(css).toContain(`@utility ${name}`);
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/url\(/);
  });

  it("carries no leftovers from the old design: no wave drift, no hero rise", () => {
    expect(css).not.toMatch(/wave-drift|hero-rise/);
  });

  it("keeps the browser surfaces themed from the palette: scrollbar, selection and visible focus", () => {
    expect(css).toContain("::-webkit-scrollbar-thumb");
    expect(css).toContain("::selection");
    expect(css).toContain(":focus-visible");
  });
});

