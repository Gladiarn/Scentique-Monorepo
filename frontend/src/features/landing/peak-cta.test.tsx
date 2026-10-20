import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PeakCta } from "./peak-cta";

function media(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }) });
}
const renderIn = () =>
  render(
    <section data-scrub-section="">
      <PeakCta href="/product/bois-fume-precieux">Shop Bois Fumé Précieux</PeakCta>
    </section>,
  );
const scrollTo = (top: number) => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top, height: 2600 } as DOMRect);
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
};

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

describe("PeakCta", () => {
  it("links to the product and is out of reach until the peak: not clickable, not focusable, not announced", () => {
    media(false);
    renderIn();
    const link = screen.getByText("Shop Bois Fumé Précieux", { selector: "a", exact: true });
    expect(link).toHaveAttribute("href", "/product/bois-fume-precieux");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link.closest("[data-visible]")).toHaveAttribute("data-visible", "false");
    expect(link.closest("[data-visible]")).toHaveAttribute("aria-hidden", "true");
    expect(link.closest("[data-visible]")!.className).toContain("pointer-events-none");
  });

  it("appears and takes clicks once the scroll reaches the peak", () => {
    media(false);
    renderIn();
    scrollTo(-1700); // 1700 / (2600 - 768) = 0.93
    const wrap = document.querySelector("[data-visible]")!;
    expect(wrap).toHaveAttribute("data-visible", "true");
    expect(wrap).not.toHaveAttribute("aria-hidden");
    expect(wrap.className).not.toContain("pointer-events-none");
    expect(screen.getByRole("link", { name: /shop bois fumé précieux/i })).not.toHaveAttribute("tabindex", "-1");
  });

  it("hides again when the visitor scrolls back up", () => {
    media(false);
    renderIn();
    scrollTo(-1700);
    scrollTo(-200);
    expect(document.querySelector("[data-visible]")).toHaveAttribute("data-visible", "false");
  });

  it("is not rendered under reduced motion, where the hero is a still with its own button", () => {
    media(true);
    renderIn();
    expect(document.querySelector("[data-visible]")).toBeNull();
  });
});
