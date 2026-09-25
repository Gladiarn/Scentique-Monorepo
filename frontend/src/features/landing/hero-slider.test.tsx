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

  it("sets a valid crop position per breakpoint on each slide image", () => {
    const withCrop: HeroSlide[] = [{ ...slides[0]!, image: { ...slides[0]!.image, objectPosition: "67% 50%", objectPositionDesktop: "75% 50%" } }];
    render(<HeroSlider slides={withCrop} />);
    const img = screen.getByAltText(withCrop[0]!.image.alt) as HTMLElement;
    expect(img.style.getPropertyValue("--pos-m")).toBe("67% 50%");
    expect(img.style.getPropertyValue("--pos-d")).toBe("75% 50%");
  });

  it("renders the shared backdrop photo behind the slides", () => {
    const { container } = render(<HeroSlider slides={slides} backdrop="/images/hero/silk-backdrop.webp" />);
    expect(container.querySelector('img[src*="silk-backdrop"]')).toBeInTheDocument();
  });

  it("highlights an accent word in the headline with the accent font", () => {
    render(<HeroSlider slides={slides} />);
    const accent = screen.getByRole("heading", { level: 1 }).querySelector("em");
    expect(accent?.className).toContain("font-accent");
  });

  it("lets the thumbnail of the next scent be clicked to advance", async () => {
    render(<HeroSlider slides={slides} />);
    await userEvent.click(screen.getByRole("button", { name: "Show Bois Fumé Précieux" }));
    expect(slideName()).toBe("Bois Fumé Précieux");
  });

  it("feathers the edges of art that has its own dark background, and leaves full-bleed art alone", () => {
    const feathered: HeroSlide[] = [{ ...slides[0]!, image: { ...slides[0]!.image, featherEdges: true } }];
    const { container, unmount } = render(<HeroSlider slides={feathered} />);
    expect(container.querySelector("img[style*='mask']")).toBeInTheDocument();
    unmount();
    const plain = render(<HeroSlider slides={slides} />);
    expect(plain.container.querySelector("img[style*='mask']")).not.toBeInTheDocument();
  });
});
