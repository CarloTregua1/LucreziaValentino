import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe/client";
import { ClearCartOnMount } from "./clear-cart-on-mount";

export const metadata: Metadata = { title: "Ordine confermato" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let total: number | null = null;
  let email: string | null = null;
  let items: Array<{ name: string; quantity: number; total: number }> = [];

  if (session_id) {
    try {
      const [session, lineItems] = await Promise.all([
        stripe.checkout.sessions.retrieve(session_id),
        stripe.checkout.sessions.listLineItems(session_id, { limit: 100 }),
      ]);
      total = session.amount_total ?? null;
      email = session.customer_details?.email ?? session.customer_email ?? null;
      items = lineItems.data.map((li) => ({
        name: li.description ?? "Servizio",
        quantity: li.quantity ?? 1,
        total: li.amount_total ?? 0,
      }));
    } catch (e) {
      console.error("Failed to retrieve Stripe session", e);
    }
  }

  return (
    <div>
      <ClearCartOnMount />
      <section className="section-spacing">
        <div className="container-xl max-w-2xl">
          <div
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-light)] font-serif text-3xl text-[var(--color-accent)]"
          >
            ✓
          </div>
          <p className="eyebrow mt-8">Pagamento ricevuto</p>
          <h1 className="mt-3 font-serif text-[var(--text-h1)] leading-[1.05] text-[var(--color-foreground)]">
            Grazie per il tuo{" "}
            <span className="serif-italic text-[var(--color-accent)]">
              ordine.
            </span>
          </h1>
          <p className="mt-6 leading-relaxed text-[var(--color-foreground-soft)]">
            Ti ho appena inviato una conferma{email ? ` a ${email}` : ""}. Entro
            24 ore ti contatto personalmente per organizzare la consulenza o
            consegnarti il materiale digitale.
          </p>

          {items.length > 0 && (
            <div className="mt-12 border-t border-[var(--color-border)]">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-baseline justify-between border-b border-[var(--color-border)] py-5"
                >
                  <div>
                    <p className="font-serif text-lg text-[var(--color-foreground)]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      Quantità: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">
                    {formatEur(item.total)}
                  </p>
                </div>
              ))}

              {total !== null && (
                <div className="flex items-baseline justify-between py-6">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    Totale (IVA inclusa)
                  </span>
                  <span className="font-serif text-3xl text-[var(--color-foreground)]">
                    {formatEur(total)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/account/ordini"
              className="bg-[var(--color-foreground)] px-8 py-3 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
            >
              Vai ai miei ordini
            </Link>
            <Link
              href="/servizi"
              className="link-underline text-sm tracking-wide text-[var(--color-foreground)]"
            >
              Continua a sfogliare
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
