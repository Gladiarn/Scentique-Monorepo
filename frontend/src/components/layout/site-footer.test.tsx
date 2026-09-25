import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("has no border line above it, so sections blend into it", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo").className).not.toMatch(/\bborder(-t|-b)?\b/);
  });

  it("still separates the copyright row with a hairline", () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelector(".border-t")).not.toBeNull();
  });
});
