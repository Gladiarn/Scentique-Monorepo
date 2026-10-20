"use client";

import Link from "next/link";
import { useState } from "react";
import { glassButton } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatConcentration, formatMoney } from "@/lib/format";
import { useCart } from "@/features/cart/cart-store";
import type { Concentration, Product } from "@scentique/shared";
import { availableConcentrations, availableSizes, resolveVariant } from "./variants";

const pill =
  "inline-flex h-11 cursor-pointer items-center rounded-pill border border-ink/25 px-5 text-sm text-ink/85 transition-colors peer-checked:border-accent peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-ink/60";

/** Size and concentration pickers, the price of what is chosen, and add to bag. Sold-out choices cannot be added. */
export function PurchasePanel({ product }: { product: Product }) {
  const sizes = availableSizes(product);
  const [size, setSize] = useState(sizes[0] ?? 0);
  const concentrations = availableConcentrations(product, size);
  const [chosen, setChosen] = useState<Concentration | null>(concentrations[0] ?? null);
  // A new size may not come in the concentration that was chosen: fall back to the first one that does.
  const concentration = chosen && concentrations.includes(chosen) ? chosen : (concentrations[0] ?? null);
  const variant = concentration ? resolveVariant(product, size, concentration) : null;
  const [added, setAdded] = useState(false);
  const soldOut = !variant || variant.stock <= 0;

  const add = () => {
    if (!variant || soldOut) return;
    useCart.getState().add({
      variantId: variant.id,
      productSlug: product.slug,
      productName: product.name,
      sizeMl: variant.sizeMl,
      concentration: variant.concentration,
      unitPriceCents: variant.priceCents,
      maxQuantity: variant.stock,
    });
    setAdded(true);
  };

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm text-muted">Size</legend>
        <div className="flex flex-wrap gap-2.5">
          {sizes.map((ml) => (
            <label key={ml}>
              <input type="radio" name="size" className="peer sr-only" checked={size === ml} onChange={() => { setSize(ml); setAdded(false); }} />
              <span className={pill}>{ml} ml</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm text-muted">Concentration</legend>
        <div className="flex flex-wrap gap-2.5">
          {concentrations.map((c) => (
            <label key={c}>
              <input type="radio" name="concentration" className="peer sr-only" checked={concentration === c} onChange={() => { setChosen(c); setAdded(false); }} />
              <span className={pill}>{formatConcentration(c)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="font-display text-3xl">{variant ? formatMoney(variant.priceCents) : ""}</p>
        <button type="button" onClick={add} disabled={soldOut} className={cn(glassButton, "mt-5 w-full justify-center sm:w-auto disabled:cursor-not-allowed disabled:opacity-50")}>
          {soldOut ? "Sold out" : "Add to bag"}
        </button>
        <div role="status" className="mt-4 min-h-6 text-sm text-ink/80">
          {added && (
            <>
              Added to bag.{" "}
              <Link href="/cart" className="text-accent underline-offset-4 hover:underline">
                View bag
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
