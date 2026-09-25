import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = path.join(__dirname, "..");
const tokens = readFileSync(path.join(__dirname, "tokens.css"), "utf8");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(css|tsx?)$/.test(entry) && !entry.includes(".test.") ? [full] : [];
  });
}

describe("glass consistency", () => {
  it("defines one glass blur of exactly 10px", () => {
    expect(tokens).toMatch(/--blur-glass:\s*10px;/);
  });

  it("every backdrop blur in the app uses that single glass token", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(srcRoot)) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(/backdrop-blur[\w\-\[\]]*/g)) {
        if (match[0] !== "backdrop-blur-glass") offenders.push(`${path.relative(srcRoot, file)}: ${match[0]}`);
      }
      if (/backdrop-filter\s*:/.test(text)) offenders.push(`${path.relative(srcRoot, file)}: raw backdrop-filter`);
    }
    expect(offenders).toEqual([]);
  });
});
