import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo, LogoLockup, LogoMark } from "./logo";

describe("Logo", () => {
  it("links home with an accessible name and shows the wordmark image", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: "Scentique home" });
    expect(link).toHaveAttribute("href", "/");
    expect(link.querySelector("img")).toHaveAttribute("src", expect.stringMatching(/scentique-wordmark\.svg$/));
  });
});

describe("LogoMark", () => {
  it("shows the icon-only mark with the brand name as its alt text", () => {
    render(<LogoMark />);
    const img = screen.getByAltText("Scentique");
    expect(img).toHaveAttribute("src", expect.stringMatching(/scentique-mark\.svg$/));
  });});

describe("LogoLockup", () => {
  it("renders the lockup as a vector image", () => {
    render(<LogoLockup />);
    expect(screen.getByAltText(/Scentique, parfums d'exception/)).toHaveAttribute("src", expect.stringMatching(/scentique-lockup\.svg$/));
  });
});
