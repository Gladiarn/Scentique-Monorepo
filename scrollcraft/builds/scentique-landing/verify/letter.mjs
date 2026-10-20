import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
const out = process.argv[2];
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { const c = document.getElementById("close"); window.scrollTo({ top: c.getBoundingClientRect().top + scrollY + 0.45 * innerHeight, behavior: "instant" }); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${out}/letter.png` });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/footer2.png` });
  // smooth wheel: one big wheel flick, sample scrollY over frames
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(800);
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 1200);
  const ys = [];
  for (let i = 0; i < 8; i++) { ys.push(Math.round(await page.evaluate(() => scrollY))); await page.waitForTimeout(60); }
  console.log("scrollY after one 1200px wheel flick:", ys.join(", "));
} finally { await browser.close(); }
