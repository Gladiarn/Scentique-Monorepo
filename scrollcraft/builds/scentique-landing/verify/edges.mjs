import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const out = process.argv[2]; const [w, h] = [Number(process.argv[3] ?? 1440), Number(process.argv[4] ?? 900)];
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const killer = setTimeout(() => browser.close().finally(() => process.exit(2)), 240000);
try {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1500);
  const n = await page.locator('[style*="--seam"]').count();
  const files = [];
  for (let i = 0; i < n; i++) for (const f of [0.3, 0.7]) {
    await page.evaluate(([idx, fr]) => { const el = document.querySelectorAll('[style*="--seam"]')[idx]; window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * fr, behavior: "instant" }); }, [i, f]);
    await page.waitForTimeout(1200);
    const file = `${out}/s${i + 1}-${f}.png`; await page.screenshot({ path: file, timeout: 30000 }); files.push(file);
  }
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/footer.png`, timeout: 30000 }); files.push(`${out}/footer.png`);
  console.log(files.join("\n"));
} finally { clearTimeout(killer); await browser.close(); }
