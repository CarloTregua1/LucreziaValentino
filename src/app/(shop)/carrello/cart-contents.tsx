"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartContents() {
  const { items, removeItem, updateQuantity, totalCents } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="font-serif text-2xl text-[var(--color-foreground)]">Il carrello è vuoto</p>
        <p className="mt-3 text-[var(--color-muted)]">
          Scopri i nostri servizi e aggiungi quelli che ti interessano.
        </p>
        <Link
          href="/servizi"
          className="mt-8 inline-block border border-[var(--color-foreground)] px-8 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
        >
          Sfoglia i servizi
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="divide-y divide-[var(--color-border)]">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 py-6">
            <div className="h-24 w-24 shrink-0 bg-[var(--color-card-subtle)]" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-lg text-[var(--color-foreground)]">{item.name}</p>
                  {item.variantId && (
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">{item.variantId}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  {formatCents(item.priceCents * item.quantity)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 border border-[var(--color-border)]">
                  <button
                    className="px-3 py-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    onClick={() =>
                      updateQuantity(item.productId, item.variantId, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center text-sm">{item.quantity}</span>
                  <button
                    className="px-3 py-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    onClick={() =>
                      updateQuantity(item.productId, item.variantId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-xs text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-error)]"
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
      <div className="mt-8 border-t border-[var(--color-border)] pt-8">
        <div className="ml-auto max-w-sm space-y-3">
          <div className="flex justify-between text-sm text-[var(--color-muted)]">
            <span>Subtotale</span>
            <span>{formatCents(totalCents())}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--color-border)] pt-3 font-medium text-[var(--color-foreground)]">
            <span>Totale</span>
            <span>{formatCents(totalCents())}</span>
          </div>
          <Button className="mt-4 w-full">Procedi al pagamento</Button>
          <Link
            href="/servizi"
            className="block text-center text-sm text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-foreground)]"
          >
            Continua a sfogliare
          </Link>
        </div>
      </div>
    </div>
  );
}
