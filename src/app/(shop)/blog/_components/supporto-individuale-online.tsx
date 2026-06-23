import Link from "next/link";

type Row = { name: string; values: string[] };

/**
 * Responsive price table. On desktop it renders as aligned columns with a
 * header row; on mobile each course collapses into a stacked card where every
 * price is shown as a labelled row (no squished/scrolling columns).
 */
function PriceTable({
  gridClass,
  columns,
  rows,
}: {
  /** The `sm:`-prefixed grid-template-columns class (mobile is always 1 col). */
  gridClass: string;
  columns: string[];
  rows: Row[];
}) {
  return (
    <div className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)]">
      {/* Header — desktop only */}
      <div
        className={`hidden bg-[var(--color-cream-deep)] sm:grid ${gridClass}`}
      >
        {columns.map((c, i) => (
          <div
            key={c}
            className={`px-5 py-4 text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] ${
              i === 0 ? "" : "text-center"
            }`}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {rows.map((row) => (
          <div
            key={row.name}
            className={`grid grid-cols-1 px-5 py-5 sm:items-stretch sm:px-0 sm:py-0 ${gridClass}`}
          >
            <div className="font-serif text-xl text-[var(--color-foreground)] sm:flex sm:items-center sm:px-5 sm:py-4 sm:text-lg">
              {row.name}
            </div>
            {row.values.map((v, i) => (
              <div
                key={i}
                className="mt-2 flex items-center justify-between border-t border-[var(--color-border)] pt-2 text-sm sm:mt-0 sm:justify-center sm:border-t-0 sm:px-5 sm:py-4 sm:pt-4"
              >
                <span className="text-[var(--color-muted)] sm:hidden">
                  {columns[i + 1]}
                </span>
                <span className="font-medium tabular-nums text-[var(--color-foreground)]">
                  {v}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const APPROFONDIMENTI = [
  {
    title: "Educazione finanziaria di base",
    body: "Percorso dedicato a chi desidera comprendere meglio la gestione del denaro nella vita quotidiana, il budget personale, il risparmio, gli strumenti di pagamento, il conto corrente, le carte, i prestiti, gli interessi, l’indebitamento e i concetti introduttivi di pianificazione finanziaria.",
  },
  {
    title: "Preparazione Esame OAM",
    body: "Supporto mirato per lo studio della disciplina dell’agente in attività finanziaria e del mediatore creditizio, del credito ai consumatori, della trasparenza bancaria, dell’antiriciclaggio, della privacy e delle regole di correttezza professionale.",
  },
  {
    title: "Preparazione Esame OCF",
    body: "Lezioni dedicate agli argomenti principali dell’esame, tra cui mercati finanziari, strumenti finanziari, azioni, obbligazioni, fondi, ETF, intermediari finanziari, MiFID II, adeguatezza, appropriatezza, rischi finanziari, matematica finanziaria, pianificazione finanziaria e finanza comportamentale.",
  },
  {
    title: "Preparazione Esame IVASS",
    body: "Supporto allo studio della normativa assicurativa, della distribuzione assicurativa, degli obblighi informativi verso il cliente, dei contratti assicurativi, dei rami vita e danni, della previdenza complementare, dell’antiriciclaggio, dei reclami e della tecnica assicurativa.",
  },
];

const COMPRENDE = [
  "spiegazione personalizzata degli argomenti",
  "chiarimento dei dubbi",
  "esercitazioni guidate",
  "commento di quiz e simulazioni",
  "ripasso mirato",
  "analisi degli errori",
  "supporto al metodo di studio",
  "indicazioni operative per organizzare meglio la preparazione",
];

const DESTINATARI = [
  "Educazione finanziaria di base",
  "Preparazione Esame OAM",
  "Preparazione Esame OCF",
  "Preparazione Esame IVASS",
];

const SINGLE_LESSONS: Row[] = [
  { name: "Educazione finanziaria di base", values: ["50 €", "75 €", "100 €"] },
  { name: "Preparazione Esame OAM", values: ["75 €", "110 €", "145 €"] },
  { name: "Preparazione Esame OCF", values: ["80 €", "120 €", "155 €"] },
  { name: "Preparazione Esame IVASS", values: ["80 €", "120 €", "155 €"] },
];

const PACKAGES: Row[] = [
  { name: "Educazione finanziaria di base", values: ["150 €", "245 €", "480 €"] },
  { name: "Preparazione Esame OAM", values: ["220 €", "360 €", "700 €"] },
  { name: "Preparazione Esame OCF", values: ["235 €", "385 €", "750 €"] },
  { name: "Preparazione Esame IVASS", values: ["220 €", "360 €", "700 €"] },
];

const INTENSIVE: Row[] = [
  { name: "Preparazione Esame OAM", values: ["12 ore", "830 €"] },
  { name: "Preparazione Esame OCF", values: ["12 ore", "900 €"] },
  { name: "Preparazione Esame IVASS", values: ["12 ore", "830 €"] },
];

export function SupportoIndividualeOnline() {
  return (
    <section
      id="supporto-individuale"
      className="border-b border-[var(--color-border)] bg-[var(--color-card-subtle)]"
    >
      <div className="container-xl section-spacing">
        {/* Intro */}
        <div className="max-w-3xl">
          <p className="eyebrow">Supporto individuale online</p>
          <h2 className="mt-4 font-serif text-[var(--text-h2)] leading-tight text-[var(--color-foreground)]">
            Lezioni personalizzate per educazione finanziaria,{" "}
            <span className="serif-italic text-[var(--color-accent)]">
              OAM, OCF e IVASS.
            </span>
          </h2>
          <div className="mt-6 space-y-5 leading-relaxed text-[var(--color-foreground-soft)]">
            <p>
              Accanto ai percorsi formativi, è possibile richiedere un servizio
              di supporto individuale online, pensato per chi desidera essere
              seguito in modo più mirato nello studio, nel ripasso e nella
              preparazione agli esami.
            </p>
            <p>
              Il servizio si svolge attraverso lezioni individuali in diretta e
              consulenze formative personalizzate, durante le quali è possibile
              approfondire argomenti specifici, chiarire dubbi, svolgere
              esercitazioni guidate e organizzare meglio il proprio metodo di
              studio.
            </p>
            <p>
              Le attività sono curate da Salvatrice Lucrezia Valentino,
              educatrice finanziaria, formatrice, orientatrice e progettista
              formativa, con esperienza nella formazione in ambito finanziario,
              creditizio, assicurativo e professionale.
            </p>
          </div>
        </div>

        {/* A chi è rivolto */}
        <div className="mt-14 grid gap-8 border-t border-[var(--color-border)] pt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="section-index">01 — A chi è rivolto</p>
            <p className="mt-4 leading-relaxed text-[var(--color-foreground-soft)]">
              Il servizio è rivolto a studenti, professionisti e adulti in
              formazione che desiderano un supporto pratico, chiaro e
              personalizzato per affrontare con maggiore sicurezza il proprio
              percorso di studio.
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm uppercase tracking-widest text-[var(--color-muted)]">
              Le lezioni individuali possono riguardare
            </p>
            <ul className="mt-5 grid gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
              {DESTINATARI.map((d) => (
                <li
                  key={d}
                  className="flex items-center bg-[var(--color-card)] px-5 py-4 font-bold text-[var(--color-foreground)]"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cosa puoi approfondire */}
        <div className="mt-14 border-t border-[var(--color-border)] pt-14">
          <p className="section-index">02 — Cosa puoi approfondire</p>
          <div className="mt-8 grid gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
            {APPROFONDIMENTI.map((item) => (
              <div
                key={item.title}
                className="flex flex-col bg-[var(--color-card)] p-7 sm:p-8"
              >
                <h3 className="font-serif text-xl text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cosa comprende il servizio */}
        <div className="mt-14 grid gap-8 border-t border-[var(--color-border)] pt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="section-index">03 — Cosa comprende</p>
            <p className="mt-4 leading-relaxed text-[var(--color-foreground-soft)]">
              Durante l’incontro online è possibile lavorare su diversi aspetti.
              L’obiettivo è offrire un supporto concreto e strutturato, aiutando
              la persona a comprendere meglio i contenuti, superare le
              difficoltà e affrontare lo studio con maggiore consapevolezza.
            </p>
          </div>
          <ul className="grid gap-x-8 gap-y-3 lg:col-span-7 sm:grid-cols-2">
            {COMPRENDE.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3 text-[var(--color-foreground-soft)]"
              >
                <span
                  aria-hidden
                  className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modalità di svolgimento */}
        <div className="mt-14 grid gap-8 border-t border-[var(--color-border)] pt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="section-index">04 — Modalità di svolgimento</p>
          </div>
          <div className="space-y-4 leading-relaxed text-[var(--color-foreground-soft)] lg:col-span-7">
            <p>
              Le lezioni si svolgono online, in diretta e su appuntamento. La
              data e l’orario vengono concordati in base alla disponibilità
              della docente e alle esigenze della persona interessata.
            </p>
            <p>
              È possibile richiedere lezioni singole oppure percorsi di
              affiancamento più continuativi, in base agli obiettivi formativi e
              al livello di preparazione.
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Per garantire una corretta organizzazione, si consiglia di
              prenotare l’incontro con almeno 48 ore di anticipo.
            </p>
          </div>
        </div>

        {/* Listino prezzi */}
        <div className="mt-14 border-t border-[var(--color-border)] pt-14">
          <p className="section-index">05 — Modalità di accesso e listino</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-[var(--color-foreground-soft)]">
            Il servizio può essere richiesto in base al percorso scelto, alla
            durata dell’incontro e all’eventuale necessità di un affiancamento
            più continuativo. È possibile prenotare lezioni singole, incontri di
            approfondimento, pacchetti di affiancamento e percorsi intensivi di
            preparazione all’esame.
          </p>

          {/* Lezioni singole */}
          <div className="mt-10">
            <h3 className="font-serif text-2xl text-[var(--color-foreground)]">
              Lezioni singole online
            </h3>
            <div className="mt-5">
              <PriceTable
                gridClass="sm:grid-cols-[1.7fr_1fr_1fr_1fr]"
                columns={[
                  "Percorso formativo",
                  "60 minuti",
                  "90 minuti",
                  "120 minuti",
                ]}
                rows={SINGLE_LESSONS}
              />
            </div>
          </div>

          {/* Pacchetti */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl text-[var(--color-foreground)]">
              Pacchetti di affiancamento online
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-[var(--color-foreground-soft)]">
              I pacchetti sono pensati per chi desidera un supporto più
              continuativo e strutturato.
            </p>
            <div className="mt-5">
              <PriceTable
                gridClass="sm:grid-cols-[1.7fr_1fr_1fr_1fr]"
                columns={[
                  "Percorso formativo",
                  "Pacchetto 3 ore",
                  "Pacchetto 5 ore",
                  "Pacchetto 10 ore",
                ]}
                rows={PACKAGES}
              />
            </div>
          </div>

          {/* Percorsi intensivi */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl text-[var(--color-foreground)]">
              Percorsi intensivi per preparazione esame
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-[var(--color-foreground-soft)]">
              Per i percorsi OAM, OCF e IVASS è possibile richiedere un percorso
              intensivo da 12 ore, finalizzato al ripasso guidato, alla
              preparazione mirata e allo svolgimento di simulazioni commentate.
            </p>
            <div className="mt-5">
              <PriceTable
                gridClass="sm:grid-cols-[1.7fr_1fr_1fr]"
                columns={["Percorso formativo", "Durata complessiva", "Compenso"]}
                rows={INTENSIVE}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-start gap-5 border-t border-[var(--color-border)] pt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl font-serif text-2xl leading-tight text-[var(--color-foreground)]">
            Vuoi prenotare una lezione o ricevere maggiori informazioni?
          </p>
          <Link
            href="/account/messaggi"
            className="inline-block shrink-0 bg-[var(--color-foreground)] px-9 py-4 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
          >
            Richiedi informazioni
          </Link>
        </div>
      </div>
    </section>
  );
}
