import type { Order, OrderLine, Product } from "@scentique/shared";

const NAMES = ["Ada Lovelace", "Bo Lin", "Chloe Park", "Dev Raman", "Elena Ruiz", "Farid Osei", "Grace Hale", "Hiro Sato"];
const STATUSES: Order["status"][] = ["pending", "paid", "packed", "shipped", "delivered"];

/** Deterministic pseudo-random sequence, so the admin tables look the same on every load. */
function sequence(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** Sample orders for the admin console. Clearly labelled as sample data in the UI. */
export function sampleOrders(products: Product[], count: number): Order[] {
  const rand = sequence(20260930);
  const variants = products.flatMap((p) => p.variants.map((v) => ({ product: p, variant: v })));
  const now = Date.parse("2026-10-04T00:00:00Z");

  return Array.from({ length: count }, (_, i) => {
    const lineCount = 1 + Math.floor(rand() * 3);
    const lines: OrderLine[] = Array.from({ length: lineCount }, () => {
      const { product, variant } = variants[Math.floor(rand() * variants.length)];
      return {
        variantId: variant.id,
        productName: product.name,
        sizeMl: variant.sizeMl,
        concentration: variant.concentration,
        quantity: 1 + Math.floor(rand() * 2),
        unitPriceCents: variant.priceCents,
      };
    });
    const name = NAMES[Math.floor(rand() * NAMES.length)];
    const slug = name.toLowerCase().replace(/\s+/g, ".");
    const totalCents = lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);
    return {
      id: `SC-${1001 + i}`,
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      placedAt: new Date(now - Math.floor(rand() * 90) * 86400000).toISOString(),
      email: `${slug}@example.com`,
      fullName: name,
      address: { line1: `${10 + i} Sample Street`, city: "Portland", postcode: "97201", country: "United States" },
      delivery: rand() > 0.7 ? "express" : "standard",
      lines,
      totalCents,
    };
  });
}
