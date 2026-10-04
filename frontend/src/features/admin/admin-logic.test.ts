import { describe, expect, it } from "vitest";
import type { Order, Product } from "@scentique/shared";
import { countByStatus, filterOrders, lowStock, nextStatus, productFormSchema, revenueByFamily, topProducts } from "./admin-logic";

const product = (name: string, family: Product["family"], stock = 5): Product =>
  ({
    id: name, slug: name, name, tagline: "", description: "", family, gender: "unisex",
    notes: { top: [], heart: [], base: [] },
    variants: [{ id: `${name}-v`, sku: `${name}-sku`, sizeMl: 50, concentration: "eau_de_parfum", priceCents: 10000, stock }],
    media: [], featured: false, createdAt: "2026-01-01",
  }) as Product;

const order = (overrides: Partial<Order>, lines: Order["lines"]): Order =>
  ({
    id: "SC-1", email: "a@example.com", fullName: "Ada Lovelace",
    address: { line1: "", city: "", postcode: "", country: "" }, delivery: "standard",
    lines, totalCents: 0, status: "pending", placedAt: "2026-01-01T00:00:00Z", ...overrides,
  }) as Order;

const line = (productName: string, quantity: number, unitPriceCents = 10000) => ({
  variantId: `${productName}-v`, productName, sizeMl: 50, concentration: "eau_de_parfum" as const, quantity, unitPriceCents,
});

describe("revenueByFamily", () => {
  it("sums line revenue into each scent family and skips unknown products", () => {
    const products = [product("Oak", "woody"), product("Rose", "floral")];
    const orders = [order({}, [line("Oak", 2), line("Rose", 1, 5000), line("Gone", 9)])];
    expect(revenueByFamily(orders, products)).toEqual({ woody: 20000, floral: 5000, citrus: 0, oud: 0 });
  });
});

describe("topProducts", () => {
  it("ranks by units sold, most first", () => {
    const orders = [order({}, [line("Oak", 1), line("Rose", 4)]), order({}, [line("Oak", 2)])];
    expect(topProducts(orders).map((r) => [r.name, r.units])).toEqual([["Rose", 4], ["Oak", 3]]);
  });
});

describe("lowStock", () => {
  it("lists variants at or under the threshold, lowest first", () => {
    const products = [product("A", "woody", 0), product("B", "oud", 3), product("C", "citrus", 9)];
    expect(lowStock(products).map((r) => r.productName)).toEqual(["A", "B"]);
  });
});

describe("filterOrders", () => {
  const orders = [order({ id: "SC-1", status: "paid" }, []), order({ id: "SC-2", email: "bo@example.com", fullName: "Bo Lin", status: "shipped" }, [])];

  it("matches id, email or name, case-insensitively", () => {
    expect(filterOrders(orders, { query: "bo@" }).map((o) => o.id)).toEqual(["SC-2"]);
    expect(filterOrders(orders, { query: "ada" }).map((o) => o.id)).toEqual(["SC-1"]);
  });

  it("filters by status", () => {
    expect(filterOrders(orders, { status: "shipped" }).map((o) => o.id)).toEqual(["SC-2"]);
  });
});

describe("pipeline helpers", () => {
  it("counts orders by status", () => {
    expect(countByStatus([order({ status: "paid" }, []), order({ status: "paid" }, [])]).paid).toBe(2);
  });

  it("moves one step along and stops at delivered", () => {
    expect(nextStatus("pending")).toBe("paid");
    expect(nextStatus("delivered")).toBeNull();
  });
});

describe("productFormSchema", () => {
  const valid = {
    name: "Cedar Quiet",
    tagline: "Dry cedar and resin",
    description: "A dry, woody scent with a long finish that suits cool evenings.",
    family: "woody",
    gender: "unisex",
    top: "Bergamot, Pepper",
    heart: "Cedar",
    base: "Amber",
    variants: [{ sku: "CQ-50-EDP", sizeMl: 50, concentration: "eau_de_parfum", price: 92, stock: 10 }],
  };

  it("accepts a complete product and splits notes into lists", () => {
    const result = productFormSchema.parse(valid);
    expect(result.top).toEqual(["Bergamot", "Pepper"]);
  });

  it("rejects a duplicate size and concentration", () => {
    const dup = { ...valid, variants: [valid.variants[0], { ...valid.variants[0], sku: "CQ-50-EDP-2" }] };
    expect(productFormSchema.safeParse(dup).success).toBe(false);
  });

  it("requires at least one variant and rejects negative stock", () => {
    expect(productFormSchema.safeParse({ ...valid, variants: [] }).success).toBe(false);
    expect(productFormSchema.safeParse({ ...valid, variants: [{ ...valid.variants[0], stock: -1 }] }).success).toBe(false);
  });
});
