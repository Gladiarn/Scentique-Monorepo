import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WaveBackdrop } from "./wave-backdrop";

function layerFills(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("svg path")).map((p) => p.getAttribute("fill") ?? "");
}

/** Share of the lighter brown (--color-woody) mixed in; 0 for the plain page colour. */
function lightness(fill: string): number {
  if (fill === "var(--color-page)") return 0;
  const m = fill.match(/var\(--color-woody\)\s+(\d+)%/);
  return m ? Number(m[1]) : Number.NaN;
}

describe("WaveBackdrop", () => {
  it("is decorative and hidden from assistive tech", () => {
    const { container } = render(<WaveBackdrop />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("has at least four waves", () => {
    const { container } = render(<WaveBackdrop />);
    expect(layerFills(container).length).toBeGreaterThanOrEqual(4);
  });

  it("the front wave matches the page background so it flows into what follows", () => {
    const { container } = render(<WaveBackdrop />);
    const fills = layerFills(container);
    expect(fills[fills.length - 1]).toBe("var(--color-page)");
  });

  it("each wave behind the front one is a lighter brown than the wave in front of it", () => {
    const { container } = render(<WaveBackdrop />);
    const values = layerFills(container).map(lightness);
    expect(values.every((v) => !Number.isNaN(v))).toBe(true);
    for (let i = 1; i < values.length; i++) expect(values[i - 1]!).toBeGreaterThan(values[i]!);
  });

  it("uses only browns: no oxblood or gold in the waves or the sky", () => {
    const { container } = render(<WaveBackdrop />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/--color-(oud|accent|floral|citrus)/);
  });
});
