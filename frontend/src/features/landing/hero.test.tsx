import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Hero } from "./hero";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  });
});

describe("Hero", () => {
  it("is the #top landmark: a tall scroll section holding a sticky, full-screen clip", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "top");
    expect(section).toHaveAttribute("data-scrub-section");
    expect(section.className).toContain("svh]");
    expect(section.className).not.toContain("overflow-hidden");
    expect(section.querySelector(".sticky")).toBeInTheDocument();
  });

  it("scrubs the real Flow clips, with each clip's own first frame as the poster", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("video")).toHaveAttribute("src", "/media/hero-m.mp4");
    expect(container.querySelector("picture source")).toHaveAttribute("srcset", "/media/hero-poster.webp");
    expect(container.querySelector("[role=img]")).toHaveAttribute("aria-label", expect.stringMatching(/bottle/i));
  });

  it("leads with the headline, one accent phrase, and one main call to action", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Made in small batches from rare ingredients");
    expect(h1.querySelector("em")?.className).toContain("font-accent");
    expect(screen.getByRole("link", { name: /discover collection/i })).toHaveAttribute("href", "/shop");
  });

  it("offers the four scent families as a way into the shop", () => {
    render(<Hero />);
    const list = screen.getByRole("list", { name: /browse by scent family/i });
    expect([...list.querySelectorAll("a")].map((a) => a.getAttribute("href")).sort()).toEqual([
      "/shop?family=citrus",
      "/shop?family=floral",
      "/shop?family=oud",
      "/shop?family=woody",
    ]);
  });

  it("keeps the copy short on phones so it never covers the bottle's label: only headline and button there", () => {
    render(<Hero />);
    const line = screen.getByText(/four scent families, blended by hand/i);
    expect(line.className).toContain("hidden");
    expect(line.className).toContain("md:block");
    const list = screen.getByRole("list", { name: /browse by scent family/i });
    expect(list.className).toContain("hidden");
    expect(list.className).toContain("md:flex");
  });
});

