import type { MediaAsset, Product } from "@scentique/shared";

type WithMedia = Pick<Product, "media">;

/** Landing hero artwork only. Products without it are not shown in the hero. */
export function heroArt(product: WithMedia): MediaAsset | undefined {
  return product.media.find((m) => m.role === "hero");
}

/** Image for shop and product pages: a real photo if the product has one, otherwise its first image. */
export function photoMedia(product: WithMedia): MediaAsset | undefined {
  return product.media.find((m) => m.role !== "hero") ?? product.media[0];
}
