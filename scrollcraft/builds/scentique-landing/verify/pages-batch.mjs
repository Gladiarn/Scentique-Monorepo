// Verification helpers (real Chrome via playwright). Run with the dev server up; one browser at a time, they close themselves. Paths inside point at this repo.
import { chromium } from "/home/ianne/projects/Scentique-Monorepo/frontend/node_modules/@playwright/test/index.mjs";
import { mkdirSync } from "node:fs";
const out = process.argv[2]; mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const killer = setTimeout(() => browser.close().finally(() => process.exit(2)), 175000);
const cart = JSON.stringify({ state: { items: [{ variantId: "ambre-fume-50", productSlug: "ambre-fume", productName: "Ambre Fumé", sizeMl: 50, concentration: "eau_de_parfum", unitPriceCents: 12800, maxQuantity: 18, quantity: 1 }] }, version: 1 });
try {
  for (const [name, w, h] of [["desk", 1440, 900], ["phone", 390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript((c) => localStorage.setItem("scentique-cart", c), cart);
    const page = await ctx.newPage();
    const errors = []; page.on("pageerror", (e) => errors.push(e.message)); page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 140)));
    const shots = [["shop", "/shop", null], ["product", "/product/bois-fume-precieux", null], ["cart", "/cart", null], ["quiz", "/", "quiz"], ["close", "/", "close"]];
    for (const [label, url, id] of shots) {
      await page.goto("http://localhost:3000" + url, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      if (id) await page.evaluate((sid) => { const s = document.getElementById(sid); const travel = Math.max(0, s.offsetHeight - innerHeight); window.scrollTo({ top: s.getBoundingClientRect().top + scrollY + (sid === "close" ? travel * 0.5 : 0), behavior: "instant" }); }, id);
      await page.waitForTimeout(1200);
      await page.waitForFunction(() => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).every((i) => i.complete), undefined, { timeout: 15000 }).catch(() => {});
      const info = await page.evaluate(() => ({ hscroll: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy").length, bag: document.querySelector('a[aria-label^="Bag"]')?.getAttribute("aria-label") }));
      console.log(name, label, JSON.stringify(info));
      await page.screenshot({ path: `${out}/${name}-${label}.png`, timeout: 30000 });
    }
    console.log(name, "errors:", errors.length ? errors.join(" | ") : "none");
    await ctx.close();
  }
} finally { clearTimeout(killer); await browser.close(); }
