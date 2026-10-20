import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("names the brand once as the way home, and gives the primary navigation", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Scentique" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const label of ["Home", "Shop", "Account"]) expect(nav).toHaveTextContent(label);
  });

  it("always shows the way to the bag, with its count", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /^bag, \d+ items?$/i })).toHaveAttribute("href", "/cart");
  });

  it("floats over the page (absolute), so the hero can run under it", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner").className).toContain("absolute");
  });
});
