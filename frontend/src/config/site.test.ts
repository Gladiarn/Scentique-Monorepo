import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

const app = path.join(__dirname, "..", "app");
const pageFor = (route: string, group = "(storefront)") => path.join(app, group, route === "/" ? "" : route, "page.tsx");

describe("site skeleton", () => {
  it("has a page behind every navigation link", () => {
    for (const item of siteConfig.nav) expect(existsSync(pageFor(item.href)), item.href).toBe(true);
  });

  it("has the store routes an e-commerce site needs", () => {
    for (const route of ["/", "/shop", "/product/[slug]", "/cart", "/checkout", "/account"]) expect(existsSync(pageFor(route)), route).toBe(true);
  });

  it("keeps a place for the CRM, outside the storefront chrome", () => {
    expect(existsSync(path.join(app, "admin", "page.tsx"))).toBe(true);
  });

  it("names the brand once, in config", () => {
    expect(siteConfig.name).toBe("Scentique");
  });
});
