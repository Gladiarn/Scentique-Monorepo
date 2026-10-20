import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Embers, emberSpecs } from "./embers";

function media(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });
}

describe("emberSpecs", () => {
  it("is deterministic, so server and client agree", () => {
    expect(emberSpecs(24)).toEqual(emberSpecs(24));
    expect(emberSpecs(24)).toHaveLength(24);
  });

  it("keeps every ember on screen, small, and moving at its own rate", () => {
    const specs = emberSpecs(24);
    for (const e of specs) {
      expect(e.x).toBeGreaterThanOrEqual(0);
      expect(e.x).toBeLessThanOrEqual(100);
      expect(e.y).toBeGreaterThanOrEqual(0);
      expect(e.y).toBeLessThanOrEqual(100);
      expect(e.size).toBeGreaterThanOrEqual(2);
      expect(e.size).toBeLessThanOrEqual(5);
    }
    expect(new Set(specs.map((e) => e.rate)).size).toBeGreaterThan(3);
  });
});

describe("Embers", () => {
  it("is a decorative near plane: hidden from assistive tech and never blocking clicks", () => {
    media(false);
    const { container } = render(<Embers />);
    const plane = container.querySelector("[data-plane=front]")!;
    expect(plane).toHaveAttribute("aria-hidden", "true");
    expect(plane.className).toContain("pointer-events-none");
    expect(plane.children.length).toBeGreaterThan(10);
  });

  it("is not rendered under reduced motion", () => {
    media(true);
    const { container } = render(<Embers />);
    expect(container.querySelector("[data-plane=front]")).toBeNull();
  });
});
