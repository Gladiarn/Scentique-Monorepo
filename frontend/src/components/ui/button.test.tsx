import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders its label as a focusable button", () => {
    render(<Button>Add to bag</Button>);
    const el = screen.getByRole("button", { name: "Add to bag" });
    el.focus();
    expect(el).toHaveFocus();
  });

  it("forwards disabled", () => {
    render(<Button disabled>Sold out</Button>);
    expect(screen.getByRole("button", { name: "Sold out" })).toBeDisabled();
  });

  it("renders a link when href is given", () => {
    render(<Button href="/shop">Shop all</Button>);
    expect(screen.getByRole("link", { name: "Shop all" })).toHaveAttribute("href", "/shop");
  });

  it("has a glass pill variant: outlined, translucent, light blur, uppercase, fully rounded", () => {
    render(<Button href="/shop" variant="glass">Discover collection</Button>);
    const cls = screen.getByRole("link", { name: "Discover collection" }).className;
    for (const c of ["rounded-pill", "uppercase", "tracking-[0.16em]", "backdrop-blur-glass", "border-ink/35"]) expect(cls).toContain(c);
  });
});
