import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServizi } from "@/lib/actions/servizi";
import type { ServizioDoc } from "@/types";

export const metadata: Metadata = {
  title: "Lucrezia — Consulente in bonus e fiscalità",
  description:
    "Consulenza professionale su bonus e ottimizzazione fiscale. Strategie su misura per privati e aziende.",
};

const CARD_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=85",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=85",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85",
];

function getServiceImage(s: ServizioDoc, idx: number): string {
  return s.images[0]?.url ?? CARD_PLACEHOLDERS[idx % CARD_PLACEHOLDERS.length];
}

const STATS = [
  { value: "5+", label: "Anni di esperienza" },
  { value: "200+", label: "Clienti seguiti" },
  { value: "98%", label: "Pratiche andate a buon fine" },
];

const METHOD_STEPS = [
  {
    n: "01",
    title: "Analisi gratuita",
    body: "Una prima call conoscitiva per capire la tua situazione, gli obiettivi e i bonus a cui hai diritto.",
  },
  {
    n: "02",
    title: "Strategia personalizzata",
    body: "Costruiamo insieme un piano fiscale costruito intorno ai tuoi numeri, con priorità chiare e tempi precisi.",
  },
  {
    n: "03",
    title: "Esecuzione e follow-up",
    body: "Gestisco l'intera pratica e ti accompagno nel tempo, monitorando scadenze e nuove opportunità.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Lucrezia ha trasformato un labirinto burocratico in un percorso chiaro. Mi ha fatto risparmiare migliaia di euro che non sapevo nemmeno di poter recuperare.",
    name: "Marco T.",
    role: "Imprenditore — Milano",
  },
  {
    quote:
      "Professionale, puntuale e — cosa rara — capace di spiegare la materia in modo comprensibile. Da quando lavoro con lei, la mia attività ha tutta un'altra serenità fiscale.",
    name: "Giulia R.",
    role: "Libera professionista — Roma",
  },
];

const FAQS = [
  {
    q: "Come funziona la prima consulenza?",
    a: "La prima call conoscitiva è gratuita e dura circa 30 minuti. Insieme analizziamo la tua situazione attuale e capiamo quali bonus o ottimizzazioni sono accessibili per te.",
  },
  {
    q: "Per chi è pensato il servizio?",
    a: "Lavoro con privati, liberi professionisti e piccole-medie imprese. Ogni percorso è costruito su misura, dalla dichiarazione semplice alla pianificazione fiscale d'impresa.",
  },
  {
    q: "Quanto costano le consulenze?",
    a: "Il prezzo dipende dalla complessità della pratica. Trovi i pacchetti standard nella sezione Servizi; per esigenze specifiche, parliamo durante la prima call.",
  },
  {
    q: "I prodotti digitali sono aggiornati?",
    a: "Sì. Guide e template vengono aggiornati ad ogni modifica normativa rilevante. Chi ha già acquistato riceve la nuova versione senza costi aggiuntivi.",
  },
  {
    q: "Lavori solo in Italia?",
    a: "La consulenza è dedicata alla fiscalità italiana, ma posso seguire anche italiani residenti all'estero per quanto concerne gli obblighi nei confronti del fisco italiano.",
  },
];

