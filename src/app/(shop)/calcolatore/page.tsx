import type { Metadata } from "next";
import { Calcolatore } from "./calcolatore";

export const metadata: Metadata = {
  title: "Simulatore finanziario",
  description:
    "Scopri quanto potresti ottenere per un mutuo, un prestito personale o una cessione del quinto e calcola la tua rata. Gratuito, senza registrazione e senza impegno.",
};

const CRITERI = [
  {
    titolo: "Rapporto rata/reddito",
    domanda: "Quanto puoi pagare ogni mese?",
    testi: [
      "La banca verifica quanto guadagni e quali rate stai già pagando.",
      "In generale, è consigliabile che il totale delle rate mensili non superi circa un terzo del reddito netto. Questa percentuale è indicativa e può variare in base alla tua situazione economica e alle regole della banca.",
    ],
  },
  {
    titolo: "Importo finanziabile",
    domanda: "Quanto puoi ottenere?",
    testi: [
      "L’importo che puoi richiedere dipende dal tuo reddito, dalle rate che stai già pagando e dalla durata del finanziamento.",
      "Se richiedi un mutuo per acquistare casa, generalmente la banca finanzia fino all’80% del valore dell’immobile. In alcuni casi è possibile ottenere una percentuale maggiore, se sono rispettate determinate condizioni.",
    ],
  },
  {
    titolo: "Età e situazione lavorativa",
    domanda: "Quali altri aspetti vengono valutati?",
    testi: [
      "La banca considera la tua età, il tipo di lavoro, la stabilità del reddito e la tua capacità di rispettare i pagamenti.",
      "Avere un reddito regolare e dimostrabile può facilitare la valutazione della richiesta. Anche chi lavora in proprio o ha un contratto a termine può ottenere un finanziamento, se possiede i requisiti richiesti.",
    ],
  },
];

export default function CalcolatorePage() {
  return (
    <div>
      {/* Sizes come from the standard text-* utilities rather than
          text-[var(--text-h1)], which Tailwind v4 compiles to a color. */}
      <section className="pt-12 pb-10 sm:pt-16">
        <div className="container-xl">
          <p className="section-index">· Simulatore finanziario</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[var(--color-foreground)] sm:text-5xl">
            Vuoi richiedere un mutuo o un prestito?{" "}
            <span className="serif-italic text-[var(--color-accent)]">
              Scopri quanto potresti ottenere e calcola la tua rata.
            </span>
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-[var(--color-foreground-soft)]">
            <p>
              Inserisci pochi dati e scopri in modo semplice e veloce quanto
              potresti richiedere per un mutuo o un prestito e quale potrebbe
              essere la tua rata mensile.
            </p>
            <p>
              Il calcolatore ti offre una prima simulazione indicativa, per
              aiutarti a valutare la soluzione più adatta alle tue esigenze.
            </p>
            <p className="font-bold text-[var(--color-foreground)]">
              Gratuito, senza registrazione e senza impegno.
            </p>
          </div>
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
            Cosa valuta la banca{" "}
            <span className="serif-italic text-[var(--color-accent)]">
              prima di concedere un finanziamento?
            </span>
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-[var(--color-foreground-soft)]">
            Quando richiedi un prestito o un mutuo, la banca valuta diversi
            aspetti per capire se puoi restituire la somma richiesta senza
            difficoltà economiche.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {CRITERI.map((c, i) => (
              <div key={c.titolo} className="border-t border-[var(--color-border-strong)] pt-6">
                <p className="section-index">
                  0{i + 1} — {c.titolo}
                </p>
                <h3 className="mt-3 font-serif text-xl text-[var(--color-foreground)]">
                  {c.domanda}
                </h3>
                {c.testi.map((t) => (
                  <p key={t} className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                    {t}
                  </p>
                ))}
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
