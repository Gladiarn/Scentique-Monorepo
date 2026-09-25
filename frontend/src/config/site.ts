import type { ScentFamily } from "@scentique/shared";

export interface NavChild {
  label: string;
  href: string;
  /** Shows the scent-family colour dot. */
  family?: ScentFamily;
}

export interface NavItem {
  label: string;
  href: string;
  children?: readonly NavChild[];
}

export const siteConfig = {
  name: "Scentique",
  tagline: "Small-batch perfumes made with rare ingredients.",
  nav: [
    { label: "Home", href: "/" },
    {
      label: "Shop",
      href: "/shop",
      children: [
        { label: "All scents", href: "/shop" },
        { label: "Woody", href: "/shop?family=woody", family: "woody" },
        { label: "Floral", href: "/shop?family=floral", family: "floral" },
        { label: "Citrus", href: "/shop?family=citrus", family: "citrus" },
        { label: "Oud", href: "/shop?family=oud", family: "oud" },
      ],
    },
    {
      label: "Collections",
      href: "/shop#collections",
      children: [
        { label: "New arrivals", href: "/shop?sort=newest" },
        { label: "Best sellers", href: "/shop?sort=best-selling" },
        { label: "Gift sets", href: "/shop?collection=gift-sets" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Find your scent", href: "/quiz" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
} as const;
