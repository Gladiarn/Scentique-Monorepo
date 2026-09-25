import type { MediaAsset, Product } from "@scentique/shared";

type WithMedia = Pick<Product, "media">;

/** Image for the landing hero: hero artwork if the product has it, otherwise its first image. */
export function heroMedia(product: WithMedia): MediaAsset | undefined {
  return product.media.find((m) => m.role === "hero") ?? product.media[0];
}

/** Image for shop and product pages: a real photo if the product has one, otherwise its first image. */
export function photoMedia(product: WithMedia): MediaAsset | undefined {
  return product.media.find((m) => m.role !== "hero") ?? product.media[0];
}
