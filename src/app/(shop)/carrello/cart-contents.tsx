"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartContents() {
  const { items, removeItem, updateQuantity, totalCents } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mt-20 flex flex-col items-center text-center">
        <div
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card-subtle)] font-serif text-3xl text-[var(--color-accent)]"
        >
          ∅
        </div>
        <p className="mt-8 font-serif text-3xl text-[var(--color-foreground)]">
          Il carrello è{" "}
          <span className="serif-italic text-[var(--color-accent)]">vuoto</span>
        </p>
        <p className="mt-4 max-w-sm text-[var(--color-foreground-soft)]">
          Scopri i servizi e aggiungi quelli che fanno al caso tuo. Ti aspetto
          dall&apos;altra parte.
        </p>
        <Link
          href="/servizi"
          className="mt-10 inline-block bg-[var(--color-foreground)] px-9 py-3 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
        >
          Sfoglia i servizi
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-5 py-6 sm:gap-8"
          >
            <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-[var(--color-card-subtle)] sm:h-32 sm:w-32">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-xl text-[var(--color-foreground)]">
                    {item.name}
                  </p>
                  {item.variantId && (
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {item.variantId}
                    </p>
                  )}
                  <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    {formatCents(item.priceCents)} cad.
                  </p>
                </div>
                <p className="font-serif text-xl text-[var(--color-foreground)]">
                  {formatCents(item.priceCents * item.quantity)}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center border border-[var(--color-border)]">
                  <button
                    aria-label="Diminuisci quantità"
                    className="px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity - 1,
                      )
                    }
                  >
                    −
                  </button>
                  <span className="min-w-[2.5ch] border-x border-[var(--color-border)] px-3 py-1.5 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    aria-label="Aumenta quantità"
                    className="px-3 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity + 1,
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="link-underline text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-error)]"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  Rimuovi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-[var(--color-card-subtle)] p-8">
          <p className="eyebrow">Riepilogo</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-[var(--color-foreground-soft)]">
              <span>Subtotale</span>
              <span>{formatCents(totalCents())}</span>
            </div>
            <div className="flex justify-between text-[var(--color-foreground-soft)]">
              <span>IVA inclusa</span>
              <span>—</span>
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between border-t border-[var(--color-border)] pt-5">
            <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Totale
            </span>
            <span className="font-serif text-3xl text-[var(--color-foreground)]">
              {formatCents(totalCents())}
            </span>
          </div>
          <Button className="mt-6 w-full">Procedi al pagamento</Button>
          <Link
            href="/servizi"
            className="link-underline mt-5 block text-center text-sm text-[var(--color-foreground-soft)]"
          >
            Continua a sfogliare
          </Link>
        </div>
        <p className="mt-4 text-center text-xs uppercase tracking-widest text-[var(--color-muted)]">
          Pagamento sicuro · Stripe
        </p>
      </aside>
    </div>
  );
}
