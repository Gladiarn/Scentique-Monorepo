import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NavDropdown } from "./nav-dropdown";

const items = [
  { label: "All scents", href: "/shop" },
  { label: "Woody", href: "/shop?family=woody" },
];

describe("NavDropdown", () => {
  it("starts closed and opens on click, exposing its links", async () => {
    render(<NavDropdown label="Shop" href="/shop" items={items} />);
    const trigger = screen.getByRole("button", { name: /shop/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Woody" })).not.toBeInTheDocument();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Woody" })).toHaveAttribute("href", "/shop?family=woody");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<NavDropdown label="Shop" href="/shop" items={items} />);
    const trigger = screen.getByRole("button", { name: /shop/i });
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes when a link is chosen", async () => {
    render(<NavDropdown label="Shop" href="/shop" items={items} />);
    await userEvent.click(screen.getByRole("button", { name: /shop/i }));
    await userEvent.click(screen.getByRole("link", { name: "All scents" }));
    expect(screen.queryByRole("link", { name: "All scents" })).not.toBeInTheDocument();
  });
});
