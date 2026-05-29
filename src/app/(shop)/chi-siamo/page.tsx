import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi sono",
  description:
    "Lucrezia Valentino — educatrice finanziaria, formatrice e consulente. Oltre dieci anni tra finanza, formazione e orientamento, al servizio delle tue scelte.",
};

const VALUES = [
  {
    title: "Chiarezza",
    body: "Niente gergo tecnico inutile. Ti spiego ogni passaggio, così sai esattamente cosa stiamo facendo e perché.",
  },
  {
    title: "Su misura",
    body: "Non esiste una soluzione valida per tutti. Costruisco il percorso partendo dalla tua storia e dai tuoi obiettivi.",
  },
  {
    title: "Etica e riservatezza",
    body: "Trasparenza, sostenibilità e rispetto della persona. I tuoi dati restano tuoi, trattati con cura e mai condivisi.",
  },
];

const TIMELINE = [
  {
    year: "1996",
    title: "Perito aziendale e lingue estere",
    body: "Diploma all'ITC «Luigi Einaudi» in economia, tecnica aziendale e diritto.",
  },
  {
    year: "2011",
    title: "Specialista Consulente Finanziario",
    body: "Dieci anni in Poste Italiane tra consulenza, prodotti finanziari e assicurativi.",
  },
  {
    year: "2024",
    title: "Educatrice finanziaria AIEF",
    body: "Certificazione AIEF, avvio della libera professione e prime pubblicazioni.",
  },
  {
    year: "2025",
    title: "Credito, docenza e pubblicazioni",
    body: "Iscrizione all'OAM, consulenza creditizia e docenza nei progetti GOL; nasce la collana «Orizzonti Finanziari».",
  },
  {
    year: "2026",
    title: "Formazione e microcredito",
    body: "Iscrizione all'AIF, accreditamento ENM per il microcredito e formazione sulla sicurezza sul lavoro.",
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
            La finanza è una materia umana,
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
                src="/images/lucrezia.jpg"
                alt="Ritratto di Lucrezia Valentino"
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
              Educatrice finanziaria, formatrice e consulente.
            </p>

            <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-foreground-soft)]">
              <p>
                Mi chiamo Lucrezia e da oltre dieci anni mi muovo nel mondo
                della finanza, della formazione e dell&apos;orientamento. Ho
                iniziato in Poste Italiane come consulente finanziaria; oggi
                affianco persone, famiglie e professionisti come educatrice
                finanziaria, consulente del credito e operatrice CAF e
                Patronato.
              </p>
              <p>
                Il mio lavoro non si esaurisce nei numeri: si tratta di
                ascoltare una storia, capire dove ci sono opportunità e
                costruire una strada percorribile, sostenibile, chiara. La
                materia finanziaria è complessa per natura — il mio compito è
                renderla{" "}
                <span className="serif-italic text-[var(--color-foreground)]">
                  comprensibile e azionabile
                </span>{" "}
                per chi ho di fronte.
              </p>
              <p>
                Sono anche formatrice e orientatrice: progetto e conduco corsi
                su credito, fisco, sicurezza sul lavoro e intelligenza
                artificiale, e accompagno chi cerca la propria strada
                professionale. Scrivo inoltre guide ed ebook per rendere
                l&apos;educazione finanziaria davvero accessibile.
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
