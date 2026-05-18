import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServizi } from "@/lib/actions/servizi";
import type { ServizioDoc } from "@/types";

export const metadata: Metadata = {
  title: "Servizi",
  description: "Consulenza su bonus e fiscalità — scopri tutti i servizi di Lucrezia.",
};

export const dynamic = "force-dynamic";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600&q=80",
];

function getImage(servizio: ServizioDoc, idx: number): string {
  return servizio.images[0]?.url ?? PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
}

const CATEGORIES = ["Tutti", "Consulenza", "Digitale"];

export default async function ServiziPage() {
  const servizi = await getServizi("published");

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
          {servizi.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center py-24 text-center lg:mt-0">
              <p className="text-[var(--color-muted)]">
                I servizi sono in arrivo. Torna presto!
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:mt-0 xl:grid-cols-3">
              {servizi.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/servizi/${s.slug}`}
                  className="group flex flex-col bg-[var(--color-background)] transition-colors hover:bg-[var(--color-accent-light)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getImage(s, idx)}
                      alt={s.images[0]?.alt ?? s.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                        {s.category}
                      </p>
                      <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)] capitalize">
                        {s.type}
                      </span>
                    </div>
                    <h2 className="mt-3 font-serif text-xl text-[var(--color-foreground)]">
                      {s.name}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                      {s.shortDescription}
                    </p>
                    <p className="mt-4 text-sm font-medium text-[var(--color-foreground)]">
                      {new Intl.NumberFormat("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(s.priceCents / 100)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
