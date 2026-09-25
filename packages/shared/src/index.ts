export type ScentFamily = "woody" | "floral" | "citrus" | "oud";
export type Gender = "feminine" | "masculine" | "unisex";
export type Concentration = "eau_de_toilette" | "eau_de_parfum" | "extrait";

/** `promptBrief` is the description used to generate the real image; mirrored in docs/image-briefs.md. */
export interface MediaAsset {
  src?: string;
  alt: string;
  promptBrief: string;
  /** CSS object-position so tall crops of a wide photo keep the bottle in frame. */
  objectPosition?: string;
  /** Crop position on large screens, when the subject sits differently in a wide frame than in a narrow one. */
  objectPositionDesktop?: string;
  /** Art with its own dark background: fade its outer edges into the page background instead of showing a hard box. */
  featherEdges?: boolean;
  /** Photo layered under transparent artwork (e.g. a traced SVG) so the scene keeps its backdrop. */
  backdrop?: string;
  /** `hero` is landing-page artwork; `photo` is a real product photograph for shop and product pages. */
  role?: "hero" | "photo";
}

export interface Variant {
  id: string;
  sku: string;
  sizeMl: number;
  concentration: Concentration;
  priceCents: number;
  stock: number;
}

export interface Notes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  family: ScentFamily;
  gender: Gender;
  notes: Notes;
  variants: Variant[];
  media: MediaAsset[];
  featured: boolean;
  createdAt: string;
}

export interface ProductFilters {
  family?: ScentFamily;
  gender?: Gender;
  maxPriceCents?: number;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  family: ScentFamily;
  media: MediaAsset;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  productSlug: string;
}
