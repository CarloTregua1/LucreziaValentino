import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lucrezia — Consulente in bonus e fiscalità",
  description:
    "Consulenza professionale su bonus e ottimizzazione fiscale. Scopri i servizi di Lucrezia.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
            Consulente in bonus e fiscalità
          </p>
          <h1 className="font-serif text-[var(--text-display)] leading-[0.95] text-[var(--color-foreground)]">
            Lucrezia
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-muted)]">
            Supporto professionale per la gestione dei bonus e l&apos;ottimizzazione fiscale.
            Soluzioni su misura per privati e aziende.
          </p>
        </div>
      </section>

      {/* Services placeholder */}
      <section className="section-spacing bg-[var(--color-card-subtle)]">
        <div className="container-xl">
          <h2 className="font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
            Servizi
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            I servizi di consulenza appariranno qui.
          </p>
        </div>
      </section>
    </div>
  );
}
