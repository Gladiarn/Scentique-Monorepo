// Usage: node scripts/screenshot.mjs <path> <name> [--full]
// Writes .shots/<name>-desktop.png (1440) and .shots/<name>-mobile.png (390) from the running dev server.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [, , route = "/", name = "page", flag] = process.argv;
const full = flag === "--full";
const base = process.env.BASE_URL ?? "http://localhost:3000";
mkdirSync(".shots", { recursive: true });

const browser = await chromium.launch();
try {
  for (const [label, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    let lastErr;
    for (let i = 0; i < 40; i++) {
      try {
        await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
        lastErr = undefined;
        break;
      } catch (e) {
        lastErr = e;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    if (lastErr) throw lastErr;
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `.shots/${name}-${label}.png`, fullPage: full });
    await ctx.close();
  }
  console.log(`saved .shots/${name}-desktop.png and .shots/${name}-mobile.png`);
} finally {
  await browser.close();
}
