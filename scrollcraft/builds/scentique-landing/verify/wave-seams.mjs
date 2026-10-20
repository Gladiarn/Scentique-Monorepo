import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
import { mkdirSync } from "node:fs";
const out = process.argv[2]; mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const killer = setTimeout(() => browser.close().finally(() => process.exit(2)), 170000);
try {
  for (const [name, w, h] of [["desk", 1440, 900], ["phone", 390, 844]]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(1500);
    const n = await page.locator('[style*="--seam"]').count();
    for (let i = 0; i < n; i++) {
      await page.evaluate((idx) => { const el = document.querySelectorAll('[style*="--seam"]')[idx]; window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.5, behavior: "instant" }); }, i);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${out}/${name}-seam${i + 1}.png`, timeout: 30000 });
      console.log(name, "seam", i + 1, "ok");
    }
    await page.context().close();
  }
} finally { clearTimeout(killer); await browser.close(); }
