import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo, LogoMark } from "./logo";

describe("Logo", () => {
  it("links home with an accessible name and shows the wordmark image", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: "Scentique home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link.querySelector("img")).toHaveAttribute("src", expect.stringContaining("scentique-wordmark"));
  });
});

describe("LogoMark", () => {
  it("shows the icon-only mark with the brand name as its alt text", () => {
    render(<LogoMark />);
    const img = screen.getByAltText("Scentique");
    expect(img).toHaveAttribute("src", expect.stringContaining("scentique-mark"));
  });
});
