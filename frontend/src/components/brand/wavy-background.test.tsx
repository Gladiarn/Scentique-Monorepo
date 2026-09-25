import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WavyBackground } from "./wavy-background";

const ctx = {
  clearRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(),
  setTransform: vi.fn(), scale: vi.fn(), createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
};

function mockMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: reduced && q.includes("reduce"), media: q, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});
afterEach(() => vi.unstubAllGlobals());

describe("WavyBackground", () => {
  it("is hidden from assistive tech", () => {
    mockMatchMedia(true);
    const { container } = render(<WavyBackground />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("does not start an animation loop under reduced motion", () => {
    mockMatchMedia(true);
    const raf = vi.spyOn(window, "requestAnimationFrame");
    render(<WavyBackground />);
    expect(raf).not.toHaveBeenCalled();
  });

  it("animates when motion is allowed", () => {
    mockMatchMedia(false);
    const raf = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    render(<WavyBackground />);
    expect(raf).toHaveBeenCalled();
  });
});
