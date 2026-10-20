import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("is the page's contentinfo landmark and says who the house is, without any draft wording", () => {
    render(<SiteFooter />);
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/small-batch perfumes made with rare ingredients/i)).toBeInTheDocument();
    expect(within(footer).getByText(/twelve-litre/i)).toBeInTheDocument();
    expect(footer).not.toHaveTextContent(/placeholder|draft/i);
  });

  it("links each scent family to the shop filtered to it", () => {
    render(<SiteFooter />);
    for (const [name, family] of [["Woody", "woody"], ["Floral", "floral"], ["Citrus", "citrus"], ["Oud", "oud"]]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", `/shop?family=${family}`);
    }
  });

  it("points to the quiz, the process, the bag and the account", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /find your scent/i })).toHaveAttribute("href", "/#quiz");
    expect(screen.getByRole("link", { name: /how it is made/i })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: /your bag/i })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("link", { name: /account/i })).toHaveAttribute("href", "/account");
  });

  it("states the free-shipping rule from the real threshold and the year", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/free shipping over \$150/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Scentique`))).toBeInTheDocument();
  });
});
