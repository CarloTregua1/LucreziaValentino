import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi sono",
  description:
    "Lucrezia, consulente specializzata in bonus e ottimizzazione fiscale. Esperienza, metodo e ascolto al servizio dei tuoi obiettivi.",
};

const VALUES = [
  {
    title: "Chiarezza",
    body: "Niente gergo tecnico inutile. Ti spiego ogni passaggio, così sai esattamente cosa stiamo facendo e perché.",
  },
  {
    title: "Su misura",
    body: "Non esiste una soluzione valida per tutti. Costruisco la strategia partendo dai tuoi numeri e dai tuoi obiettivi.",
  },
  {
    title: "Riservatezza",
    body: "I tuoi dati restano tuoi. Trattati con cura, protetti e mai condivisi senza il tuo consenso esplicito.",
  },
];

const TIMELINE = [
  {
    year: "2018",
    title: "Laurea in Economia",
    body: "Tesi sulla fiscalità delle PMI italiane, votazione 110/110 con lode.",
  },
  {
    year: "2020",
    title: "Abilitazione Dottore Commercialista",
    body: "Iscrizione all'Ordine e avvio della libera professione.",
  },
  {
    year: "2022",
    title: "Specializzazione bonus e incentivi",
    body: "Focus su credito d'imposta, transizione 4.0 e bonus edilizi.",
  },
  {
    year: "2026",
    title: "Studio Lucrezia",
    body: "Oggi affianco oltre 200 clienti tra privati, professionisti e imprese.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-xl">
          <p className="section-index">— Chi sono</p>
          <h1 className="mt-4 max-w-4xl font-serif text-[var(--text-h1)] leading-[1.02] text-[var(--color-foreground)]">
            La fiscalità è una materia umana,
            <br />
            <span className="serif-italic text-[var(--color-accent)]">
              prima ancora che tecnica.
            </span>
          </h1>
        </div>
      </section>

      {/* Portrait + bio */}
      <section className="pb-24">
        <div className="container-xl grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-card-subtle)]">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=90"
                alt="Ritratto di Lucrezia"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow">Lucrezia Valentino</p>
            <p className="mt-3 font-serif text-3xl leading-tight text-[var(--color-foreground)] sm:text-4xl">
              Consulente in bonus e fiscalità.
            </p>

            <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-foreground-soft)]">
              <p>
                Mi chiamo Lucrezia e da oltre cinque anni accompagno privati,
                liberi professionisti e piccole-medie imprese in tutto ciò che
                riguarda fisco, bonus e ottimizzazione finanziaria.
              </p>
              <p>
                Sono dottore commercialista, ma il mio lavoro non si esaurisce
                nei numeri: si tratta di leggere una situazione, capire dove ci
                sono opportunità non sfruttate e costruire una strada
                percorribile, sostenibile, chiara. La materia fiscale è
                complessa per natura — il mio compito è renderla{" "}
                <span className="serif-italic text-[var(--color-foreground)]">
                  comprensibile e azionabile
                </span>{" "}
                per chi sta dall&apos;altra parte della scrivania.
              </p>
              <p>
                Ogni nuovo cliente è una nuova relazione: ascolto, studio,
                propongo. E poi accompagno nel tempo, perché la pianificazione
                fiscale non è un evento una tantum — è un percorso.
              </p>
            </div>

            <p className="mt-12 font-serif italic text-2xl text-[var(--color-accent)]">
              — Lucrezia
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing bg-[var(--color-card-subtle)]">
        <div className="container-xl">
          <div className="max-w-2xl">
            <p className="section-index">01 — Valori</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Tre principi,{" "}
              <span className="serif-italic">una sola promessa.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
            {VALUES.map((value, idx) => (
              <div
                key={value.title}
                className="flex flex-col bg-[var(--color-background)] p-8 sm:p-10"
              >
                <p className="font-serif text-5xl text-[var(--color-accent)]">
                  0{idx + 1}
                </p>
                <h3 className="mt-8 font-serif text-2xl text-[var(--color-foreground)]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-spacing">
        <div className="container-xl grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="section-index">02 — Percorso</p>
            <h2 className="mt-3 font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
              Il filo conduttore
              <br />
              <span className="serif-italic">della mia strada.</span>
            </h2>
            <p className="mt-5 text-[var(--color-foreground-soft)]">
              Le tappe principali, dalla formazione alla pratica.
            </p>
          </div>

          <ol className="lg:col-span-8">
            {TIMELINE.map((item, idx) => (
              <li
                key={item.year}
                className="grid grid-cols-[auto_1fr] gap-8 border-t border-[var(--color-border)] py-8 sm:gap-12"
              >
                <span className="font-serif text-3xl text-[var(--color-accent)] sm:text-4xl">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[var(--color-foreground)] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[var(--color-foreground-soft)]">
                    {item.body}
                  </p>
                </div>
                {idx === TIMELINE.length - 1 && (
                  <span className="col-span-2 mt-2 block border-b border-[var(--color-border)]" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-foreground)] text-[var(--color-background)]">
        <div className="container-xl section-spacing text-center">
          <p
            className="eyebrow"
            style={{ color: "var(--color-accent-light)" }}
          >
            Iniziamo a conoscerci
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-[var(--text-h1)] leading-[1.05] text-[var(--color-background)]">
            La prima call è{" "}
            <span className="serif-italic text-[var(--color-accent-light)]">
              gratuita.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[var(--color-muted-light)]">
            Trenta minuti per capire se possiamo lavorare insieme. Senza
            impegno, in totale riservatezza.
          </p>
          <Link
            href="/servizi"
            className="mt-10 inline-block bg-[var(--color-accent)] px-10 py-4 text-sm tracking-widest uppercase text-white transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Vedi i servizi
          </Link>
        </div>
      </section>
    </div>
  );
}
