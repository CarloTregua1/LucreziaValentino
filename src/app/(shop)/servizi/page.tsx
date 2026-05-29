import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServizi } from "@/lib/actions/servizi";
import type { ServizioDoc } from "@/types";

export const metadata: Metadata = {
  title: "Servizi",
  description:
    "Consulenza su bonus e fiscalità — scopri tutti i servizi di Lucrezia: consulenze personalizzate e prodotti digitali.",
};

export const dynamic = "force-dynamic";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=85",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=85",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=85",
  "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=900&q=85",
];

function getImage(servizio: ServizioDoc, idx: number): string {
  return servizio.images[0]?.url ?? PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
}

const CATEGORIES = ["Tutti", "Consulenza", "Digitale"];

export default async function ServiziPage() {
  const servizi = await getServizi("published");

  return (
    <div>
      {/* Header */}
      <section className="border-b border-[var(--color-border)]">
        <div className="container-xl section-spacing-sm">
          <p className="section-index">— Catalogo</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 className="lg:col-span-7 font-serif text-[var(--text-h1)] leading-[1.02] text-[var(--color-foreground)]">
              I miei{" "}
              <span className="serif-italic text-[var(--color-accent)]">
                servizi
              </span>{" "}
              di consulenza.
            </h1>
            <p className="lg:col-span-5 max-w-lg text-[var(--color-foreground-soft)]">
              Consulenze personalizzate e prodotti digitali per la gestione
              di bonus e fiscalità. Scegli il livello di supporto che ti
              serve.
            </p>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="section-spacing">
        <div className="container-xl">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow-muted">Categoria</p>
              <ul className="mt-5 flex flex-wrap gap-3 lg:flex-col lg:gap-1">
                {CATEGORIES.map((cat, idx) => (
                  <li key={cat}>
                    <button
                      data-active={idx === 0 ? "true" : undefined}
                      className="link-underline text-sm text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)] data-[active=true]:text-[var(--color-foreground)]"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-12 hidden border-t border-[var(--color-border)] pt-8 lg:block">
                <p className="eyebrow-muted">Risultati</p>
                <p className="mt-3 font-serif text-3xl text-[var(--color-foreground)]">
                  {String(servizi.length).padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  servizi disponibili
                </p>
              </div>
            </aside>

            {/* Grid */}
            <div>
              {servizi.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-[var(--color-border)] py-32 text-center">
                  <p className="font-serif text-2xl text-[var(--color-foreground)]">
                    Sto preparando qualcosa di nuovo.
                  </p>
                  <p className="mt-3 max-w-sm text-[var(--color-foreground-soft)]">
                    I servizi sono in arrivo. Torna a trovarmi tra qualche
                    giorno, oppure scrivimi per una consulenza personalizzata.
                  </p>
                  <Link
                    href="/account/messaggi"
                    className="link-underline mt-6 text-sm text-[var(--color-foreground)]"
                  >
                    Scrivimi →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2 xl:grid-cols-3">
                  {servizi.map((s, idx) => (
                    <Link
                      key={s.id}
                      href={`/servizi/${s.slug}`}
                      className="group relative flex flex-col bg-[var(--color-background)] transition-colors duration-300 hover:bg-[var(--color-accent-light)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-card-subtle)]">
                        <Image
                          src={getImage(s, idx)}
                          alt={s.images[0]?.alt ?? s.name}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="absolute left-4 top-4 bg-[var(--color-background)]/90 px-2.5 py-1 text-xs tracking-widest text-[var(--color-foreground)]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="absolute right-4 top-4 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-background)]/90 px-3 py-0.5 text-xs capitalize text-[var(--color-muted)]">
                          {s.type}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <p className="eyebrow">{s.category}</p>
                        <h2 className="mt-3 font-serif text-2xl text-[var(--color-foreground)]">
                          {s.name}
                        </h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                          {s.shortDescription}
                        </p>
                        <div className="mt-8 flex items-baseline justify-between border-t border-[var(--color-border)] pt-5">
                          <p className="text-sm font-medium text-[var(--color-foreground)]">
                            {s.externalUrl
                              ? "Disponibile online"
                              : new Intl.NumberFormat("it-IT", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(s.priceCents / 100)}
                          </p>
                          <span className="text-sm text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
                            Scopri →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
