export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Scentique",
  tagline: "Small-batch perfumes made with rare ingredients.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Account", href: "/account" },
  ] satisfies NavItem[],
} as const;
