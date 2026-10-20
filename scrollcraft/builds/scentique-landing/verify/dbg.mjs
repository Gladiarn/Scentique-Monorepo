import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const top = document.getElementById("top");
    const seams = [...document.querySelectorAll('[style*="--seam"]')];
    window.scrollTo({ top: seams[0].getBoundingClientRect().top + scrollY - 630, behavior: "instant" });
    return new Promise((res) => setTimeout(() => res({
      seam: seams[0].getBoundingClientRect().toJSON(),
      close: document.getElementById("close").getBoundingClientRect().toJSON(),
      closeFrame: document.querySelector("#close > div").getBoundingClientRect().toJSON(),
      reviews: document.getElementById("reviews").getBoundingClientRect().toJSON(),
      x: top.style.getPropertyValue("--x"), p: top.style.getPropertyValue("--p"), frame: top.firstElementChild && document.querySelector("#top > div").getBoundingClientRect().toJSON(),
    }), 800));
  });
  console.log(JSON.stringify(r, (k, v) => (typeof v === "number" ? Math.round(v) : v)));
} finally { await browser.close(); }
