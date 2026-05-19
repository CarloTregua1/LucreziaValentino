import type { Metadata } from "next";
import Link from "next/link";
import { getAllOrders } from "@/lib/actions/admin-orders";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Ordini | Admin" };
export const dynamic = "force-dynamic";

function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "In attesa",
  paid: "Pagato",
  fulfilled: "Completato",
  cancelled: "Annullato",
  refunded: "Rimborsato",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const revenueCents = orders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-foreground)]">
            Ordini
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {orders.length} ordini totali · Fatturato {formatEur(revenueCents)}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-12 border border-[var(--color-border)] p-12 text-center">
          <p className="text-[var(--color-muted)]">
            Nessun ordine ricevuto ancora.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-card-subtle)] text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  Ordine
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  Cliente
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  Data
                </th>
                <th className="px-4 py-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  Stato
                </th>
                <th className="px-4 py-3 text-right text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  Totale
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card-subtle)]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-foreground)]">
                    <Link
                      href={`/admin/ordini/${o.id}`}
                      className="link-underline"
                    >
                      {o.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-foreground)]">
                    {o.email}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[var(--color-accent-light)] px-2 py-0.5 text-xs uppercase tracking-widest text-[var(--color-accent-deep)]">
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--color-foreground)]">
                    {formatEur(o.totalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
