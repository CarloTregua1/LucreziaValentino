import type { Metadata } from "next";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
    description: `Scopri ${slug.replace(/-/g, " ")} — consulenza di Lucrezia.`,
  };
}

export default async function ServizioDetailPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ");

  return (
    <section className="section-spacing">
      <div className="container-xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image placeholder */}
          <div className="aspect-square bg-[var(--color-card-subtle)]" />

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
              Consulenza
            </p>
            <h1 className="mt-3 font-serif text-[var(--text-h1)] capitalize text-[var(--color-foreground)]">
              {name}
            </h1>

            <p className="mt-6 text-3xl text-[var(--color-foreground)]">€ —</p>

            <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
              Descrizione del servizio — in costruzione. Qui apparirà una descrizione dettagliata
              con tutto ciò che è incluso nella consulenza o nel prodotto digitale.
            </p>

            <div className="mt-10">
              <AddToCartButton slug={slug} name={name} />
            </div>

            {/* Tabs */}
            <div className="mt-12 border-t border-[var(--color-border)] pt-8">
              <div className="flex gap-6 border-b border-[var(--color-border)]">
                {["Descrizione", "Cosa include", "FAQ"].map((tab) => (
                  <button
                    key={tab}
                    className="pb-3 text-sm text-[var(--color-muted)] first:text-[var(--color-foreground)] first:border-b-2 first:border-[var(--color-foreground)]"
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-sm leading-relaxed text-[var(--color-muted)]">
                Contenuto — in costruzione.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
