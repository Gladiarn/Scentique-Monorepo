import { z } from "zod";
import type { Concentration, Order, Product, ScentFamily } from "@scentique/shared";
import { ORDER_STEPS } from "@/features/account/account-logic";

export const LOW_STOCK_THRESHOLD = 3;

export const FAMILIES: ScentFamily[] = ["woody", "floral", "citrus", "oud"];

/** Revenue per scent family from order lines, in cents. Lines whose product no longer exists are skipped. */
export function revenueByFamily(orders: Order[], products: Product[]): Record<ScentFamily, number> {
  const familyByName = new Map(products.map((p) => [p.name, p.family]));
  const totals: Record<ScentFamily, number> = { woody: 0, floral: 0, citrus: 0, oud: 0 };
  for (const order of orders) {
    for (const line of order.lines) {
      const family = familyByName.get(line.productName);
      if (family) totals[family] += line.unitPriceCents * line.quantity;
    }
  }
  return totals;
}

export function topProducts(orders: Order[], limit = 5): { name: string; units: number; revenueCents: number }[] {
  const byName = new Map<string, { name: string; units: number; revenueCents: number }>();
  for (const order of orders) {
    for (const line of order.lines) {
      const row = byName.get(line.productName) ?? { name: line.productName, units: 0, revenueCents: 0 };
      row.units += line.quantity;
      row.revenueCents += line.unitPriceCents * line.quantity;
      byName.set(line.productName, row);
    }
  }
  return [...byName.values()].sort((a, b) => b.units - a.units).slice(0, limit);
}

export interface LowStockRow {
  productName: string;
  sku: string;
  sizeMl: number;
  concentration: Concentration;
  stock: number;
}

export function lowStock(products: Product[], threshold = LOW_STOCK_THRESHOLD): LowStockRow[] {
  return products
    .flatMap((p) =>
      p.variants
        .filter((v) => v.stock <= threshold)
        .map((v) => ({ productName: p.name, sku: v.sku, sizeMl: v.sizeMl, concentration: v.concentration, stock: v.stock })),
    )
    .sort((a, b) => a.stock - b.stock);
}

export function filterOrders(orders: Order[], { query = "", status }: { query?: string; status?: Order["status"] }): Order[] {
  const q = query.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (!status || o.status === status) &&
      (!q || o.id.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.fullName.toLowerCase().includes(q)),
  );
}

export function countByStatus(orders: Order[]): Record<Order["status"], number> {
  const counts = { pending: 0, paid: 0, packed: 0, shipped: 0, delivered: 0 };
  for (const o of orders) counts[o.status]++;
  return counts;
}

/** The next step in the pipeline, or null once delivered. */
export function nextStatus(status: Order["status"]): Order["status"] | null {
  const i = ORDER_STEPS.indexOf(status);
  return i < ORDER_STEPS.length - 1 ? ORDER_STEPS[i + 1] : null;
}

const notesList = z
  .string()
  .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean))
  .pipe(z.array(z.string()).min(1, "Add at least one note"));

export const variantRowSchema = z.object({
  sku: z.string().trim().min(3, "Enter a SKU, at least 3 characters"),
  sizeMl: z.coerce.number().int("Whole millilitres only").positive("Size must be above zero"),
  concentration: z.enum(["eau_de_toilette", "eau_de_parfum", "extrait"], { error: "Choose a concentration" }),
  price: z.coerce.number().positive("Price must be above zero"),
  stock: z.coerce.number().int("Whole units only").min(0, "Stock cannot be negative"),
});

export const productFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter the scent name"),
    tagline: z.string().trim().min(3, "Add a short tagline"),
    description: z.string().trim().min(20, "Describe the scent in at least 20 characters"),
    family: z.enum(["woody", "floral", "citrus", "oud"], { error: "Choose a scent family" }),
    gender: z.enum(["feminine", "masculine", "unisex"], { error: "Choose who it is for" }),
    top: notesList,
    heart: notesList,
    base: notesList,
    variants: z.array(variantRowSchema).min(1, "Add at least one size and concentration"),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<string>();
    value.variants.forEach((v, i) => {
      const key = `${v.sizeMl}-${v.concentration}`;
      if (seen.has(key)) ctx.addIssue({ code: "custom", path: ["variants", i, "concentration"], message: "This size and concentration is already listed" });
      seen.add(key);
    });
  });

export type ProductFormValues = z.input<typeof productFormSchema>;
export type ProductFormOutput = z.output<typeof productFormSchema>;