export default async function HomePage() {
  const allServizi = await getServizi("published");
  const featured = allServizi.slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
        <div className="container-xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow">
                Consulente in bonus e fiscalità — Italia
              </p>

              <h1 className="mt-6 font-serif leading-[0.92] text-[var(--color-foreground)]">
                <span
                  className="block"
                  style={{ fontSize: "var(--text-display)" }}
                >
                  Lucrezia
                </span>
                <span
                  className="mt-2 block serif-italic text-[var(--color-accent)]"
                  style={{ fontSize: "calc(var(--text-h2) * 1.05)" }}
                >
                  consulenza fiscale con metodo.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-foreground-soft)]">
                Affianco privati e aziende nella gestione dei bonus e
                nell&apos;ottimizzazione fiscale. Niente formule pronte:
                soluzioni costruite sui tuoi numeri, sui tuoi obiettivi e sul
                tuo tempo.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/servizi"
                  className="bg-[var(--color-foreground)] px-9 py-4 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
                >
                  Scopri i servizi
                </Link>
                <Link
                  href="/chi-siamo"
                  className="link-underline text-sm tracking-wide text-[var(--color-foreground)]"
                >
                  Conosci Lucrezia
                </Link>
              </div>

              <div className="mt-14 hidden items-center gap-3 text-xs text-[var(--color-muted)] sm:flex">
                <span className="hair-rule" aria-hidden />
                <span className="tracking-widest uppercase">
                  Disponibile per nuove consulenze · 2026
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-card-subtle)]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=90"
                  alt="Lucrezia — consulente finanziaria"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                {/* floating credibility badge */}
                <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:max-w-xs bg-[var(--color-background)]/95 backdrop-blur p-5 sm:p-6">
                  <p className="eyebrow">Dal 2020</p>
                  <p className="mt-2 font-serif text-2xl leading-tight text-[var(--color-foreground)]">
                    Consulenza{" "}
                    <span className="serif-italic">su misura</span>, per chi
                    cerca chiarezza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-cream-deep)]">
        <div className="container-xl">
          <div className="grid grid-cols-1 divide-y divide-[var(--color-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-start px-4 py-10 sm:items-center sm:py-12 sm:text-center"
              >
                <p className="font-serif text-5xl leading-none text-[var(--color-foreground)] sm:text-6xl">
                  {s.value}
                </p>
                <p className="mt-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="section-spacing">
        <div className="container-xl">
          <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
            <div>
              <p className="section-index">01 — Servizi</p>
              <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
                Pacchetti <span className="serif-italic">chiari</span>,
                <br className="hidden sm:block" /> risultati misurabili.
              </h2>
            </div>
            <div className="sm:text-right">
              <p className="text-[var(--color-foreground-soft)]">
                Consulenze personalizzate e prodotti digitali per affrontare
                fisco e bonus con metodo.
              </p>
              <Link
                href="/servizi"
                className="link-underline mt-4 inline-block text-sm text-[var(--color-foreground)]"
              >
                Vedi tutti i servizi →
              </Link>
            </div>
          </div>

          {featured.length === 0 ? (
            <div className="mt-14 grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
              {CARD_PLACEHOLDERS.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-[var(--color-background)] p-8"
                >
                  <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-[var(--color-card-subtle)]">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover opacity-60"
                      sizes="33vw"
                    />
                  </div>
                  <p className="section-index">0{idx + 1}</p>
                  <div className="mt-3 h-6 w-3/4 rounded-sm bg-[var(--color-border)]" />
                  <div className="mt-3 h-12 w-full rounded-sm bg-[var(--color-border)] opacity-50" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-14 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/servizi/${s.slug}`}
                  className="group relative flex flex-col bg-[var(--color-background)] transition-colors duration-300 hover:bg-[var(--color-accent-light)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getServiceImage(s, idx)}
                      alt={s.images[0]?.alt ?? s.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-4 top-4 bg-[var(--color-background)]/90 px-2.5 py-1 text-xs tracking-widest text-[var(--color-foreground)]">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <p className="eyebrow">{s.category}</p>
                    <h3 className="mt-3 font-serif text-2xl text-[var(--color-foreground)]">
                      {s.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                      {s.shortDescription}
                    </p>
                    <div className="mt-8 flex items-baseline justify-between border-t border-[var(--color-border)] pt-5">
                      <p className="text-sm font-medium text-[var(--color-foreground)]">
                        {new Intl.NumberFormat("it-IT", {
                          style: "currency",
                          currency: "EUR",
                        }).format(s.priceCents / 100)}
                      </p>
                      <span className="text-sm text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
                        Approfondisci →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Metodo (process) ── */}
      <section className="section-spacing bg-[var(--color-card-subtle)]">
        <div className="container-xl">
          <div className="max-w-2xl">
            <p className="section-index">02 — Il metodo</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Tre passi, <span className="serif-italic">zero sorprese.</span>
            </h2>
            <p className="mt-5 text-[var(--color-foreground-soft)]">
              Un processo semplice, pensato per metterti subito a fuoco
              priorità, scadenze e risparmi possibili.
            </p>
          </div>

          <ol className="mt-14 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
            {METHOD_STEPS.map((step) => (
              <li
                key={step.n}
                className="flex flex-col bg-[var(--color-background)] p-8 sm:p-10"
              >
                <p className="font-serif text-6xl leading-none text-[var(--color-accent)]">
                  {step.n}
                </p>
                <h3 className="mt-8 font-serif text-2xl text-[var(--color-foreground)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Brand story ── */}
      <section className="section-spacing">
        <div className="container-xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 aspect-[4/5] overflow-hidden bg-[var(--color-card-subtle)] lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85"
              alt="Studio professionale"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="section-index">03 — Chi sono</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Esperienza al servizio dei{" "}
              <span className="serif-italic">tuoi obiettivi.</span>
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--color-foreground-soft)]">
              Sono Lucrezia, consulente specializzata in bonus e fiscalità.
              Lavoro con persone e aziende che vogliono mettere ordine nei
              propri conti senza rinunciare a opportunità. Ogni situazione è
              unica: il mio approccio è sempre personalizzato.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                "Iscritta all'Ordine dei Dottori Commercialisti",
                "Specializzazione in bonus fiscali e incentivi PMI",
                "Aggiornamento normativo continuo",
              ].map((credit) => (
                <li
                  key={credit}
                  className="flex items-start gap-3 text-[var(--color-foreground-soft)]"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-px w-6 shrink-0 bg-[var(--color-accent)]"
                  />
                  <span>{credit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/chi-siamo"
              className="link-underline mt-10 inline-block text-sm text-[var(--color-foreground)]"
            >
              Leggi la storia completa →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-spacing border-y border-[var(--color-border)] bg-[var(--color-cream-deep)]">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-index">04 — Dicono di me</p>
              <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
                Le <span className="serif-italic">parole</span> di chi mi
                sceglie.
              </h2>
            </div>
          </div>

          <div className="mt-14 grid gap-px bg-[var(--color-border)] md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col bg-[var(--color-background)] p-10 sm:p-12"
              >
                <span
                  aria-hidden
                  className="font-serif text-7xl leading-none text-[var(--color-accent)]"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 font-serif text-2xl leading-snug text-[var(--color-foreground)] sm:text-[1.65rem]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 text-sm text-[var(--color-muted)]">
                  <span className="inline-block h-px w-8 bg-[var(--color-accent)]" />
                  <span>
                    <span className="text-[var(--color-foreground)]">
                      {t.name}
                    </span>{" "}
                    · {t.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-spacing">
        <div className="container-xl grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="section-index">05 — Domande frequenti</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              <span className="serif-italic">Dubbi?</span>
              <br />
              Partiamo da qui.
            </h2>
            <p className="mt-5 text-[var(--color-foreground-soft)]">
              Non trovi la tua risposta? Scrivimi, ti rispondo personalmente
              entro 24 ore.
            </p>
            <Link
              href="/account/messaggi"
              className="link-underline mt-6 inline-block text-sm text-[var(--color-foreground)]"
            >
              Inviami un messaggio →
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-[var(--color-border)]">
              {FAQS.map((faq, idx) => (
                <details
                  key={faq.q}
                  className="group border-b border-[var(--color-border)] py-6"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between gap-6 text-left">
                    <span className="font-serif text-lg text-[var(--color-foreground)] sm:text-xl">
                      {faq.q}
                    </span>
                    <span
                      aria-hidden
                      className="relative h-4 w-4 shrink-0 text-[var(--color-accent)] transition-transform duration-300 group-open:rotate-45"
                    >
                      <span className="absolute left-1/2 top-1/2 block h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-1/2 block h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-[var(--color-foreground-soft)]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[var(--color-foreground)] text-[var(--color-background)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--color-accent)]/15 blur-3xl"
        />
        <div className="container-xl section-spacing relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p
                className="eyebrow"
                style={{ color: "var(--color-accent-light)" }}
              >
                Prossimo passo
              </p>
              <h2 className="mt-4 font-serif text-[var(--text-h1)] leading-[1] text-[var(--color-background)]">
                Prenota la prima call,{" "}
                <span className="serif-italic text-[var(--color-accent-light)]">
                  è gratuita.
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-[var(--color-muted-light)]">
                Trenta minuti per fare chiarezza sulla tua situazione fiscale
                e sui bonus a cui hai diritto. Senza impegno, in totale
                riservatezza.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                href="/servizi"
                className="inline-block bg-[var(--color-accent)] px-10 py-4 text-sm tracking-widest uppercase text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Prenota ora
              </Link>
              <p className="mt-4 text-xs tracking-widest uppercase text-[var(--color-muted-light)]">
                Risposta entro 24h
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
