"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@scentique/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orderRepository } from "@/data";
import { formatMoney } from "@/lib/format";
import { useSession } from "./session-store";

export function OrdersView() {
  const email = useSession((s) => s.customer?.email);
  const [loaded, setLoaded] = useState<{ email: string; orders: Order[] } | null>(null);

  useEffect(() => {
    if (!email) return;
    let active = true;
    orderRepository
      .findByEmail(email)
      .then((orders) => active && setLoaded({ email, orders }))
      .catch(() => active && setLoaded({ email, orders: [] }));
    return () => {
      active = false;
    };
  }, [email]);

  if (!email || loaded?.email !== email) return <Skeleton className="h-64 w-full" />;

  if (loaded.orders.length === 0) {
    return (
      <div className="max-w-md">
        <p className="font-display text-2xl">No orders yet</p>
        <p className="mt-3 text-muted">Orders you place while signed in will appear here.</p>
        <Button href="/shop" className="mt-8">Browse the shelf</Button>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink/15">
      {loaded.orders.map((order) => (
        <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-6 first:pt-0">
          <div>
            <Link href={`/account/orders/${order.id}`} className="font-display text-xl hover:text-accent">{order.id}</Link>
            <p className="mt-1 text-sm text-muted">
              {new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · {order.status}
            </p>
          </div>
          <p className="tabular-nums">{formatMoney(order.totalCents)}</p>
        </li>
      ))}
    </ul>
  );
}
