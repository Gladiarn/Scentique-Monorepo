"use client";

import { useState } from "react";
import Link from "next/link";
import type { Concentration, ScentFamily, Variant } from "@scentique/shared";
import { Button } from "@/components/ui/button";
import { formatConcentration, formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart } from "@/features/cart/cart-store";
import { availableConcentrations, availableSizes, resolveVariant } from "./variants";

const LOW_STOCK = 3;

function stockLine(variant: Variant | null): string {
  if (!variant) return "Not sold in this combination.";
  if (variant.stock === 0) return "Out of stock in this size and concentration.";
  if (variant.stock <= LOW_STOCK) return `Only ${variant.stock} left.`;
  return "In stock, ready to ship.";
}

/** Size and concentration picker with live price and stock. Out of stock disables purchase and says why. */
export function VariantSelector({
  variants,
  product,
}: {
  variants: Variant[];
  product: { slug: string; name: string; family: ScentFamily };
}) {
  const sizes = availableSizes({ variants });
  const [sizeMl, setSizeMl] = useState(sizes[0]);
  const concentrations = availableConcentrations({ variants }, sizeMl);
  const [concentration, setConcentration] = useState<Concentration>(concentrations[0]);

  const selectSize = (size: number) => {
    setSizeMl(size);
    const first = availableConcentrations({ variants }, size)[0];
    if (first) setConcentration(first);
  };

  const selected = resolveVariant({ variants }, sizeMl, concentration);
  const purchasable = Boolean(selected && selected.stock > 0);
  const addItem = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    if (!selected || selected.stock === 0) return;
    addItem({
      variantId: selected.id,
      productSlug: product.slug,
      productName: product.name,
      sizeMl: selected.sizeMl,
      concentration: selected.concentration,
      unitPriceCents: selected.priceCents,
      maxQuantity: selected.stock,
    });
    setAdded(true);
  };

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Size</legend>
        <div className="flex flex-wrap gap-2.5" role="radiogroup">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={size === sizeMl}
              onClick={() => selectSize(size)}
              className={cn(
                "h-11 min-w-[5rem] rounded-pill border px-5 text-sm transition-colors",
                size === sizeMl ? "border-accent text-accent" : "border-ink/25 text-ink/85 hover:border-accent",
              )}
            >
              {size} ml
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Concentration</legend>
        <div className="flex flex-wrap gap-2.5" role="radiogroup">
          {concentrations.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={c === concentration}
              onClick={() => setConcentration(c)}
              className={cn(
                "h-11 rounded-pill border px-5 text-sm transition-colors",
                c === concentration ? "border-accent text-accent" : "border-ink/25 text-ink/85 hover:border-accent",
              )}
            >
              {formatConcentration(c)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-ink/15 pt-7">
        <div>
          <p className="font-display text-3xl" aria-live="polite">
            {selected ? formatMoney(selected.priceCents) : "—"}
          </p>
          <p className="mt-1 text-sm text-muted" aria-live="polite">{stockLine(selected)}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Button type="button" size="lg" disabled={!purchasable} onClick={addToCart} className="min-w-[12rem]">
            Add to cart
          </Button>
          {added && (
            <p className="text-sm text-muted" role="status">
              Added to your bag. <Link href="/cart" className="text-accent underline-offset-4 hover:underline">View bag</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
