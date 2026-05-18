import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lucrezia — Consulente in bonus e fiscalità",
  description:
    "Consulenza professionale su bonus e ottimizzazione fiscale. Scopri i servizi di Lucrezia.",
};

const PLACEHOLDER_SERVICES = [
  {
    slug: "consulenza-bonus",
    category: "Bonus",
    name: "Consulenza Bonus",
    shortDescription: "Analisi e ottimizzazione del tuo sistema di bonus aziendali.",
    priceCents: 30000,
  },
  {
    slug: "analisi-fiscale",
    category: "Fiscalità",
    name: "Analisi Fiscale",
    shortDescription: "Revisione completa della tua situazione fiscale con piano d'azione.",
    priceCents: 45000,
  },
  {
    slug: "piano-ottimizzazione",
    category: "Consulenza",
    name: "Piano di Ottimizzazione",
    shortDescription: "Strategia personalizzata per massimizzare efficienza fiscale e bonus.",
    priceCents: 80000,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-xl grid gap-16 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
              Consulente in bonus e fiscalità
            </p>
            <h1 className="mt-4 font-serif text-[var(--text-display)] leading-[0.95] text-[var(--color-foreground)]">
              Lucrezia
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-muted)]">
              Supporto professionale per la gestione dei bonus e l&apos;ottimizzazione fiscale.
              Soluzioni su misura, risultati concreti.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/servizi"
                className="bg-[var(--color-foreground)] px-8 py-3 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
              >
                Scopri i servizi
              </Link>
              <Link
                href="/chi-siamo"
                className="border border-[var(--color-foreground)] px-8 py-3 text-sm tracking-wide text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
              >
                Chi sono
              </Link>
            </div>
          </div>

          <div className="hidden aspect-[4/5] bg-[var(--color-card-subtle)] lg:block" />
        </div>
      </section>

      {/* Services grid */}
      <section className="section-spacing bg-[var(--color-card-subtle)]">
        <div className="container-xl">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Servizi
            </h2>
            <Link
              href="/servizi"
              className="hidden text-sm text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-foreground)] md:block"
            >
              Vedi tutti →
            </Link>
          </div>

          <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
            {PLACEHOLDER_SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/servizi/${service.slug}`}
                className="group flex flex-col bg-[var(--color-background)] p-8 transition-colors hover:bg-[var(--color-accent-light)]"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                  {service.category}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-[var(--color-foreground)]">
                  {service.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {service.shortDescription}
                </p>
                <p className="mt-6 text-sm font-medium text-[var(--color-foreground)]">
                  Da €{(service.priceCents / 100).toLocaleString("it-IT")} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="section-spacing">
        <div className="container-xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="hidden aspect-video bg-[var(--color-card-subtle)] lg:block" />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
              Chi sono
            </p>
            <h2 className="mt-4 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Esperienza al servizio dei tuoi obiettivi
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
              Con anni di esperienza nel settore finanziario, affianco privati e aziende nella
              gestione dei bonus e nell&apos;ottimizzazione fiscale. Ogni situazione è unica:
              il mio approccio è sempre personalizzato.
            </p>
            <Link
              href="/chi-siamo"
              className="mt-8 inline-block text-sm text-[var(--color-foreground)] underline underline-offset-4 hover:text-[var(--color-accent)]"
            >
              Scopri di più
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-spacing bg-[var(--color-foreground)]">
        <div className="container-xl max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
            Newsletter
          </p>
          <h2 className="mt-4 font-serif text-[var(--text-h2)] text-[var(--color-background)]">
            Resta aggiornata
          </h2>
          <p className="mt-4 text-[var(--color-muted-light)]">
            Novità fiscali, aggiornamenti sui bonus e approfondimenti direttamente nella tua casella.
          </p>
          <div className="mt-8 flex gap-0 border border-[var(--color-muted)]">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 bg-transparent px-5 py-3 text-sm text-[var(--color-background)] placeholder-[var(--color-muted)] outline-none"
            />
            <button className="bg-[var(--color-accent)] px-6 py-3 text-sm text-white transition-opacity hover:opacity-90">
              Iscriviti
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
