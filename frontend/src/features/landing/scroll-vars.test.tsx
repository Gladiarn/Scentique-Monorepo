import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollVars } from "./scroll-vars";

function media(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });
}
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0; // synchronous in tests, so the id must stay falsy or the next scroll is ignored
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ScrollVars", () => {
  it("publishes the section's scroll progress as the CSS variable --p, so planes can move without re-rendering React", () => {
    media(false);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: -916, height: 2600 } as DOMRect);
    const { container } = render(<section data-scrub-section=""><ScrollVars /></section>);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    // 916 / (2600 - 768) = 0.5
    expect(Number((container.querySelector("section") as HTMLElement).style.getPropertyValue("--p"))).toBeCloseTo(0.5, 3);
  });

  it("also publishes how far the section has entered (--e) and is leaving (--x), so its edges can dissolve into its neighbours", () => {
    media(false);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 384, bottom: 2984, height: 2600 } as DOMRect);
    const { container } = render(<section data-scrub-section=""><ScrollVars /></section>);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const el = container.querySelector("section") as HTMLElement;
    // jsdom viewport is 768 tall: entered half way, not leaving
    expect(Number(el.style.getPropertyValue("--e"))).toBeCloseTo(0.5, 3);
    expect(Number(el.style.getPropertyValue("--x"))).toBe(0);
  });

  it("leaves the planes still under reduced motion", () => {
    media(true);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: -916, height: 2600 } as DOMRect);
    const { container } = render(<section data-scrub-section=""><ScrollVars /></section>);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect((container.querySelector("section") as HTMLElement).style.getPropertyValue("--p")).toBe("");
  });
});
