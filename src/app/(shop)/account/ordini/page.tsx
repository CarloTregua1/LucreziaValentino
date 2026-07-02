import type { Metadata } from "next";
import Link from "next/link";
import { getOrdersForCurrentUser } from "@/lib/actions/orders";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "I miei ordini" };
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

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-[var(--color-card-subtle)] text-[var(--color-muted)]",
  paid: "bg-[var(--color-accent-light)] text-[var(--color-accent-deep)]",
  fulfilled: "bg-[var(--color-accent-light)] text-[var(--color-accent-deep)]",
  cancelled: "bg-[var(--color-card-subtle)] text-[var(--color-muted)]",
  refunded: "bg-[var(--color-card-subtle)] text-[var(--color-muted)]",
};

export default async function OrdersPage() {
  const orders = await getOrdersForCurrentUser();

  return (
    <section className="section-spacing">
      <div className="container-xl max-w-4xl">
        <p className="section-index">· Area riservata</p>
        <h1 className="mt-3 font-serif text-[var(--text-h1)] leading-[1.05] text-[var(--color-foreground)]">
          I miei <span className="serif-italic">ordini.</span>
        </h1>
        <p className="mt-5 text-[var(--color-foreground-soft)]">
          Storico completo dei tuoi acquisti. Una copia di ogni ricevuta è
          stata inviata anche via email.
        </p>

        {orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center border border-[var(--color-border)] py-20 text-center">
            <p className="font-serif text-2xl text-[var(--color-foreground)]">
              Non hai ancora effettuato ordini.
            </p>
            <p className="mt-3 max-w-sm text-[var(--color-foreground-soft)]">
              Scopri i servizi e inizia a fare ordine fiscale.
            </p>
            <Link
              href="/servizi"
              className="link-underline mt-6 text-sm text-[var(--color-foreground)]"
            >
              Esplora i servizi →
            </Link>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {orders.map((order) => (
              <li key={order.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      Ordine · {order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-2 font-serif text-xl text-[var(--color-foreground)]">
                      {order.items.length === 1
                        ? order.items[0].name
                        : `${order.items[0].name} + altri ${order.items.length - 1}`}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-foreground-soft)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-widest ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                    <p className="font-serif text-2xl text-[var(--color-foreground)]">
                      {formatEur(order.totalCents)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/account"
          className="link-underline mt-10 inline-block text-sm text-[var(--color-foreground-soft)]"
        >
          ← Torna all&apos;area riservata
        </Link>
      </div>
    </section>
  );
}
