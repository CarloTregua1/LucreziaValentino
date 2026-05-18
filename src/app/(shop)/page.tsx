import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServizi } from "@/lib/actions/servizi";
import type { ServizioDoc } from "@/types";

export const metadata: Metadata = {
  title: "Lucrezia — Consulente in bonus e fiscalità",
  description:
    "Consulenza professionale su bonus e ottimizzazione fiscale. Scopri i servizi di Lucrezia.",
};

const CARD_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
];

function getServiceImage(s: ServizioDoc, idx: number): string {
  return s.images[0]?.url ?? CARD_PLACEHOLDERS[idx % CARD_PLACEHOLDERS.length];
}

export default async function HomePage() {
  const allServizi = await getServizi("published");
  const featured = allServizi.slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
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

          <div className="relative hidden aspect-[4/5] overflow-hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85"
              alt="Lucrezia — consulente finanziaria"
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      {/* ── Services grid ── */}
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

          {featured.length === 0 ? (
            <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
              {CARD_PLACEHOLDERS.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-[var(--color-background)] p-8"
                >
                  <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-[var(--color-card-subtle)]">
                    <Image src={img} alt="" fill className="object-cover opacity-60" sizes="33vw" />
                  </div>
                  <div className="h-3 w-16 rounded bg-[var(--color-border)]" />
                  <div className="mt-3 h-6 w-3/4 rounded bg-[var(--color-border)]" />
                  <div className="mt-3 h-12 w-full rounded bg-[var(--color-border)] opacity-50" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
              {featured.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/servizi/${s.slug}`}
                  className="group flex flex-col bg-[var(--color-background)] transition-colors hover:bg-[var(--color-accent-light)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getServiceImage(s, idx)}
                      alt={s.images[0]?.alt ?? s.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                      {s.category}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl text-[var(--color-foreground)]">
                      {s.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                      {s.shortDescription}
                    </p>
                    <p className="mt-6 text-sm font-medium text-[var(--color-foreground)]">
                      {new Intl.NumberFormat("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      }).format(s.priceCents / 100)}{" "}
                      →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Brand story ── */}
      <section className="section-spacing">
        <div className="container-xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative hidden aspect-video overflow-hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80"
              alt="Studio professionale"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
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

      {/* ── Newsletter ── */}
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
