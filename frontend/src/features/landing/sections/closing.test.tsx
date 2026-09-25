import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClosingSection } from "./closing";

describe("ClosingSection (waves and text only, compact)", () => {
  it("puts the text directly on the waves, not inside a card", () => {
    render(<ClosingSection />);
    const heading = screen.getByRole("heading", { level: 2, name: /not sure where to start/i });
    expect(heading.closest(".backdrop-blur-glass")).toBeNull();
  });

  it("keeps the modest heading size, not the display size", () => {
    render(<ClosingSection />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("text-3xl");
    expect(heading.className).not.toContain("text-display");
  });

  it("keeps the accent phrase and leads to the quiz", () => {
    render(<ClosingSection />);
    expect(screen.getByRole("heading", { level: 2 }).querySelector("em")).not.toBeNull();
    expect(screen.getByRole("link", { name: /find your scent/i })).toHaveAttribute("href", "/quiz");
  });

  it("uses the same glass pill button as the hero, with an arrow", () => {
    render(<ClosingSection />);
    const cta = screen.getByRole("link", { name: /find your scent/i });
    for (const cls of ["rounded-pill", "uppercase", "tracking-[0.16em]", "backdrop-blur-glass"]) expect(cta.className).toContain(cls);
    expect(cta.querySelector("svg")).not.toBeNull();
  });
});
