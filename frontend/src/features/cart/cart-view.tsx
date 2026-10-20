"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatConcentration, formatMoney } from "@/lib/format";
import { FREE_SHIPPING_CENTS, lineTotalCents, shippingCents, subtotalCents, totalCents, type CartItem } from "./cart-logic";
import { useCart } from "./cart-store";
import { useHydrated } from "./use-hydrated";

/** One shared empty bag: a selector that returned a new `[]` each call would make React treat the server snapshot as unstable. */
const EMPTY: CartItem[] = [];

const step =
  "grid size-11 place-items-center rounded-pill border border-ink/25 text-lg text-ink transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40";

/** The bag: lines you can change within stock, then the totals, the free-shipping nudge and the way to checkout. */
export function CartView() {
  const hydrated = useHydrated();
  const items = useCart((s) => (hydrated ? s.items : EMPTY));
  const { setQuantity, remove } = useCart.getState();

  if (items.length === 0) {
    return (
      <Container className="pb-32">
        <p className="text-lg text-ink/80">Your bag is empty.</p>
        <Button href="/shop" className="mt-8">
          Shop all perfumes
        </Button>
      </Container>
    );
  }

  const subtotal = subtotalCents(items);
  const shipping = shippingCents(subtotal);
  const toFree = FREE_SHIPPING_CENTS - subtotal;

  return (
    <Container className="grid gap-12 pb-32 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
      <ul className="space-y-8">
        {items.map((item) => (
          <li key={item.variantId} className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-4">
            <div>
              <Link href={`/product/${item.productSlug}`} className="font-display text-2xl hover:text-accent">
                {item.productName}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {item.sizeMl} ml · {formatConcentration(item.concentration)}
              </p>
              <p className="mt-1 text-sm text-ink/80">{formatMoney(item.unitPriceCents)} each</p>
            </div>
            <p className="font-display text-xl">{formatMoney(lineTotalCents(item))}</p>
            <div className="flex items-center gap-3">
              <button type="button" aria-label={`Decrease quantity of ${item.productName}`} className={step} disabled={item.quantity <= 1} onClick={() => setQuantity(item.variantId, item.quantity - 1)}>
                −
              </button>
              <span className="min-w-6 text-center" aria-live="polite">
                {item.quantity}
              </span>
              <button type="button" aria-label={`Increase quantity of ${item.productName}`} className={step} disabled={item.quantity >= item.maxQuantity} onClick={() => setQuantity(item.variantId, item.quantity + 1)}>
                +
              </button>
            </div>
            <button type="button" aria-label={`Remove ${item.productName}`} className="justify-self-end text-sm text-muted underline-offset-4 hover:text-ink hover:underline" onClick={() => remove(item.variantId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <section aria-labelledby="summary-heading" className="h-fit rounded-xl border border-ink/15 bg-surface/45 p-7 backdrop-blur-glass lg:sticky lg:top-28">
        <h2 id="summary-heading" className="font-display text-2xl">
          Order summary
        </h2>
        <dl className="mt-6 space-y-3 text-ink/90">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatMoney(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-4 text-lg text-ink">
            <dt>Total</dt>
            <dd>{formatMoney(totalCents(items))}</dd>
          </div>
        </dl>
        {toFree > 0 && <p className="mt-5 text-sm text-ink/80">You are {formatMoney(toFree)} away from free shipping.</p>}
        <Button href="/checkout" className="mt-7 w-full">
          Checkout
        </Button>
      </section>
    </Container>
  );
}
