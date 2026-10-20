import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { productFixtures } from "@/data/mock/fixtures/products";

const repo = vi.hoisted(() => ({ findBestSellers: vi.fn() }));
vi.mock("@/data", () => ({ productRepository: repo }));

import { BestSellers } from "./best-sellers";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  repo.findBestSellers.mockResolvedValue(productFixtures.slice(0, 6));
});

describe("BestSellers (the range, as a lateral pan)", () => {
  it("is the #shop landmark with one card per scent, each linking to its product and showing its price", async () => {
    const { container } = render(await BestSellers());
    expect(container.querySelector("section")).toHaveAttribute("id", "shop");
    expect(screen.getByRole("heading", { level: 2, name: /best sellers/i })).toBeInTheDocument();
    const first = productFixtures[0]!;
    const link = screen.getByRole("link", { name: new RegExp(first.name) });
    expect(link).toHaveAttribute("href", `/product/${first.slug}`);
    expect(link).toHaveTextContent(/\$\d+/);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /view all perfumes/i })).toHaveAttribute("href", "/shop");
  });

  it("pans on wide screens: a tall section, a sticky window, and a track moved by the scroll variable", async () => {
    const { container } = render(await BestSellers());
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("data-scrub-section");
    expect(section.className).toMatch(/md:h-\[\d+svh\]/);
    expect(container.querySelector(".md\\:sticky")).toBeInTheDocument();
    expect(container.querySelector("ul")!.className).toContain("var(--p");
  });

  it("falls back to a native swipe row on phones and under reduced motion, so every card stays reachable", async () => {
    const { container } = render(await BestSellers());
    const track = container.querySelector("ul")!;
    expect(track.className).toContain("overflow-x-auto");
    expect(track.className).toContain("snap-x");
    expect(track.className).toContain("motion-reduce:overflow-x-auto");
    expect(track.className).toContain("motion-reduce:transform-none");
  });

  it("keeps the left gutter when a card snaps into place, so the first card never sits flush against the screen edge", async () => {
    const { container } = render(await BestSellers());
    expect(container.querySelector("ul")!.className).toContain("scroll-px-6");
  });

  it("says so plainly when nothing is on the shelf, and still offers the shop", async () => {
    repo.findBestSellers.mockResolvedValue([]);
    render(await BestSellers());
    expect(screen.getByText(/no scents are on the shelf right now/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view all perfumes/i })).toBeInTheDocument();
  });
});
