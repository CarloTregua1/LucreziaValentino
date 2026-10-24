"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  DTI_MASSIMO,
  DTI_SOSTENIBILE,
  calcolaCessione,
  calcolaMutuo,
  calcolaPrestito,
  formatEuro,
  formatPerc,
  type CessioneInput,
  type Contratto,
  type Esito,
  type MutuoInput,
  type PrestitoInput,
  type Verifica,
} from "@/lib/calcolatore";
import { MESSAGE_DRAFT_KEY } from "@/lib/message-draft";

type Tab = "mutuo" | "prestito" | "cessione";

const TABS: { id: Tab; label: string; short: string }[] = [
  { id: "mutuo", label: "Mutuo casa", short: "Mutuo" },
  { id: "prestito", label: "Prestito personale", short: "Prestito" },
  { id: "cessione", label: "Cessione del quinto", short: "Quinto" },
];

const CONTRATTI: { value: Contratto; label: string }[] = [
  { value: "indeterminato", label: "Indeterminato" },
  { value: "determinato", label: "Determinato" },
  { value: "autonomo", label: "Autonomo" },
  { value: "pensionato", label: "Pensionato" },
];

// The TAN leaves out fees and charges, so say so wherever a rate is asked for.
const NOTA_TAEG =
  " Il TAN non comprende spese e commissioni: il costo complessivo del finanziamento è espresso dal TAEG, indicato nell’offerta.";
const HINT_TAN_BANCA =
  "Il tasso è utilizzato solo per la simulazione. Quello effettivo dipenderà dalle condizioni proposte dalla banca." + NOTA_TAEG;
const HINT_TAN_ISTITUTO =
  "Il tasso serve a calcolare una rata indicativa. Quello effettivo dipenderà dalle condizioni applicate dall’istituto finanziatore." + NOTA_TAEG;

const MENSILITA = [
  { value: 12, label: "12" },
  { value: 13, label: "13" },
  { value: 14, label: "14" },
];

const ESITO: Record<Esito, { label: string; className: string }> = {
  buono: {
    label: "Parametri iniziali favorevoli",
    className: "bg-[#9fd8a8]/15 text-[#b6e6bd] ring-[#9fd8a8]/40",
  },
  valutare: {
    label: "Fattibile, da valutare",
    className: "bg-[#f2b46b]/15 text-[#f6c88f] ring-[#f2b46b]/40",
  },
  difficile: {
    label: "Difficile così com’è",
    className: "bg-[#f08a7e]/15 text-[#f5a99f] ring-[#f08a7e]/40",
  },
};

