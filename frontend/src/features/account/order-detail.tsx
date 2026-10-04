"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@scentique/shared";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { orderRepository } from "@/data";
import { formatConcentration, formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ORDER_STEPS, completedSteps } from "./account-logic";
import { useSession } from "./session-store";

export function OrderDetail({ orderId }: { orderId: string }) {
  const email = useSession((s) => s.customer?.email);
  const [loaded, setLoaded] = useState<{ id: string; order: Order | null } | null>(null);

  useEffect(() => {
    let active = true;
    orderRepository
      .findById(orderId)
      .then((found) => active && setLoaded({ id: orderId, order: found }))
      .catch(() => active && setLoaded({ id: orderId, order: null }));
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loaded?.id !== orderId) return <Skeleton className="h-96 w-full" />;
  const order = loaded.order && loaded.order.email === email ? loaded.order : null;

  if (!order) {
    return (
      <GlassPanel className="max-w-md p-7">
        <p className="font-display text-2xl">We could not find that order</p>
        <p className="mt-3 text-muted">It may belong to another account. Your orders are listed on the orders page.</p>
        <Link href="/account/orders" className="mt-6 inline-block text-accent underline-offset-4 hover:underline">Back to orders</Link>
      </GlassPanel>
    );
  }

  const done = completedSteps(order.status);
  return (
    <div className="space-y-10">
      <div>
        <p className="font-display text-3xl">{order.id}</p>
        <p className="mt-2 text-sm text-muted">Placed {new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <ol aria-label="Order progress" className="grid grid-cols-5 gap-2">
        {ORDER_STEPS.map((step, i) => (
          <li key={step} aria-current={i + 1 === done ? "step" : undefined} className="space-y-3">
            <div className={cn("h-px rounded-pill", i < done ? "bg-accent" : "bg-line")} />
            <p className={cn("text-xs capitalize", i < done ? "text-ink" : "text-muted")}>{step}</p>
          </li>
        ))}
      </ol>

      <GlassPanel className="space-y-4 p-7">
        {order.lines.map((line) => (
          <div key={line.variantId} className="flex justify-between gap-4 text-sm">
            <span>
              {line.productName}
              <span className="block text-muted">{line.sizeMl} ml · {formatConcentration(line.concentration)} × {line.quantity}</span>
            </span>
            <span className="tabular-nums">{formatMoney(line.unitPriceCents * line.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-ink/15 pt-4">
          <span>Total</span>
          <span className="font-display text-2xl tabular-nums">{formatMoney(order.totalCents)}</span>
        </div>
      </GlassPanel>

      <p className="text-sm text-muted">
        Shipping to {order.address.line1}, {order.address.city} {order.address.postcode}, {order.address.country}.
      </p>
    </div>
  );
}
