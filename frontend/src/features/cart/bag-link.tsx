"use client";

import Link from "next/link";
import { itemCount } from "./cart-logic";
import { useCart } from "./cart-store";
import { useHydrated } from "./use-hydrated";

/** The header's link to the bag, with a live count. The count only shows once the saved bag can be read (no mismatch). */
export function BagLink({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const count = useCart((s) => (hydrated ? itemCount(s.items) : 0));
  return (
    <Link href="/cart" aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`} className={className}>
      Bag{count > 0 && <span aria-hidden="true" className="ml-1.5 inline-grid min-w-5 place-items-center rounded-pill bg-accent px-1.5 text-xs font-medium leading-5 text-page">{count}</span>}
    </Link>
  );
}
