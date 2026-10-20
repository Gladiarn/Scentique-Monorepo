// Usage: IDS=top,shop node tour.mjs <outDir> [width] [height] [--reduced]
// One browser, always closed, hard-killed after HARD_MS so it can never be left running.
import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
import { mkdirSync } from "node:fs";

const HARD_MS = 150_000;
const out = process.argv[2];
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);
const reduced = process.argv.includes("--reduced");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const killer = setTimeout(() => {
  console.error("hard timeout: closing browser");
  browser.close().finally(() => process.exit(2));
}, HARD_MS);

try {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: reduced ? "reduce" : "no-preference", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[error] ${m.text().slice(0, 300)}`);
  });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message.slice(0, 300)}`));

  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 90_000 });
  await page.waitForTimeout(2500);

  const ids = (process.env.IDS ?? "top,shop,collections,about,ingredients,quiz,reviews,help,contact").split(",");
  for (const id of ids) {
    await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: rect.top + window.scrollY - 72, behavior: "instant" });
    }, id);
    await page.waitForTimeout(800);
    // Lazy images only start once scrolled near; wait until every image in the page has finished.
    await page.waitForFunction(() => [...document.images].every((i) => i.complete), undefined, { timeout: 40_000 }).catch(() => console.log("images still loading for", id));
    await page.screenshot({ path: `${out}/${id}.png`, timeout: 30_000 });
    const info = await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      return { id: sectionId, h: el ? Math.round(el.getBoundingClientRect().height) : null, hscroll: document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : false };
    }, id);
    console.log(JSON.stringify(info));
  }
  console.log("errors:", errors.length ? "\n" + [...new Set(errors)].join("\n") : "none");
} finally {
  clearTimeout(killer);
  await browser.close();
}
