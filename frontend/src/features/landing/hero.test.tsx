import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";
import type { HeroContent } from "./hero-content";

const content: HeroContent = {
  slug: "bois-fume-precieux",
  name: "Bois Fumé Précieux",
  concentration: "Extrait de Parfum",
  tagline: "Frankincense, cinnamon bark and smoked woods.",
  notes: { top: ["Cinnamon bark", "Pink pepper"], heart: ["Frankincense", "Dried leaves"], base: ["Smoked woods", "Amber"] },
  family: "woody",
  priceFromCents: 9200,
  image: { src: "/images/hero/art.svg", alt: "Painted bottle", objectPosition: "66% 50%", objectPositionDesktop: "64% 50%" },
  photo: { src: "/images/hero/photo.webp", alt: "Bottle photo" },
};

describe("Hero", () => {
  it("shows the headline with an accent phrase and the main call to action", () => {
    render(<Hero content={content} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.querySelector("em")?.className).toContain("font-accent");
    expect(screen.getByRole("link", { name: /discover collection/i })).toHaveAttribute("href", "/shop");
  });

  it("shows the featured scent in the card and links to its product page", () => {
    render(<Hero content={content} />);
    expect(screen.getByTestId("hero-scent-name").textContent).toBe("Bois Fumé Précieux");
    expect(screen.getByRole("link", { name: /explore bois fumé précieux/i })).toHaveAttribute("href", "/product/bois-fume-precieux");
  });

  it("renders the hero artwork as the background", () => {
    render(<Hero content={content} />);
    expect(screen.getByAltText("Painted bottle")).toBeInTheDocument();
  });

  it("is a single static image: no slider controls", () => {
    render(<Hero content={content} />);
    expect(screen.queryByRole("button", { name: /next scent|previous scent/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /featured scents/i })).not.toBeInTheDocument();
  });

  it("still renders the headline and call to action when there is no content", () => {
    render(<Hero content={null} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /discover collection/i })).toBeInTheDocument();
    expect(screen.queryByTestId("hero-scent-name")).not.toBeInTheDocument();
  });

  it("the main call to action is the shared glass pill", () => {
    render(<Hero content={content} />);
    const cls = screen.getByRole("link", { name: /discover collection/i }).className;
    for (const c of ["rounded-pill", "uppercase", "tracking-[0.16em]", "backdrop-blur-glass"]) expect(cls).toContain(c);
  });

  it("the card leads with the three note tiers, top, heart and base", () => {
    render(<Hero content={content} />);
    const card = screen.getByRole("link", { name: /explore bois fumé précieux/i });
    for (const [label, notes] of [["Top", "Cinnamon bark, Pink pepper"], ["Heart", "Frankincense, Dried leaves"], ["Base", "Smoked woods, Amber"]]) {
      expect(card).toHaveTextContent(label!);
      expect(card).toHaveTextContent(notes!);
    }
  });

  it("the whole card is a single link, with no nested links, and shows the price", () => {
    render(<Hero content={content} />);
    const card = screen.getByRole("link", { name: /explore bois fumé précieux/i });
    expect(card.querySelectorAll("a")).toHaveLength(0);
    expect(card).toHaveTextContent("From $92.00");
    expect(card).toHaveAttribute("href", "/product/bois-fume-precieux");
  });

  it("does not repeat the tagline inside the card", () => {
    render(<Hero content={content} />);
    expect(screen.queryByText(content.tagline)).not.toBeInTheDocument();
  });
});
