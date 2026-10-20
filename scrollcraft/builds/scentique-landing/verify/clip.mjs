import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
const [idx, off, y, hgt, file] = [Number(process.argv[2]), Number(process.argv[3]), Number(process.argv[4]), Number(process.argv[5]), process.argv[6]];
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.evaluate(([i, o]) => { const s = [...document.querySelectorAll('[style*="--seam"]')][i]; window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - o, behavior: "instant" }); }, [idx, off]);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: file, clip: { x: 0, y, width: 1440, height: hgt } });
} finally { await browser.close(); }
