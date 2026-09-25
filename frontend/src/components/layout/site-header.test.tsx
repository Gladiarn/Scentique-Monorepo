import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

beforeEach(() => scrollTo(0));

describe("SiteHeader", () => {
  it("starts expanded at the top of the page", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled", "false");
  });

  it("compacts once the page is scrolled and expands again at the top", () => {
    render(<SiteHeader />);
    scrollTo(120);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled", "true");
    scrollTo(0);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled", "false");
  });

  it("has one home link named for the brand and marks the current page", () => {
    render(<SiteHeader />);
    expect(screen.getAllByRole("link", { name: "Scentique home" })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("shows the bag count in its accessible name", () => {
    render(<SiteHeader cartCount={3} />);
    expect(screen.getByRole("link", { name: "Bag, 3 items" })).toBeInTheDocument();
  });

  it("opens and closes the mobile menu", async () => {
    render(<SiteHeader />);
    const button = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});
