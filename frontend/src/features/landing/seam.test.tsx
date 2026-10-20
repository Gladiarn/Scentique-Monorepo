import { render } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Seam } from "./seam";

const motion = (reduced: boolean) =>
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });

describe("Seam", () => {
  beforeEach(() => motion(false));

  it("is decoration only: hidden from assistive tech and never takes a click", () => {
    const { container } = render(<Seam shape="swell" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.className).toContain("pointer-events-none");
  });

  it("draws three fills and a hairline along the crest", () => {
    const { container } = render(<Seam shape="tide" />);
    expect(container.querySelectorAll("path[data-layer='fill']")).toHaveLength(3);
    expect(container.querySelectorAll("path[data-layer='rim']").length).toBeGreaterThanOrEqual(1);
  });

  it("gives two seams on one page different gradient ids, so they cannot borrow each other's colours", () => {
    const { container } = render(
      <>
        <Seam shape="swell" />
        <Seam shape="swell" />
      </>,
    );
    const ids = [...container.querySelectorAll("linearGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mirrors the line when flipped, so a repeated shape does not read as a repeat", () => {
    const { container } = render(<Seam shape="ridge" flip />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("-scale-x-100");
  });

  describe("moving with scroll", () => {
    afterEach(() => vi.restoreAllMocks());

    const scrolled = () => act(async () => { window.dispatchEvent(new Event("scroll")); await new Promise((resolve) => setTimeout(resolve, 60)); });

    const place = (root: HTMLElement, top: number) =>
      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({ top, bottom: top + 120, height: 120, left: 0, right: 1000, width: 1000, x: 0, y: top, toJSON: () => ({}) });

    it("redraws its lines as it crosses the screen, so the waves travel", async () => {
      const { container } = render(<Seam shape="swell" />);
      const root = container.firstElementChild as HTMLElement;
      const crest = () => container.querySelector("path[data-layer='rim']")!.getAttribute("d");
      place(root, 700);
      await scrolled();
      const entering = crest();
      place(root, 100);
      await scrolled();
      expect(crest()).not.toBe(entering);
    });

    it("keeps still when the visitor asks for reduced motion", async () => {
      motion(true);
      const { container } = render(<Seam shape="swell" />);
      const root = container.firstElementChild as HTMLElement;
      const before = container.querySelector("path[data-layer='rim']")!.getAttribute("d");
      place(root, 100);
      await scrolled();
      expect(container.querySelector("path[data-layer='rim']")!.getAttribute("d")).toBe(before);
    });
  });
});
