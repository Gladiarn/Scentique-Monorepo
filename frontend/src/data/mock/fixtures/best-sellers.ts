/*
 * Static best-seller ranking, best first. This is a stand-in: the real ranking comes from sales data,
 * which only exists once the backend does. ApiProductRepository.findBestSellers replaces this list.
 */
export const bestSellerSlugs = ["ambre-fume", "bois-fume-precieux", "nocturne-absolu", "mystique-bois", "l-ambre-sauvage", "l-ambre-eternel"] as const;
