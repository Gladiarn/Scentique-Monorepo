import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const tokens = readFileSync(path.join(__dirname, "tokens.css"), "utf8");

const REQUIRED_COLORS = [
  "page",
  "surface",
  "raised",
  "line",
  "ink",
  "muted",
  "accent",
  "woody",
  "floral",
  "citrus",
  "oud",
  "success",
  "warning",
  "danger",
];

describe("design tokens", () => {
  it.each(REQUIRED_COLORS)("defines --color-%s as a hex value", (name) => {
    expect(tokens).toMatch(new RegExp(`--color-${name}:\\s*#[0-9A-Fa-f]{6};`));
  });

  it("defines the display and body font variables", () => {
    expect(tokens).toMatch(/--font-display:/);
    expect(tokens).toMatch(/--font-body:/);
  });

  it("defines a radius family and a type scale", () => {
    for (const v of ["--radius-sm", "--radius-md", "--radius-lg", "--text-base", "--text-display"]) {
      expect(tokens).toContain(v);
    }
  });

  it("is the only stylesheet or component file that contains hex colours", () => {
    const srcRoot = path.join(__dirname, "..");
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (/\.(css|tsx?)$/.test(entry) && !full.endsWith("tokens.css") && !entry.endsWith(".test.ts")) {
          if (/#[0-9A-Fa-f]{6}\b/.test(readFileSync(full, "utf8"))) offenders.push(path.relative(srcRoot, full));
        }
      }
    };
    walk(srcRoot);
    expect(offenders).toEqual([]);
  });
});
