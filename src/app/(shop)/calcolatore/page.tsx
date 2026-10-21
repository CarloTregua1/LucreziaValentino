import type { Metadata } from "next";
import { Calcolatore } from "./calcolatore";

export const metadata: Metadata = {
  title: "Calcolatore finanziamenti",
  description:
    "Scopri in un minuto se puoi ottenere un mutuo, un prestito personale o una cessione del quinto: rata stimata, importo massimo e sostenibilità secondo i criteri delle banche italiane.",
};

const CRITERI = [
  {
    titolo: "Rapporto rata/reddito",
    testo:
      "È il primo dato che la banca guarda: la somma delle rate, incluse quelle già in corso, non dovrebbe superare un terzo del reddito netto. Oltre il 40% una richiesta viene raramente accettata.",
  },
  {
    titolo: "Quota finanziata",
    testo:
      "Per un mutuo le banche finanziano di norma fino all’80% del valore dell’immobile. Gli under 36 con i requisiti per il Fondo di garanzia prima casa possono arrivare fino al 100%.",
  },
  {
    titolo: "Età e contratto",
    testo:
      "Contano la stabilità del reddito e l’età a fine piano: il mutuo deve chiudersi di solito entro i 75–80 anni, e un contratto a tempo indeterminato pesa più di uno a termine.",
  },
];

export default function CalcolatorePage() {
  return (
    <div>
      {/* Sizes come from the standard text-* utilities rather than
          text-[var(--text-h1)], which Tailwind v4 compiles to a color. */}
      <section className="pt-12 pb-10 sm:pt-16">
        <div className="container-xl">
          <p className="section-index">· Calcolatore</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--color-foreground)] sm:text-5xl">
            Puoi ottenere un finanziamento?{" "}
            <span className="serif-italic text-[var(--color-accent)]">
              Scoprilo in un minuto.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-[var(--color-foreground-soft)]">
            Inserisci pochi dati e ottieni subito la rata stimata, l’importo che
            puoi chiedere e una prima valutazione basata sui criteri usati dalle
            banche italiane. Nessuna registrazione, nessun dato salvato.
          </p>
        </div>
      </section>

      <section className="pb-[var(--section-y)]">
        <div className="container-xl">
          <Calcolatore />
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-cream-deep)] section-spacing">
        <div className="container-xl">
          <p className="section-index">Come leggere il risultato</p>
          <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-tight text-[var(--color-foreground)] sm:text-4xl">
            Cosa guarda la banca{" "}
            <span className="serif-italic text-[var(--color-accent)]">
              prima di dire sì.
            </span>
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {CRITERI.map((c, i) => (
              <div key={c.titolo} className="border-t border-[var(--color-border-strong)] pt-6">
                <p className="section-index">0{i + 1}</p>
                <h3 className="mt-3 font-serif text-xl text-[var(--color-foreground)]">
                  {c.titolo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                  {c.testo}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-4xl text-xs leading-relaxed text-[var(--color-muted)]">
            Simulazione a scopo puramente indicativo, che non costituisce
            offerta, proposta o promessa di finanziamento. I tassi sono
            ipotetici e modificabili; il calcolo non include spese, imposte,
            assicurazioni e altri oneri, per cui non rappresenta il TAEG.
            L’effettiva concessione e le condizioni dipendono dalla valutazione
            del merito creditizio da parte dell’istituto erogante. I dati
            inseriti restano nel tuo browser e non vengono salvati.
          </p>
        </div>
      </section>
    </div>
  );
}
