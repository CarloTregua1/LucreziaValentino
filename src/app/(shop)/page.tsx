import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServizi } from "@/lib/actions/servizi";
import type { ServizioDoc } from "@/types";
import { ParallaxGallery } from "./_components/parallax-gallery";
import { StatCounter } from "./_components/stat-counter";

export const metadata: Metadata = {
  title: "Lucrezia Valentino — Consulenza, formazione e orientamento",
  description:
    "Consulenza specialistica, formazione professionale e orientamento per lo sviluppo delle competenze, la crescita professionale e la valorizzazione del capitale umano. In presenza e online, su tutto il territorio nazionale.",
};

// Render at request time, not at build time — the homepage reads from
// Firestore and we don't want the Vercel build to depend on the DB.
export const dynamic = "force-dynamic";

const CARD_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=85",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=85",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85",
];

function getServiceImage(s: ServizioDoc, idx: number): string {
  return s.images[0]?.url ?? CARD_PLACEHOLDERS[idx % CARD_PLACEHOLDERS.length];
}

const STATS = [
  { value: "10+", label: "Anni nel settore finanziario" },
  { value: "100%", label: "Percorsi su misura" },
  { value: "Italia", label: "In presenza e online" },
];

const ROLES = [
  "Educatrice Finanziaria",
  "Formatrice Professionale",
  "Consulente del Credito",
  "Orientatrice Professionale",
  "Progettista Formativa",
];

// Logos shown at the very top of the page (registers and accreditations).
// OAM and S.ARF are intentionally represented as text below, not as logos.
const ACCREDITATIONS = [
  { src: "/images/loghi/aief.png", alt: "AIEF — Associazione Italiana Educatori Finanziari" },
  { src: "/images/loghi/asnor.png", alt: "ASNOR — Associazione Nazionale Orientatori" },
  { src: "/images/loghi/aif.png", alt: "AIF — Associazione Italiana Formatori" },
  { src: "/images/loghi/microcredito.png", alt: "Ente Nazionale Microcredito" },
  { src: "/images/loghi/regione-sicilia.png", alt: "Regione Siciliana" },
  { src: "/images/loghi/regione-lombardia.png", alt: "Regione Lombardia" },
];

// Textual registrations (no logo, per client request).
const TEXT_CREDENTIALS = [
  "Iscritta all’OAM — Organismo degli Agenti e dei Mediatori",
  "Iscritta al S.ARF — Registro Regionale dei Formatori della Regione Siciliana",
];

const METHOD_STEPS = [
  {
    n: "01",
    title: "Analisi delle esigenze",
    body: "Valutazione preliminare degli obiettivi, delle esigenze e del contesto di riferimento, al fine di individuare le soluzioni più adeguate e il percorso maggiormente coerente con le specifiche necessità.",
  },
  {
    n: "02",
    title: "Definizione del percorso",
    body: "Elaborazione di un percorso personalizzato di consulenza, formazione o orientamento, strutturato sulla base di obiettivi chiari, priorità operative e risultati attesi.",
  },
  {
    n: "03",
    title: "Affiancamento e monitoraggio",
    body: "Supporto professionale durante l’intero percorso, con monitoraggio delle attività, aggiornamento continuo e attenzione al raggiungimento degli obiettivi definiti.",
  },
];

const FAQS = [
  {
    q: "Come si svolge il primo incontro?",
    a: "Il primo incontro conoscitivo consente di approfondire esigenze, obiettivi e ambiti di interesse, al fine di individuare la soluzione più adeguata e definire un percorso coerente con le specifiche necessità.",
  },
  {
    q: "Di quali ambiti ti occupi?",
    a: "Le competenze comprendono educazione finanziaria, consulenza creditizia e microcredito, preparazione agli esami OCF, OAM e IVASS, orientamento professionale, progettazione e formazione professionale, servizi fiscali e previdenziali, sicurezza sul lavoro e innovazione digitale.",
  },
  {
    q: "I servizi sono disponibili solo a Catania?",
    a: "Le attività possono essere svolte sia in presenza sia a distanza, consentendo la collaborazione con persone, professionisti, imprese ed enti su tutto il territorio nazionale.",
  },
  {
    q: "A chi sono rivolti i servizi?",
    a: "I servizi si rivolgono a privati, professionisti, studenti, lavoratori, imprese, enti di formazione, associazioni e organizzazioni interessati allo sviluppo di competenze professionali, finanziarie e trasversali.",
  },
  {
    q: "Come richiedere una consulenza o un percorso formativo?",
    a: "È possibile richiedere informazioni o fissare un incontro attraverso i recapiti presenti nella sezione Contatti. Ogni richiesta viene valutata al fine di individuare la soluzione più adeguata alle specifiche esigenze.",
  },
  {
    q: "Sono previsti attestati o certificazioni?",
    a: "L’eventuale rilascio di attestati o certificazioni dipende dalla tipologia di percorso e dalle disposizioni previste dall’ente organizzatore o dal soggetto promotore delle attività formative.",
  },
  {
    q: "È possibile realizzare percorsi personalizzati?",
    a: "Sì. Ogni intervento può essere progettato e adattato sulla base degli obiettivi, del contesto professionale e delle esigenze specifiche della persona, dell’azienda o dell’organizzazione.",
  },
  {
    q: "Sono previste collaborazioni con aziende ed enti di formazione?",
    a: "Sì. Le collaborazioni comprendono attività di docenza, progettazione formativa, orientamento, educazione finanziaria e consulenza specialistica realizzate con aziende, enti di formazione, istituti scolastici, associazioni e organizzazioni.",
  },
  {
    q: "Sono disponibili percorsi di preparazione agli esami OCF, OAM e IVASS?",
    a: "Sì. Sono disponibili percorsi individuali e di gruppo finalizzati all’acquisizione delle competenze necessarie per affrontare gli esami di abilitazione professionale.",
  },
  {
    q: "È possibile svolgere consulenze e percorsi formativi online?",
    a: "Sì. Molti servizi di consulenza, formazione e orientamento possono essere erogati efficacemente anche in modalità online attraverso piattaforme digitali dedicate.",
  },
];

