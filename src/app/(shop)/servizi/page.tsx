import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servizi",
  description: "Consulenza su bonus e fiscalità — scopri tutti i servizi di Lucrezia.",
};

const PLACEHOLDER_SERVICES = [
  {
    slug: "consulenza-bonus",
    category: "Bonus",
    name: "Consulenza Bonus",
    shortDescription: "Analisi e ottimizzazione del tuo sistema di bonus aziendali.",
    priceCents: 30000,
    type: "Consulenza",
  },
  {
    slug: "analisi-fiscale",
    category: "Fiscalità",
    name: "Analisi Fiscale",
    shortDescription: "Revisione completa della tua situazione fiscale con piano d'azione.",
    priceCents: 45000,
    type: "Consulenza",
  },
  {
    slug: "piano-ottimizzazione",
    category: "Consulenza",
    name: "Piano di Ottimizzazione",
    shortDescription: "Strategia personalizzata per massimizzare efficienza fiscale e bonus.",
    priceCents: 80000,
    type: "Consulenza",
  },
  {
    slug: "guida-bonus-2025",
    category: "Guide",
    name: "Guida ai Bonus 2025",
    shortDescription: "PDF completo sulle normative e opportunità sui bonus per il 2025.",
    priceCents: 2900,
    type: "Digitale",
  },
  {
    slug: "template-dichiarazione",
    category: "Template",
    name: "Template Dichiarazione Redditi",
    shortDescription: "Modello precompilato con note e istruzioni passo-passo.",
    priceCents: 1900,
    type: "Digitale",
  },
  {
    slug: "checklist-fiscale",
    category: "Checklist",
    name: "Checklist Fiscale Annuale",
    shortDescription: "Lista completa di scadenze e adempimenti fiscali dell'anno.",
    priceCents: 900,
    type: "Digitale",
  },
];

const CATEGORIES = ["Tutti", "Consulenza", "Digitale"];

export default function ServiziPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Servizi
        </h1>
        <p className="mt-4 max-w-lg text-[var(--color-muted)]">
          Consulenze personalizzate e prodotti digitali per la gestione di bonus e fiscalità.
        </p>

        <div className="mt-12 lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Categoria
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Grid */}
          <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:mt-0 xl:grid-cols-3">
            {PLACEHOLDER_SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/servizi/${service.slug}`}
                className="group flex flex-col bg-[var(--color-background)] p-8 transition-colors hover:bg-[var(--color-accent-light)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                    {service.category}
                  </p>
                  <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
                    {service.type}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-xl text-[var(--color-foreground)]">
                  {service.name}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {service.shortDescription}
                </p>
                <p className="mt-6 text-sm font-medium text-[var(--color-foreground)]">
                  €{(service.priceCents / 100).toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
