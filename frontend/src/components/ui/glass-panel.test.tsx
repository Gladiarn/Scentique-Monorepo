import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlassPanel } from "./glass-panel";

describe("GlassPanel (plain glass)", () => {
  it("blurs what is behind it with the shared glass blur and has a hairline border", () => {
    render(<GlassPanel data-testid="g">content</GlassPanel>);
    const cls = screen.getByTestId("g").className;
    expect(cls).toContain("backdrop-blur-glass");
    expect(cls).toMatch(/\bborder\b/);
  });

  it("adds no colour of its own: no fill, no sheen, so the background shows through untouched", () => {
    const { container } = render(<GlassPanel data-testid="g">content</GlassPanel>);
    expect(screen.getByTestId("g").className).not.toMatch(/(^|\s)bg-/);
    expect(container.querySelector("[class*='bg-gradient']")).toBeNull();
    expect(screen.getByTestId("g").className).not.toMatch(/shadow-/);
  });

  it("renders its children", () => {
    render(<GlassPanel>hello</GlassPanel>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
