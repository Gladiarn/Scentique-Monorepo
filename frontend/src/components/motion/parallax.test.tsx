import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Parallax, parallaxOffset } from "./parallax";

function media(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });
}
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("parallaxOffset", () => {
  it("is zero when the element is centred and grows with its distance from the viewport centre", () => {
    expect(parallaxOffset(400, 400, 0.1, 50)).toBe(0);
    expect(parallaxOffset(600, 400, 0.1, 50)).toBeCloseTo(20);
    expect(parallaxOffset(200, 400, 0.1, 50)).toBeCloseTo(-20);
  });

  it("never travels further than its limit", () => {
    expect(parallaxOffset(5000, 400, 0.1, 50)).toBe(50);
    expect(parallaxOffset(-5000, 400, 0.1, 50)).toBe(-50);
  });
});

describe("Parallax", () => {
  it("drifts its content as the page scrolls", () => {
    media(false);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 800, height: 200 } as DOMRect);
    const { container } = render(<Parallax depth="far">x</Parallax>);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const el = container.firstElementChild as HTMLElement;
    const y = Number(/translate3d\(0(?:px)?, (-?[\d.]+)px, 0(?:px)?\)/.exec(el.style.transform)?.[1]);
    expect(Math.abs(y)).toBeGreaterThan(1);
  });

  it("stays put under reduced motion", () => {
    media(true);
    const { container } = render(<Parallax depth="far">x</Parallax>);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect((container.firstElementChild as HTMLElement).style.transform).toBe("");
  });

  it("is purely decorative movement: it never carries a role or label of its own", () => {
    media(false);
    const { container } = render(<Parallax depth="mid">x</Parallax>);
    expect(container.firstElementChild).not.toHaveAttribute("role");
  });
});
