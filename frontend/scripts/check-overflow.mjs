// Usage: node scripts/check-overflow.mjs [path ...]   Fails if the page scrolls horizontally at common widths.
import { chromium } from "@playwright/test";

const paths = process.argv.length > 2 ? process.argv.slice(2) : ["/"];
const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
let failed = false;
for (const path of paths) {
  for (const width of [360, 375, 390, 768, 1024, 1280, 1440]) {
    const page = await (await browser.newContext({ viewport: { width, height: 800 } })).newPage();
    await page.goto(base + path, { waitUntil: "networkidle" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const ok = scrollWidth <= width;
    if (!ok) failed = true;
    console.log(`${path} @${width}: ${ok ? "ok" : `OVERFLOW (scrollWidth ${scrollWidth})`}`);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