export function Calcolatore() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("mutuo");
  const risultatiRef = useRef<HTMLDivElement>(null);
  const [risultatiVisibili, setRisultatiVisibili] = useState(false);

  // On phones the results sit below the whole form; a bottom bar carries the
  // headline figure until the results panel itself scrolls into view.
  useEffect(() => {
    const el = risultatiRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRisultatiVisibili(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [mutuo, setMutuo] = useState<MutuoInput>({
    prezzo: 200_000,
    anticipo: 50_000,
    reddito: 2_300,
    redditoCo: 0,
    mensilita: 13,
    altreRate: 0,
    anni: 25,
    tan: 3.2,
    eta: 35,
    contratto: "indeterminato",
  });
  const [coIntestatario, setCoIntestatario] = useState(false);

  const [prestito, setPrestito] = useState<PrestitoInput>({
    importo: 15_000,
    mesi: 60,
    tan: 8.5,
    reddito: 1_800,
    mensilita: 13,
    altreRate: 0,
    contratto: "indeterminato",
  });

  const [cessione, setCessione] = useState<CessioneInput>({
    tipo: "pubblico",
    netto: 1_700,
    trattenute: 0,
    mesi: 120,
    tan: 5,
    eta: 67,
  });

  const mutuoRis = useMemo(
    () => calcolaMutuo({ ...mutuo, redditoCo: coIntestatario ? mutuo.redditoCo : 0 }),
    [mutuo, coIntestatario],
  );
  const prestitoRis = useMemo(() => calcolaPrestito(prestito), [prestito]);
  const cessioneRis = useMemo(() => calcolaCessione(cessione), [cessione]);

  const m = <K extends keyof MutuoInput>(k: K) => (v: MutuoInput[K]) =>
    setMutuo((s) => ({ ...s, [k]: v }));
  const p = <K extends keyof PrestitoInput>(k: K) => (v: PrestitoInput[K]) =>
    setPrestito((s) => ({ ...s, [k]: v }));
  const c = <K extends keyof CessioneInput>(k: K) => (v: CessioneInput[K]) =>
    setCessione((s) => ({ ...s, [k]: v }));

  function inviaALucrezia() {
    const testo = riepilogo();
    try {
      sessionStorage.setItem(MESSAGE_DRAFT_KEY, testo);
    } catch {
      // Storage blocked: the visitor lands on an empty box, which still works.
    }
    router.push("/account/messaggi");
  }

  function riepilogo(): string {
    const intro = "Ciao Lucrezia, ho usato il simulatore finanziario sul sito e vorrei una valutazione.";
    if (tab === "mutuo") {
      const contratto = CONTRATTI.find((x) => x.value === mutuo.contratto)?.label;
      return [
        intro,
        "",
        "Mutuo casa",
        `· Prezzo immobile: ${formatEuro(mutuo.prezzo)}`,
        `· Anticipo: ${formatEuro(mutuo.anticipo)}`,
        `· Mutuo richiesto: ${formatEuro(mutuoRis.importo)} in ${mutuo.anni} anni`,
        `· Reddito netto: ${formatEuro(mutuo.reddito)} × ${mutuo.mensilita} mensilità${
          coIntestatario && mutuo.redditoCo > 0
            ? ` + co-intestatario ${formatEuro(mutuo.redditoCo)}`
            : ""
        }`,
        `· Altre rate in corso: ${formatEuro(mutuo.altreRate)} al mese`,
        `· Età: ${mutuo.eta} anni · Situazione lavorativa: ${contratto}`,
        `· Rata stimata: ${formatEuro(mutuoRis.rata)} al mese (${formatPerc(mutuoRis.dti)} del reddito)`,
      ].join("\n");
    }
    if (tab === "prestito") {
      const contratto = CONTRATTI.find((x) => x.value === prestito.contratto)?.label;
      return [
        intro,
        "",
        "Prestito personale",
        `· Importo: ${formatEuro(prestito.importo)} in ${prestito.mesi} mesi`,
        `· Reddito netto: ${formatEuro(prestito.reddito)} × ${prestito.mensilita} mensilità`,
        `· Altre rate in corso: ${formatEuro(prestito.altreRate)} al mese`,
        `· Situazione lavorativa: ${contratto}`,
        `· Rata stimata: ${formatEuro(prestitoRis.rata)} al mese (${formatPerc(prestitoRis.dti)} del reddito)`,
      ].join("\n");
    }
    const tipo = {
      pubblico: "Dipendente pubblico",
      privato: "Dipendente privato",
      pensionato: "Pensionato",
    }[cessione.tipo];
    return [
      intro,
      "",
      "Cessione del quinto",
      `· ${tipo}${cessione.tipo === "pensionato" ? `, ${cessione.eta} anni` : ""}`,
      `· Netto mensile: ${formatEuro(cessione.netto)}`,
      `· Trattenute in corso: ${formatEuro(cessione.trattenute)} al mese`,
      `· Durata: ${cessione.mesi} mesi`,
      `· Importo stimato: fino a ${formatEuro(cessioneRis.importoMax)}`,
    ].join("\n");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* ── Inputs ── */}
      <div className="lg:col-span-7">
        <div
          role="tablist"
          aria-label="Tipo di finanziamento"
          className="grid grid-cols-3 border border-[var(--color-border)] bg-[var(--color-card)] p-1"
        >
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`px-2 py-3 text-sm tracking-wide transition-colors ${
                  active
                    ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                    : "text-[var(--color-foreground-soft)] hover:bg-[var(--color-card-subtle)] hover:text-[var(--color-foreground)]"
                }`}
              >
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="border border-t-0 border-[var(--color-border)] bg-[var(--color-card)] px-5 py-8 sm:px-8"
        >
          {tab === "mutuo" && (
            <div className="space-y-10">
              <Gruppo titolo="L’immobile">
                <Campo label="Prezzo dell’immobile" value={mutuo.prezzo} onChange={m("prezzo")} min={50_000} max={800_000} step={5_000} inputMax={5_000_000} unita="euro" />
                <Campo
                  label="Anticipo disponibile"
                  value={mutuo.anticipo}
                  onChange={m("anticipo")}
                  min={0}
                  max={Math.max(mutuo.prezzo, 10_000)}
                  step={1_000}
                  unita="euro"
                  hint={mutuo.prezzo > 0 ? `${formatPerc(mutuo.anticipo / mutuo.prezzo)} del prezzo` : undefined}
                />
              </Gruppo>

              <Gruppo titolo="Il tuo reddito">
                <Campo label="Reddito netto mensile" value={mutuo.reddito} onChange={m("reddito")} min={500} max={8_000} step={50} inputMax={100_000} unita="euro" hint="Quello che ricevi in busta paga o, per gli autonomi, la media mensile netta." />
                <Scelta label="Mensilità" value={mutuo.mensilita} onChange={m("mensilita")} opzioni={MENSILITA} />
                <Scelta label="Situazione lavorativa" value={mutuo.contratto} onChange={m("contratto")} opzioni={CONTRATTI} />
                <Campo label="Altre rate mensili" value={mutuo.altreRate} onChange={m("altreRate")} min={0} max={1_500} step={10} inputMax={20_000} unita="euro" hint="Inserisci il totale delle rate che paghi ogni mese per prestiti, finanziamenti auto o carte revolving." />
                <div>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-foreground)]">
                    <input
                      type="checkbox"
                      checked={coIntestatario}
                      onChange={(e) => setCoIntestatario(e.target.checked)}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    Aggiungi il reddito di un co-intestatario
                  </label>
                  {coIntestatario && (
                    <div className="mt-6">
                      <Campo label="Reddito netto mensile del co-intestatario" value={mutuo.redditoCo} onChange={m("redditoCo")} min={0} max={8_000} step={50} inputMax={100_000} unita="euro" />
                    </div>
                  )}
                </div>
              </Gruppo>

              <Gruppo titolo="Il mutuo">
                <Campo label="Durata" value={mutuo.anni} onChange={m("anni")} min={5} max={30} step={1} unita="anni" />
                <Campo label="Età del richiedente più anziano" value={mutuo.eta} onChange={m("eta")} min={18} max={75} step={1} unita="anni" />
                <Campo label="Tasso annuo indicativo (TAN)" value={mutuo.tan} onChange={m("tan")} min={0.5} max={7} step={0.05} unita="percento" hint={HINT_TAN_BANCA} />
              </Gruppo>
            </div>
          )}

          {tab === "prestito" && (
            <div className="space-y-10">
              <Gruppo titolo="Il prestito">
                <Campo label="Importo richiesto" value={prestito.importo} onChange={p("importo")} min={1_000} max={75_000} step={500} inputMax={150_000} unita="euro" />
                <Campo label="Durata" value={prestito.mesi} onChange={p("mesi")} min={12} max={120} step={6} unita="mesi" />
                <Campo label="Tasso annuo indicativo (TAN)" value={prestito.tan} onChange={p("tan")} min={2} max={15} step={0.1} unita="percento" hint={HINT_TAN_ISTITUTO} />
              </Gruppo>
              <Gruppo titolo="Il tuo reddito">
                <Campo label="Reddito netto mensile" value={prestito.reddito} onChange={p("reddito")} min={500} max={8_000} step={50} inputMax={100_000} unita="euro" />
                <Scelta label="Mensilità" value={prestito.mensilita} onChange={p("mensilita")} opzioni={MENSILITA} />
                <Scelta label="Situazione lavorativa" value={prestito.contratto} onChange={p("contratto")} opzioni={CONTRATTI} />
                <Campo label="Altre rate mensili" value={prestito.altreRate} onChange={p("altreRate")} min={0} max={1_500} step={10} inputMax={20_000} unita="euro" hint="Indica quanto paghi ogni mese per mutui, prestiti, finanziamenti e carte revolving." />
              </Gruppo>
            </div>
          )}

          {tab === "cessione" && (
            <div className="space-y-10">
              <Gruppo titolo="Chi sei">
                <Scelta
                  label="Profilo"
                  value={cessione.tipo}
                  onChange={c("tipo")}
                  opzioni={[
                    { value: "pubblico", label: "Dipendente pubblico" },
                    { value: "privato", label: "Dipendente privato" },
                    { value: "pensionato", label: "Pensionato" },
                  ]}
                />
                {cessione.tipo === "pensionato" && (
                  <Campo label="Età" value={cessione.eta} onChange={c("eta")} min={55} max={88} step={1} unita="anni" />
                )}
                <Campo
                  label={cessione.tipo === "pensionato" ? "Pensione netta mensile" : "Stipendio netto mensile"}
                  value={cessione.netto}
                  onChange={c("netto")}
                  min={600}
                  max={5_000}
                  step={50}
                  inputMax={50_000}
                  unita="euro"
                  hint="Lo trovi nel cedolino, alla voce netto a pagare."
                />
                <Campo label="Cessione o trattenute già in corso" value={cessione.trattenute} onChange={c("trattenute")} min={0} max={1_000} step={10} inputMax={10_000} unita="euro" hint="Rata mensile di una cessione esistente, se c’è." />
              </Gruppo>
              <Gruppo titolo="Il piano">
                <Campo label="Durata" value={cessione.mesi} onChange={c("mesi")} min={24} max={120} step={12} unita="mesi" />
                <Campo label="Tasso annuo indicativo (TAN)" value={cessione.tan} onChange={c("tan")} min={1} max={12} step={0.1} unita="percento" hint={HINT_TAN_ISTITUTO} />
              </Gruppo>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div ref={risultatiRef} id="risultato" className="scroll-mt-24 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div
            aria-live="polite"
            className="bg-[var(--color-foreground)] px-6 py-8 text-[var(--color-background)] sm:px-8 sm:py-10"
          >
            {tab === "mutuo" && (
              <>
                <Principale
                  etichetta="Rata mensile stimata"
                  valore={mutuoRis.rata}
                  sotto={`per un mutuo di ${formatEuro(mutuoRis.importo)} in ${mutuo.anni} anni`}
                />
                <Indicatore dti={mutuoRis.dti} />
                <Dati
                  righe={[
                    ["Mutuo richiesto", formatEuro(mutuoRis.importo)],
                    ["Quota finanziata", formatPerc(mutuoRis.ltv)],
                    ["Mutuo massimo stimato", formatEuro(mutuoRis.mutuoMax)],
                    ["Casa fino a circa", formatEuro(mutuoRis.prezzoMax)],
                  ]}
                />
                <Valutazione esito={mutuoRis.esito} verifiche={mutuoRis.verifiche} />
              </>
            )}

            {tab === "prestito" && (
              <>
                <Principale
                  etichetta="Rata mensile stimata"
                  valore={prestitoRis.rata}
                  sotto={`per ${formatEuro(prestito.importo)} in ${prestito.mesi} mesi`}
                />
                <Indicatore dti={prestitoRis.dti} />
                <Dati
                  righe={[
                    ["Interessi complessivi stimati", formatEuro(prestitoRis.interessi)],
                    ["Totale da restituire", formatEuro(prestito.importo + prestitoRis.interessi)],
                    ["Prestito massimo indicativo", formatEuro(prestitoRis.importoMax)],
                  ]}
                />
                <Valutazione esito={prestitoRis.esito} verifiche={prestitoRis.verifiche} />
              </>
            )}

            {tab === "cessione" && (
              <>
                <Principale
                  etichetta="Puoi ottenere fino a"
                  valore={cessioneRis.importoMax}
                  sotto={`con una rata di ${formatEuro(cessioneRis.rataMax)} al mese per ${cessione.mesi} mesi`}
                />
                <Dati
                  righe={[
                    ["Rata massima (un quinto)", formatEuro(cessioneRis.rataMax)],
                    ["Durata", `${cessione.mesi} mesi`],
                    ...(cessioneRis.importoDelega > 0
                      ? ([["Con delega di pagamento, in più", formatEuro(cessioneRis.importoDelega)]] as [string, string][])
                      : []),
                  ]}
                />
                <Valutazione esito={cessioneRis.esito} verifiche={cessioneRis.verifiche} />
                {cessione.tipo === "pubblico" && (
                  <Link
                    href="/convenzioni"
                    className="mt-6 block border border-[var(--color-background)]/20 px-4 py-3 text-sm text-[var(--color-background)]/85 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-background)]"
                  >
                    Dipendente della PA? Con la convenzione PACard hai condizioni
                    agevolate sulla consulenza del credito →
                  </Link>
                )}
              </>
            )}
          </div>

          {/* ── Call to action ── */}
          <div className="border border-t-0 border-[var(--color-border)] bg-[var(--color-card)] px-6 py-7 sm:px-8">
            <p className="font-serif text-xl leading-tight text-[var(--color-foreground)]">
              Vuoi conoscere la tua possibilità di{" "}
              <span className="serif-italic text-[var(--color-accent)]">ottenere un prestito?</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
              Scopri quanto potresti richiedere attraverso la cessione del
              quinto e valuta una rata compatibile con il tuo stipendio o la
              tua pensione.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
              Richiedi un approfondimento personalizzato per conoscere le
              condizioni applicabili alla tua situazione.
            </p>
            <button
              type="button"
              onClick={inviaALucrezia}
              className="mt-6 w-full bg-[var(--color-accent)] px-6 py-4 text-sm tracking-wide text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Richiedi una consulenza
            </button>
            <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
              oppure chiama il{" "}
              <a href="tel:+393508502846" className="link-underline text-[var(--color-foreground)]">
                350 850 2846
              </a>
            </p>
            <p className="mt-5 text-xs leading-relaxed text-[var(--color-muted)]">
              La simulazione è indicativa e non costituisce un’offerta di
              finanziamento. L’importo effettivamente erogabile dipende dalla
              verifica dei requisiti, dai costi applicabili e dalla valutazione
              dell’istituto finanziatore.
            </p>
          </div>
        </div>
      </div>

      <a
        href="#risultato"
        aria-hidden={risultatiVisibili}
        tabIndex={risultatiVisibili ? -1 : undefined}
        className={`fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 bg-[var(--color-foreground)] px-5 py-4 text-[var(--color-background)] shadow-[0_-4px_20px_rgb(10_36_99/0.25)] transition-transform duration-300 lg:hidden ${
          risultatiVisibili ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <span>
          <span className="block text-xs text-[var(--color-background)]/70">
            {tab === "cessione" ? "Puoi ottenere fino a" : "Rata mensile stimata"}
          </span>
          <span className="font-serif text-2xl tabular-nums">
            {formatEuro(
              tab === "mutuo" ? mutuoRis.rata : tab === "prestito" ? prestitoRis.rata : cessioneRis.importoMax,
            )}
          </span>
        </span>
        <span className="text-sm">Vedi l’esito ↓</span>
      </a>
    </div>
  );
}

/* ── Building blocks ───────────────────────────────────────────────────── */

function Gruppo({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow">{titolo}</legend>
      <div className="mt-6 space-y-7">{children}</div>
    </fieldset>
  );
}

type Unita = "euro" | "percento" | "anni" | "mesi";

const numero = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0, useGrouping: "always" });
const decimale = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

function mostra(v: number, unita: Unita) {
  return unita === "percento" ? decimale.format(v) : numero.format(v);
}

/** Parses Italian-formatted input: "1.500" is 1500, "3,2" is 3.2. */
function leggi(s: string, unita: Unita): number {
  const pulito = unita === "percento" ? s.replace(/\./g, ",").replace(",", ".") : s.replace(/\D/g, "");
  return Number.parseFloat(pulito);
}

interface CampoProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unita: Unita;
  /** Typed values may go past the slider's end, up to this. */
  inputMax?: number;
  hint?: string;
}

function Campo({ label, value, onChange, min, max, step, unita, inputMax, hint }: CampoProps) {
  const id = useId();
  const [bozza, setBozza] = useState<string | null>(null);
  const tetto = inputMax ?? max;
  const pct = Math.min(Math.max((value - min) / (max - min), 0), 1) * 100;
  const suffisso = { euro: "€", percento: "%", anni: "anni", mesi: "mesi" }[unita];

  function conferma() {
    if (bozza !== null) {
      const n = leggi(bozza, unita);
      onChange(Number.isFinite(n) ? Math.min(Math.max(n, unita === "euro" ? 0 : min), tetto) : value);
    }
    setBozza(null);
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm text-[var(--color-foreground)]">
          {label}
        </label>
        <div className="flex shrink-0 items-baseline gap-1.5 border-b border-[var(--color-border-strong)] pb-0.5 focus-within:border-[var(--color-foreground)]">
          <input
            id={id}
            type="text"
            inputMode={unita === "percento" ? "decimal" : "numeric"}
            value={bozza ?? mostra(value, unita)}
            onFocus={(e) => {
              setBozza(mostra(value, unita));
              e.target.select();
            }}
            onChange={(e) => setBozza(e.target.value)}
            onBlur={conferma}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="w-24 bg-transparent text-right font-sans text-base font-bold tabular-nums text-[var(--color-foreground)] focus:outline-none"
          />
          <span className="text-sm text-[var(--color-muted)]">{suffisso}</span>
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range mt-4"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
      {hint && <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">{hint}</p>}
    </div>
  );
}

interface SceltaProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  opzioni: { value: T; label: string }[];
}

function Scelta<T extends string | number>({ label, value, onChange, opzioni }: SceltaProps<T>) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="text-sm text-[var(--color-foreground)]">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {opzioni.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
                  : "border-[var(--color-border-strong)] text-[var(--color-foreground-soft)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Eases a number towards its target so results glide instead of jumping. */
function useAnimato(target: number): number {
  const [shown, setShown] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 350, 1);
      const v = origin + (target - origin) * (1 - Math.pow(1 - t, 3));
      from.current = v;
      setShown(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return shown;
}

function Principale({ etichetta, valore, sotto }: { etichetta: string; valore: number; sotto: string }) {
  const animato = useAnimato(valore);
  return (
    <div>
      <p className="eyebrow text-[var(--color-accent-light)]/80!">{etichetta}</p>
      <p className="mt-3 font-serif text-5xl leading-none tabular-nums sm:text-6xl">
        {formatEuro(animato)}
      </p>
      <p className="mt-3 text-sm text-[var(--color-background)]/70">{sotto}</p>
    </div>
  );
}

/** Rate/income gauge: green up to a third, amber to 40%, red beyond. */
function Indicatore({ dti }: { dti: number }) {
  const scala = 0.6;
  const valido = Number.isFinite(dti);
  const pos = valido ? (Math.min(dti, scala) / scala) * 100 : 0;
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-[var(--color-background)]/70">Rapporto rata/reddito</span>
        <span className="font-bold tabular-nums">{valido ? formatPerc(dti) : "—"}</span>
      </div>
      <div className="relative mt-3 h-2">
        <div className="flex h-full overflow-hidden rounded-full">
          <div className="bg-[#9fd8a8]/70" style={{ width: `${(DTI_SOSTENIBILE / scala) * 100}%` }} />
          <div className="bg-[#f2b46b]/70" style={{ width: `${((DTI_MASSIMO - DTI_SOSTENIBILE) / scala) * 100}%` }} />
          <div className="flex-1 bg-[#f08a7e]/70" />
        </div>
        {valido && (
          <div
            aria-hidden
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--color-foreground)] bg-[var(--color-background)] shadow transition-[left] duration-300 ease-out"
            style={{ left: `${pos}%` }}
          />
        )}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[var(--color-background)]/50">
        <span>0%</span>
        <span>33%</span>
        <span>40%</span>
        <span>60%+</span>
      </div>
    </div>
  );
}

function Dati({ righe }: { righe: [string, string][] }) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden bg-[var(--color-background)]/15">
      {righe.map(([k, v]) => (
        <div key={k} className="bg-[var(--color-foreground)] py-3 pr-3 [&:last-child:nth-child(odd)]:col-span-2 [&:nth-child(even)]:pl-4">
          <dt className="text-xs text-[var(--color-background)]/60">{k}</dt>
          <dd className="mt-1 text-lg font-bold tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

const ICONA: Record<Verifica["livello"], { segno: string; className: string }> = {
  ok: { segno: "✓", className: "bg-[#9fd8a8]/20 text-[#b6e6bd]" },
  warn: { segno: "!", className: "bg-[#f2b46b]/20 text-[#f6c88f]" },
  ko: { segno: "✕", className: "bg-[#f08a7e]/20 text-[#f5a99f]" },
  info: { segno: "i", className: "bg-[var(--color-background)]/10 text-[var(--color-background)]/70" },
};

function Valutazione({ esito, verifiche }: { esito: Esito; verifiche: Verifica[] }) {
  const e = ESITO[esito];
  return (
    <div className="mt-8 border-t border-[var(--color-background)]/15 pt-8">
      <p className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${e.className}`}>
        {e.label}
      </p>
      <ul className="mt-6 space-y-4">
        {verifiche.map((v) => {
          const i = ICONA[v.livello];
          return (
            <li key={v.titolo} className="flex gap-3">
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${i.className}`}
              >
                {i.segno}
              </span>
              <p className="text-sm leading-relaxed text-[var(--color-background)]/80">
                <span className="font-bold text-[var(--color-background)]">{v.titolo}.</span>{" "}
                {v.testo}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
