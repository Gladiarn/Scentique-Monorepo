"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@scentique/shared";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { orderRepository } from "@/data";
import { ORDER_STEPS } from "@/features/account/account-logic";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/cn";
import { countByStatus, filterOrders, nextStatus } from "./admin-logic";
import { Pagination } from "@/components/ui/pagination";
import { clampPage, pageSlice } from "@/lib/paginate";

const ORDERS_PAGE_SIZE = 25;

const input = "h-11 w-full rounded-md border border-line bg-page px-3 text-sm text-ink focus:border-accent focus:outline-none md:w-80";

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Order["status"] | undefined>(undefined);
  const [busy, setBusy] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    orderRepository.findAll().then((all) => active && setOrders(all));
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => countByStatus(orders ?? []), [orders]);
  const matching = useMemo(() => filterOrders(orders ?? [], { query, status }), [orders, query, status]);
  const { items: rows, count: pages, page: current } = pageSlice(matching, page, ORDERS_PAGE_SIZE);

  if (!orders) return <Skeleton className="h-96 w-full" />;

  async function advance(order: Order) {
    const next = nextStatus(order.status);
    if (!next) return;
    setBusy(order.id);
    const updated = await orderRepository.updateStatus(order.id, next);
    if (updated) setOrders((list) => list?.map((o) => (o.id === updated.id ? updated : o)) ?? null);
    setBusy(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="order-search" className="sr-only">Search orders</label>
        <input id="order-search" type="search" placeholder="Search by order, email or name" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className={input} />
        <p className="text-sm text-muted" aria-live="polite">{matching.length} shown</p>
      </div>

      <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={!status}
          onClick={() => { setStatus(undefined); setPage(1); }}
          className={cn("h-9 rounded-pill border px-4 text-xs uppercase tracking-[0.12em]", !status ? "border-accent text-accent" : "border-ink/20 text-ink/80 hover:border-accent")}
        >
          All · {orders.length}
        </button>
        {ORDER_STEPS.map((step) => (
          <button
            key={step}
            type="button"
            role="tab"
            aria-selected={status === step}
            onClick={() => { setStatus(step); setPage(1); }}
            className={cn("h-9 rounded-pill border px-4 text-xs uppercase tracking-[0.12em]", status === step ? "border-accent text-accent" : "border-ink/20 text-ink/80 hover:border-accent")}
          >
            {step} · {counts[step]}
          </button>
        ))}
      </div>

      <GlassPanel className="overflow-x-auto p-2">
        <table className="w-full min-w-[46rem] text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Order</th>
              <th className="px-4 py-3 font-normal">Customer</th>
              <th className="px-4 py-3 font-normal">Placed</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 text-right font-normal">Total</th>
              <th className="px-4 py-3 text-right font-normal"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((order) => {
              const next = nextStatus(order.status);
              return (
                <tr key={order.id}>
                  <td className="px-4 py-3 tabular-nums">{order.id}</td>
                  <td className="px-4 py-3">
                    {order.fullName}
                    <span className="block text-xs text-muted">{order.email}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{order.placedAt.slice(0, 10)}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(order.totalCents)}</td>
                  <td className="px-4 py-3 text-right">
                    {next ? (
                      <button
                        type="button"
                        disabled={busy === order.id}
                        onClick={() => advance(order)}
                        className="h-9 rounded-pill border border-ink/25 px-4 text-xs transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                      >
                        Mark {next}
                      </button>
                    ) : (
                      <span className="text-xs text-muted">Complete</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="px-4 py-8 text-sm text-muted">No orders match these filters.</p>}
      </GlassPanel>

      <Pagination page={current} pageCount={pages} onPage={(target) => setPage(clampPage(target, pages))} label="Order pages" />
    </div>
  );
}
