import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HeroSlider, type HeroSlide } from "./hero-slider";

const slides: HeroSlide[] = ["Ambre Fumé", "Bois Fumé Précieux", "L'Ambre Éternel"].map((name, i) => ({
  id: `s${i}`,
  slug: `slug-${i}`,
  name,
  concentration: "Extrait de Parfum",
  tagline: `Tagline ${i}`,
  family: "oud",
  priceFromCents: 8800 + i * 1000,
  image: { src: `/images/hero/${i}.webp`, alt: `${name} bottle`, objectPosition: "62% 50%" },
}));

const slideName = () => screen.getByTestId("current-name").textContent;

describe("HeroSlider", () => {
  it("shows the first scent and its position", () => {
    render(<HeroSlider slides={slides} />);
    expect(slideName()).toBe("Ambre Fumé");
    expect(screen.getByRole("region", { name: "Featured scents" })).toBeInTheDocument();
    expect(screen.getByText("1 of 3: Ambre Fumé")).toBeInTheDocument();
  });

  it("moves forward and backward with the arrow buttons, wrapping at both ends", async () => {
    render(<HeroSlider slides={slides} />);
    await userEvent.click(screen.getByRole("button", { name: "Next scent" }));
    expect(slideName()).toBe("Bois Fumé Précieux");
    await userEvent.click(screen.getByRole("button", { name: "Previous scent" }));
    await userEvent.click(screen.getByRole("button", { name: "Previous scent" }));
    expect(slideName()).toBe("L'Ambre Éternel");
    await userEvent.click(screen.getByRole("button", { name: "Next scent" }));
    expect(slideName()).toBe("Ambre Fumé");
  });

  it("responds to the arrow keys", async () => {
    render(<HeroSlider slides={slides} />);
    screen.getByRole("button", { name: "Next scent" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(slideName()).toBe("Bois Fumé Précieux");
    await userEvent.keyboard("{ArrowLeft}");
    expect(slideName()).toBe("Ambre Fumé");
  });

  it("links the current scent to its product page", () => {
    render(<HeroSlider slides={slides} />);
    expect(screen.getByRole("link", { name: /explore ambre fumé/i })).toHaveAttribute("href", "/product/slug-0");
  });

  it("still renders the headline and call to action with no slides", () => {
    render(<HeroSlider slides={[]} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /discover collection/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next scent" })).not.toBeInTheDocument();
  });

  it("renders a slide's backdrop behind its artwork", () => {
    const withBackdrop: HeroSlide[] = [{ ...slides[0]!, image: { ...slides[0]!.image, backdrop: "/images/hero/silk-backdrop.webp" } }];
    const { container } = render(<HeroSlider slides={withBackdrop} />);
    expect(container.querySelector('img[src*="silk-backdrop"]')).toBeInTheDocument();
  });
});