export default async function HomePage() {
  const allServizi = await getServizi("published");
  const featured = allServizi.slice(0, 3);

  return (
    <div>
      {/* ── Accreditations (top) ── */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-cream-deep)]">
        <div className="container-xl py-10 sm:py-12">
          <p
            className="text-center text-xs uppercase tracking-widest text-[var(--color-muted)]"
          >
            Iscrizioni, registri e accreditamenti
          </p>
          <ul
            className="mt-7 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
          >
            {ACCREDITATIONS.map((logo) => (
              <li key={logo.src} className="flex items-center justify-center">
                <span className="relative h-12 w-full max-w-[140px]">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className="object-contain opacity-80 transition-opacity hover:opacity-100"
                    sizes="140px"
                  />
                </span>
              </li>
            ))}
          </ul>
          <ul className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-2 text-center text-xs tracking-wide text-[var(--color-muted)] sm:flex-row sm:justify-center sm:gap-8">
            {TEXT_CREDENTIALS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-12 sm:pb-28 lg:pt-16 lg:pb-32">
        <div className="container-xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow">
                Consulenza · Formazione · Orientamento
              </p>

              <h1
                className="mt-6 font-serif leading-[0.95] text-[var(--color-foreground)]"
              >
                <span
                  className="block"
                  style={{ fontSize: "var(--text-display)" }}
                >
                  Lucrezia Valentino
                </span>
                <span
                  className="mt-4 block serif-italic text-[var(--color-accent)]"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  Consulenza, formazione e orientamento per la crescita
                  professionale e finanziaria.
                </span>
              </h1>

              <p
                className="mt-7 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                {ROLES.join(" · ")}
              </p>

              <p
                className="mt-7 max-w-xl leading-relaxed text-[var(--color-foreground-soft)]"
              >
                Consulenza specialistica, formazione professionale e
                orientamento per lo sviluppo delle competenze, la crescita
                professionale e la valorizzazione del capitale umano.
              </p>

              <p
                className="mt-5 max-w-xl leading-relaxed text-[var(--color-foreground-soft)]"
              >
                Competenze specialistiche nei settori dell’educazione
                finanziaria, della consulenza creditizia e del microcredito,
                della preparazione agli esami OCF, OAM e IVASS, della
                progettazione formativa, dei servizi fiscali e previdenziali,
                della sicurezza sul lavoro e dell’innovazione digitale.
              </p>

              <p
                className="mt-5 max-w-xl leading-relaxed text-[var(--color-foreground-soft)]"
              >
                Percorsi di consulenza, formazione e sviluppo rivolti a persone,
                professionisti, imprese, enti di formazione e organizzazioni,
                fondati su competenza, etica professionale, innovazione e
                aggiornamento continuo.
              </p>

              <div
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/servizi"
                  className="bg-[var(--color-foreground)] px-9 py-4 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
                >
                  Aree di competenza
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
                  Su tutto il territorio nazionale · in presenza e online
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-card-subtle)]">
                <Image
                  src="/images/lucrezia.jpg"
                  alt="Lucrezia Valentino — consulenza, formazione e orientamento"
                  fill
                  priority
                  className="object-cover animate-kenburns"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                {/* floating credibility badge */}
                <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-auto sm:max-w-xs bg-[var(--color-background)]/95 backdrop-blur p-5 sm:p-6">
                  <p className="eyebrow">Dal 2011 nel settore finanziario</p>
                  <p className="mt-2 font-serif text-2xl leading-tight text-[var(--color-foreground)]">
                    Competenza ed{" "}
                    <span className="serif-italic">ascolto</span>, al servizio
                    delle tue scelte.
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
              <StatCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Aree di competenza grid ── */}
      <section className="section-spacing">
        <div className="container-xl">
          <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
            <div>
              <p className="section-index">01 — Aree di competenza</p>
              <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
                Consulenza, formazione e orientamento per la crescita
                professionale e finanziaria di{" "}
                <span className="serif-italic">
                  persone, professionisti e organizzazioni.
                </span>
              </h2>
            </div>
            <div className="sm:text-right">
              <p className="text-[var(--color-foreground-soft)]">
                Percorsi su misura per lo sviluppo delle competenze e la
                valorizzazione del capitale umano.
              </p>
              <Link
                href="/servizi"
                className="link-underline mt-4 inline-block text-sm text-[var(--color-foreground)]"
              >
                Vedi tutte le aree di competenza →
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
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-card-subtle)]">
                    <Image
                      src={getServiceImage(s, idx)}
                      alt={s.images[0]?.alt ?? s.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
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
                        {s.externalUrl
                          ? "Disponibile online"
                          : new Intl.NumberFormat("it-IT", {
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
              Un percorso strutturato, dall’analisi delle esigenze fino al
              raggiungimento degli obiettivi definiti.
            </p>
          </div>

          <ol className="mt-14 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
            {METHOD_STEPS.map((step, i) => (
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

      {/* ── Parallax gallery ── */}
      <ParallaxGallery />

      {/* ── Brand story ── */}
      <section className="section-spacing">
        <div className="container-xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <div
            className="relative order-2 aspect-[4/5] overflow-hidden bg-[var(--color-card-subtle)] lg:order-1"
          >
            <Image
              src="/images/lucrezia.jpg"
              alt="Lucrezia Valentino"
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
              Sono Lucrezia Valentino. Dopo oltre dieci anni nel settore
              finanziario e assicurativo, oggi unisco consulenza, formazione e
              orientamento: aiuto persone, professionisti e organizzazioni a
              sviluppare competenze e a crescere a livello professionale e
              finanziario. Il mio compito è rendere comprensibile e azionabile
              ciò che spesso sembra troppo complesso.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                "Educatrice finanziaria certificata AIEF",
                "Consulente del credito iscritta all’OAM",
                "Formatrice AIF · Orientatrice certificata ASNOR",
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

      {/* ── Collaborazioni professionali ── */}
      <section className="section-spacing border-y border-[var(--color-border)] bg-[var(--color-cream-deep)]">
        <div className="container-xl grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="section-index">04 — Collaborazioni Professionali</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Una rete di{" "}
              <span className="serif-italic">collaborazioni.</span>
            </h2>
          </div>

          <div
            className="lg:col-span-7 space-y-6 leading-relaxed text-[var(--color-foreground-soft)]"
          >
            <p>
              Una rete di collaborazioni sviluppata con enti di formazione,
              accademie, associazioni professionali, istituti scolastici,
              organizzazioni e realtà operanti nei settori della formazione,
              dell’orientamento, dell’educazione finanziaria e della
              consulenza.
            </p>
            <p>
              Attività di docenza, progettazione formativa, educazione
              finanziaria, orientamento professionale e consulenza specialistica
              realizzate nell’ambito di percorsi professionalizzanti, programmi
              finanziati, iniziative PNRR e progetti dedicati allo sviluppo
              delle competenze e alla valorizzazione del capitale umano.
            </p>
            <p>
              Tra le esperienze più significative, la realizzazione di percorsi
              di educazione finanziaria presso istituti scolastici nell’ambito
              delle iniziative PNRR, con il coinvolgimento di studenti, docenti
              e comunità educanti, contribuendo alla diffusione di competenze
              finanziarie e professionali orientate alla cittadinanza attiva e
              consapevole.
            </p>
          </div>
        </div>
      </section>

      {/* ── Informazioni utili (FAQ) ── */}
      <section className="section-spacing">
        <div className="container-xl grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="section-index">05 — Informazioni Utili</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Indicazioni e{" "}
              <span className="serif-italic">chiarimenti.</span>
            </h2>
            <p className="mt-5 text-[var(--color-foreground-soft)]">
              Indicazioni e chiarimenti sui servizi, sulle modalità di
              collaborazione e sui percorsi di consulenza, formazione e
              orientamento.
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

      {/* ── CTA — Parliamone insieme ── */}
      <section className="relative overflow-hidden bg-[var(--color-foreground)] text-[var(--color-background)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 hidden h-96 w-96 rounded-full bg-[var(--color-accent)]/15 blur-3xl md:block"
        />
        <div className="container-xl section-spacing relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p
                className="eyebrow"
                style={{ color: "var(--color-accent-light)" }}
              >
                Parliamone insieme
              </p>
              <h2 className="mt-4 font-serif text-[var(--text-h1)] leading-[1] text-[var(--color-background)]">
                Ogni percorso nasce{" "}
                <span className="serif-italic text-[var(--color-accent-light)]">
                  dall’ascolto.
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-[var(--color-muted-light)]">
                Ogni percorso nasce dall’ascolto, dall’analisi delle esigenze e
                dalla definizione di soluzioni concrete orientate alla crescita
                professionale, allo sviluppo delle competenze e al benessere
                finanziario. Per informazioni sui servizi o sulle modalità di
                collaborazione, è possibile richiedere un contatto diretto.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                href="/account/messaggi"
                className="inline-block bg-[var(--color-accent)] px-10 py-4 text-sm tracking-widest uppercase text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Richiedi informazioni
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
