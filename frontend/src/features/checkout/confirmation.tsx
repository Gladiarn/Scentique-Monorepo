"use client";

import { useEffect, useState } from "react";
import type { Order } from "@scentique/shared";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { orderRepository } from "@/data";
import { formatConcentration, formatMoney } from "@/lib/format";

export function Confirmation({ orderId }: { orderId: string | null }) {
  const [loaded, setLoaded] = useState<{ id: string; order: Order | null } | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    orderRepository
      .findById(orderId)
      .then((found) => active && setLoaded({ id: orderId, order: found }))
      .catch(() => active && setLoaded({ id: orderId, order: null }));
    return () => {
      active = false;
    };
  }, [orderId]);

  const order = !orderId ? null : loaded?.id === orderId ? loaded.order : undefined;

  if (order === undefined) return <Skeleton className="h-72 w-full max-w-2xl" />;

  if (!order) {
    return (
      <GlassPanel className="max-w-md p-7">
        <p className="font-display text-2xl">We could not find that order</p>
        <p className="mt-3 text-muted">If you just placed an order, check your email. Otherwise browse the shelf.</p>
        <Button href="/shop" className="mt-6">Browse the shelf</Button>
      </GlassPanel>
    );
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <p className="font-display text-3xl">Thank you, {order.fullName.split(" ")[0]}</p>
      <p className="text-muted">
        Order <span className="tabular-nums text-ink">{order.id}</span> is with the team. A confirmation has been sent to {order.email}.
      </p>
      <GlassPanel className="space-y-4 p-7">
        {order.lines.map((line) => (
          <div key={line.variantId} className="flex justify-between gap-4 text-sm">
            <span>
              {line.productName}
              <span className="block text-muted">
                {line.sizeMl} ml · {formatConcentration(line.concentration)} × {line.quantity}
              </span>
            </span>
            <span className="tabular-nums">{formatMoney(line.unitPriceCents * line.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-ink/15 pt-4">
          <span>Total</span>
          <span className="font-display text-2xl tabular-nums">{formatMoney(order.totalCents)}</span>
        </div>
      </GlassPanel>
      <div>
        <Button href="/shop" variant="ghost">Keep browsing</Button>
      </div>
    </div>
  );
}
