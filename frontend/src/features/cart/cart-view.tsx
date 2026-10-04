"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatConcentration, formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-store";
import { FREE_SHIPPING_CENTS, lineTotalCents, shippingCents, subtotalCents, totalCents } from "./cart-logic";
import { useHydrated } from "./use-hydrated";

const stepper = "grid size-10 place-items-center rounded-pill border border-ink/25 text-ink transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40";

export function CartView() {
  const ready = useHydrated();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  if (!ready) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md">
        <p className="font-display text-2xl">Your bag is empty</p>
        <p className="mt-3 text-muted">Nothing here yet. The shelf has the full range.</p>
        <Button href="/shop" className="mt-8">Browse the shelf</Button>
      </div>
    );
  }

  const subtotal = subtotalCents(items);
  const shipping = shippingCents(subtotal);
  const toFree = FREE_SHIPPING_CENTS - subtotal;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
      <ul className="divide-y divide-ink/15">
        {items.map((item) => (
          <li key={item.variantId} className="flex flex-wrap items-center justify-between gap-6 py-7 first:pt-0">
            <div>
              <Link href={`/product/${item.productSlug}`} className="font-display text-2xl hover:text-accent">
                {item.productName}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {item.sizeMl} ml · {formatConcentration(item.concentration)}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3" role="group" aria-label={`Quantity for ${item.productName}`}>
                <button type="button" className={stepper} aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => setQuantity(item.variantId, item.quantity - 1)}>−</button>
                <span className="w-6 text-center tabular-nums" aria-live="polite">{item.quantity}</span>
                <button type="button" className={stepper} aria-label="Increase quantity" disabled={item.quantity >= item.maxQuantity} onClick={() => setQuantity(item.variantId, item.quantity + 1)}>+</button>
              </div>
              <p className="w-24 text-right tabular-nums">{formatMoney(lineTotalCents(item))}</p>
              <button type="button" onClick={() => remove(item.variantId)} className="text-sm text-muted underline-offset-4 hover:text-accent hover:underline">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <GlassPanel className="h-fit space-y-5 p-7">
        <h2 className="font-display text-2xl">Summary</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatMoney(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "Free" : formatMoney(shipping)}</dd></div>
          <div className={cn("flex justify-between border-t border-ink/15 pt-3 text-base")}>
            <dt>Total</dt>
            <dd className="font-display text-2xl tabular-nums">{formatMoney(totalCents(items))}</dd>
          </div>
        </dl>
        {toFree > 0 && <p className="text-sm text-muted">Add {formatMoney(toFree)} more for free shipping.</p>}
        <Button href="/checkout" variant="glass" size="lg" className="w-full">Checkout</Button>
      </GlassPanel>
    </div>
  );
}
