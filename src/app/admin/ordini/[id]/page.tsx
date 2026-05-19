import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/orders";
import type { OrderStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Dettaglio ordine | Admin" };
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
      month: "long",
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

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/ordini"
        className="link-underline text-xs uppercase tracking-widest text-[var(--color-muted)]"
      >
        ← Tutti gli ordini
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-muted)]">
            Ordine · {order.id.slice(-8).toUpperCase()}
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--color-foreground)]">
            {order.email}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="bg-[var(--color-accent-light)] px-3 py-1 text-xs uppercase tracking-widest text-[var(--color-accent-deep)]">
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Voci
          </h2>
          <ul className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {order.items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-baseline justify-between py-4"
              >
                <div>
                  <p className="font-serif text-lg text-[var(--color-foreground)]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    Quantità: {item.quantity} · {formatEur(item.priceCents)} cad.
                  </p>
                </div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  {formatEur(item.subtotalCents)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <h2 className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Riepilogo
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Subtotale</span>
              <span>{formatEur(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-2 font-medium text-[var(--color-foreground)]">
              <span>Totale (IVA inclusa)</span>
              <span className="font-serif text-xl">
                {formatEur(order.totalCents)}
              </span>
            </div>
          </div>

          <h2 className="mt-10 text-xs uppercase tracking-widest text-[var(--color-muted)]">
            Riferimenti Stripe
          </h2>
          <dl className="mt-3 space-y-2 text-xs">
            <div>
              <dt className="text-[var(--color-muted)]">Session</dt>
              <dd className="font-mono break-all text-[var(--color-foreground)]">
                {order.stripeSessionId}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Payment Intent</dt>
              <dd className="font-mono break-all text-[var(--color-foreground)]">
                {order.stripePaymentIntentId || "—"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
