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
    const seams = [["hero-exit-a", "about", -0.6], ["hero-exit-b", "about", -0.3], ["close-enter-a", "close", -0.7], ["close-enter-b", "close", -0.3], ["close-exit", "footer", -0.55]];
    for (const [label, id, frac] of seams) {
      await page.evaluate(([sid, f]) => { const el = sid === "footer" ? document.querySelector("footer") : document.getElementById(sid); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + f * innerHeight, behavior: "instant" }); }, [id, frac]);
      await page.waitForTimeout(1300);
      await page.screenshot({ path: `${out}/${name}-${label}.png`, timeout: 30000 });
      console.log(name, label, "ok");
    }
    await page.context().close();
  }
} finally { clearTimeout(killer); await browser.close(); }
