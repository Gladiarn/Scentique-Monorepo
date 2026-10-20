import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Close } from "./close";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
});

describe("Close (the resolved ending)", () => {
  it("pins the ending: a tall section with a sticky screen, so the last feeling holds", () => {
    const { container } = render(<Close />);
    const section = container.querySelector("section")!;
    expect(section).toHaveAttribute("id", "close");
    expect(section.className).toMatch(/h-\[\d+svh\]/);
    expect(section.className).not.toContain("overflow-hidden");
    expect(section.querySelector(".sticky")).toBeInTheDocument();
  });

  it("closes on the house line and one clear ask", () => {
    render(<Close />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Small-batch perfumes made with rare ingredients.");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/shop");
  });

  it("uses a decorative photograph behind the type, never as the only carrier of meaning", () => {
    const { container } = render(<Close />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
  });

  it("arrives out of the page colour: a top fade that clears as the section comes in, so no hard edge meets the reviews", () => {
    const { container } = render(<Close />);
    const fade = container.querySelector("[data-plane=enter]")!;
    expect(fade).toHaveAttribute("aria-hidden", "true");
    expect(fade.className).toContain("from-page");
    expect((fade as HTMLElement).style.opacity).toContain("var(--e");
    expect(container.querySelector("section")).toHaveAttribute("data-scrub-section");
  });
});

