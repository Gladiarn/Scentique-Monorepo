import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/data", () => ({
  productRepository: {
    findHeroFeatured: vi.fn().mockResolvedValue({
      id: "p", slug: "bois-fume-precieux", name: "Bois Fumé Précieux",
      notes: { top: ["Cinnamon bark", "Pink pepper"], heart: ["Frankincense", "Dried leaves"], base: ["Smoked woods", "Amber"] },
    }),
    findFeatured: vi.fn().mockResolvedValue([]),
  },
}));

import { Hero } from "./hero";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  });
});

describe("Hero", () => {
  it("is the #top landmark: a tall scroll section holding a sticky, full-screen clip", async () => {
    const { container } = render(await Hero());
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "top");
    expect(section).toHaveAttribute("data-scrub-section");
    expect(section.className).toContain("svh]");
    expect(section.className).not.toContain("overflow-hidden");
    expect(section.querySelector(".sticky")).toBeInTheDocument();
  });

  it("scrubs the real Flow clips, with each clip's own first frame as the poster", async () => {
    const { container } = render(await Hero());
    expect(container.querySelector("video")).toHaveAttribute("src", "/media/hero-m.mp4");
    expect(container.querySelector("picture source")).toHaveAttribute("srcset", "/media/hero-poster.webp");
    expect(container.querySelector("[role=img]")).toHaveAttribute("aria-label", expect.stringMatching(/bottle/i));
  });

  it("leads with the headline, one accent phrase, and one main call to action", async () => {
    render(await Hero());
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Made in small batches from rare ingredients");
    expect(h1.querySelector("em")?.className).toContain("font-accent");
    expect(screen.getByRole("link", { name: /discover collection/i })).toHaveAttribute("href", "/shop");
  });

  it("offers the four scent families as a way into the shop", async () => {
    render(await Hero());
    const list = screen.getByRole("list", { name: /browse by scent family/i });
    expect([...list.querySelectorAll("a")].map((a) => a.getAttribute("href")).sort()).toEqual([
      "/shop?family=citrus",
      "/shop?family=floral",
      "/shop?family=oud",
      "/shop?family=woody",
    ]);
  });

  it("keeps the copy short on phones so it never covers the bottle's label: only headline and button there", async () => {
    render(await Hero());
    const line = screen.getByText(/four scent families, blended by hand/i);
    expect(line.className).toContain("hidden");
    expect(line.className).toContain("md:block");
    const list = screen.getByRole("list", { name: /browse by scent family/i });
    expect(list.className).toContain("hidden");
    expect(list.className).toContain("md:flex");
  });

  it("is built from planes: the clip behind, a headline plane that moves on its own, and a near plane of embers", async () => {
    const { container } = render(await Hero());
    expect(container.querySelector("[data-plane=type]")).toBeInTheDocument();
    expect(container.querySelector("[data-plane=front]")).toBeInTheDocument();
  });

  it("shows how the featured scent develops, from its real notes", async () => {
    render(await Hero());
    const rail = screen.getByRole("list", { name: /how the scent develops/i });
    expect(rail).toHaveTextContent("Cinnamon bark, Pink pepper");
    expect(rail).toHaveTextContent("Smoked woods, Amber");
  });

  it("sets labels in sentence case: no tracked all-caps pills", async () => {
    render(await Hero());
    expect(screen.getByRole("link", { name: /discover collection/i }).className).not.toContain("uppercase");
    const list = screen.getByRole("list", { name: /browse by scent family/i });
    expect(list.innerHTML).not.toContain("uppercase");
  });
});

