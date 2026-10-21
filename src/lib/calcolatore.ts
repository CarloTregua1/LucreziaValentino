/**
 * Credit pre-assessment maths for /calcolatore.
 *
 * Everything here is a rule of thumb from the Italian market, not a bank's
 * scoring model: the point is to give a visitor a rough, honest idea and a
 * reason to talk to Lucrezia. The thresholds are named constants so they can
 * be tuned in one place.
 */

/** Rate/income ratio within which a bank normally considers a loan sustainable. */
export const DTI_SOSTENIBILE = 1 / 3;
/** Above this, a bank will rarely approve. */
export const DTI_MASSIMO = 0.4;
/** Banks normally lend up to 80% of the property value. */
export const LTV_STANDARD = 0.8;
/** Usual age limit at the end of a mortgage. */
export const ETA_FINE_MUTUO = 75;
export const ETA_FINE_MUTUO_MAX = 80;
/** Under this age the Fondo di garanzia prima casa (Consap) can reach 100%. */
export const ETA_UNDER = 36;
/** Notary, taxes and agency, as a share of the price. */
export const SPESE_ACQUISTO = 0.1;
/** Usual age limit at the end of a cessione del quinto for pensioners. */
export const ETA_FINE_CESSIONE_PENSIONATO = 90;

export type Contratto = "indeterminato" | "determinato" | "autonomo" | "pensionato";
export type TipoCessione = "pubblico" | "privato" | "pensionato";
export type Livello = "ok" | "warn" | "ko" | "info";
export type Esito = "buono" | "valutare" | "difficile";

export interface Verifica {
  livello: Livello;
  titolo: string;
  testo: string;
}

/** French amortisation: monthly payment for a capital over `mesi` months. */
export function rataMensile(capitale: number, tanAnnuo: number, mesi: number): number {
  if (capitale <= 0 || mesi <= 0) return 0;
  const r = tanAnnuo / 100 / 12;
  if (r === 0) return capitale / mesi;
  return (capitale * r) / (1 - Math.pow(1 + r, -mesi));
}

/** Inverse of rataMensile: the capital a monthly payment can repay. */
export function capitaleDaRata(rata: number, tanAnnuo: number, mesi: number): number {
  if (rata <= 0 || mesi <= 0) return 0;
  const r = tanAnnuo / 100 / 12;
  if (r === 0) return rata * mesi;
  return (rata * (1 - Math.pow(1 + r, -mesi))) / r;
}

/** Net monthly income averaged over the year, so 13th/14th count. */
export function redditoMedio(nettoMensile: number, mensilita: number): number {
  return (nettoMensile * mensilita) / 12;
}

export function esitoDa(verifiche: Verifica[]): Esito {
  if (verifiche.some((v) => v.livello === "ko")) return "difficile";
  if (verifiche.some((v) => v.livello === "warn")) return "valutare";
  return "buono";
}

const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  // Italian locale data skips the separator below 10.000; group always so
  // "1.500 €" and "15.000 €" read the same way side by side.
  useGrouping: "always",
});
export const formatEuro = (n: number) => eur.format(Math.round(n));
export const formatPerc = (n: number) => `${Math.round(n * 100)}%`;

function verificaDti(dti: number): Verifica {
  if (!Number.isFinite(dti)) {
    return {
      livello: "ko",
      titolo: "Reddito",
      testo: "Inserisci un reddito netto mensile per calcolare la sostenibilità.",
    };
  }
  if (dti <= DTI_SOSTENIBILE) {
    return {
      livello: "ok",
      titolo: "Rapporto rata/reddito",
      testo: `Le rate assorbono il ${formatPerc(dti)} del reddito: entro un terzo, la soglia che le banche considerano sostenibile.`,
    };
  }
  if (dti <= DTI_MASSIMO) {
    return {
      livello: "warn",
      titolo: "Rapporto rata/reddito",
      testo: `Le rate assorbono il ${formatPerc(dti)} del reddito: sopra un terzo la banca valuta caso per caso. Allungare la durata o ridurre l’importo aiuta.`,
    };
  }
  return {
    livello: "ko",
    titolo: "Rapporto rata/reddito",
    testo: `Le rate assorbirebbero il ${formatPerc(dti)} del reddito: oltre il 40% una richiesta viene raramente accettata.`,
  };
}

function verificaContratto(contratto: Contratto, prodotto: "mutuo" | "prestito"): Verifica | null {
  switch (contratto) {
    case "indeterminato":
      return {
        livello: "ok",
        titolo: "Contratto",
        testo: "Il contratto a tempo indeterminato è il profilo preferito dalle banche.",
      };
    case "pensionato":
      return {
        livello: "ok",
        titolo: "Reddito da pensione",
        testo: "La pensione è un reddito stabile; conta soprattutto l’età a fine piano.",
      };
    case "determinato":
      return {
        livello: "warn",
        titolo: "Contratto a termine",
        testo:
          prodotto === "mutuo"
            ? "Con un contratto a tempo determinato spesso serve un garante o un co-intestatario."
            : "Con un contratto a termine la durata del prestito tende a seguire la scadenza del contratto.",
      };
    case "autonomo":
      return {
        livello: "warn",
        titolo: "Lavoro autonomo",
        testo:
          "Il reddito viene valutato sulle ultime dichiarazioni (di solito due anni): conta che sia stabile o in crescita.",
      };
  }
}

/* ── Mutuo ─────────────────────────────────────────────────────────────── */

export interface MutuoInput {
  prezzo: number;
  anticipo: number;
  reddito: number;
  redditoCo: number;
  mensilita: number;
  altreRate: number;
  anni: number;
  tan: number;
  eta: number;
  contratto: Contratto;
}

export interface MutuoRisultato {
  importo: number;
  rata: number;
  ltv: number;
  dti: number;
  mutuoMax: number;
  prezzoMax: number;
  spese: number;
  verifiche: Verifica[];
  esito: Esito;
}

export function calcolaMutuo(i: MutuoInput): MutuoRisultato {
  const mesi = i.anni * 12;
  const reddito = redditoMedio(i.reddito + i.redditoCo, i.mensilita);
  const importo = Math.max(i.prezzo - i.anticipo, 0);
  const ltv = i.prezzo > 0 ? importo / i.prezzo : 0;
  const rata = rataMensile(importo, i.tan, mesi);
  const dti = reddito > 0 ? (rata + i.altreRate) / reddito : Infinity;
  const under = i.eta < ETA_UNDER;

  const mutuoMaxReddito = capitaleDaRata(reddito * DTI_SOSTENIBILE - i.altreRate, i.tan, mesi);
  // The down payment caps the price too: at 80% LTV it is a fifth of it.
  const prezzoMax = under
    ? mutuoMaxReddito + i.anticipo
    : Math.min(mutuoMaxReddito + i.anticipo, i.anticipo / (1 - LTV_STANDARD));
  const mutuoMax = Math.max(Math.min(mutuoMaxReddito, prezzoMax - i.anticipo), 0);

  const verifiche: Verifica[] = [];

  if (importo === 0) {
    verifiche.push({
      livello: "info",
      titolo: "Nessun mutuo necessario",
      testo: "L’anticipo copre già il prezzo dell’immobile.",
    });
  } else {
    verifiche.push(verificaDti(dti));

    if (ltv <= LTV_STANDARD) {
      verifiche.push({
        livello: "ok",
        titolo: "Anticipo",
        testo: `Chiedi il ${formatPerc(ltv)} del valore dell’immobile, entro l’80% che le banche finanziano di norma.`,
      });
    } else if (ltv <= 1 && under) {
      verifiche.push({
        livello: "warn",
        titolo: "Anticipo",
        testo: `Chiedi il ${formatPerc(ltv)} del valore: oltre l’80% è possibile con il Fondo di garanzia prima casa (Consap), se rispetti i requisiti per gli under 36.`,
      });
    } else {
      verifiche.push({
        livello: "ko",
        titolo: "Anticipo",
        testo: `Chiedi il ${formatPerc(ltv)} del valore: le banche finanziano di norma fino all’80%, quindi servirebbe un anticipo di almeno ${formatEuro(i.prezzo * (1 - LTV_STANDARD))}.`,
      });
    }

    const etaFine = i.eta + i.anni;
    if (etaFine <= ETA_FINE_MUTUO) {
      verifiche.push({
        livello: "ok",
        titolo: "Età a fine mutuo",
        testo: `Finiresti di pagare a ${etaFine} anni.`,
      });
    } else if (etaFine <= ETA_FINE_MUTUO_MAX) {
      verifiche.push({
        livello: "warn",
        titolo: "Età a fine mutuo",
        testo: `Finiresti di pagare a ${etaFine} anni: molte banche si fermano a 75, alcune arrivano a 80.`,
      });
    } else {
      verifiche.push({
        livello: "ko",
        titolo: "Età a fine mutuo",
        testo: `Finiresti di pagare a ${etaFine} anni, oltre il limite di 80 che le banche applicano. Prova una durata di ${Math.max(ETA_FINE_MUTUO_MAX - i.eta, 0)} anni o meno.`,
      });
    }

    const contratto = verificaContratto(i.contratto, "mutuo");
    if (contratto) verifiche.push(contratto);
  }

  const spese = i.prezzo * SPESE_ACQUISTO;
  verifiche.push({
    livello: "info",
    titolo: "Spese di acquisto",
    testo: `Oltre all’anticipo, tieni da parte circa ${formatEuro(spese)} per notaio, imposte e agenzia.`,
  });

  return { importo, rata, ltv, dti, mutuoMax, prezzoMax, spese, verifiche, esito: esitoDa(verifiche) };
}

/* ── Prestito personale ────────────────────────────────────────────────── */

export interface PrestitoInput {
  importo: number;
  mesi: number;
  tan: number;
  reddito: number;
  mensilita: number;
  altreRate: number;
  contratto: Contratto;
}

export interface PrestitoRisultato {
  rata: number;
  interessi: number;
  dti: number;
  importoMax: number;
  verifiche: Verifica[];
  esito: Esito;
}

export function calcolaPrestito(i: PrestitoInput): PrestitoRisultato {
  const reddito = redditoMedio(i.reddito, i.mensilita);
  const rata = rataMensile(i.importo, i.tan, i.mesi);
  const interessi = rata * i.mesi - i.importo;
  const dti = reddito > 0 ? (rata + i.altreRate) / reddito : Infinity;
  const importoMax = capitaleDaRata(reddito * DTI_SOSTENIBILE - i.altreRate, i.tan, i.mesi);

  const verifiche: Verifica[] = [verificaDti(dti)];
  const contratto = verificaContratto(i.contratto, "prestito");
  if (contratto) verifiche.push(contratto);
  if (i.altreRate > 0) {
    verifiche.push({
      livello: "info",
      titolo: "Finanziamenti in corso",
      testo:
        "Con più rate aperte, un consolidamento può abbassare l’importo mensile complessivo: vale la pena valutarlo.",
    });
  }

  return { rata, interessi, dti, importoMax, verifiche, esito: esitoDa(verifiche) };
}

/* ── Cessione del quinto ───────────────────────────────────────────────── */

export interface CessioneInput {
  tipo: TipoCessione;
  netto: number;
  trattenute: number;
  mesi: number;
  tan: number;
  eta: number;
}

export interface CessioneRisultato {
  rataMax: number;
  importoMax: number;
  /** Extra capital with a delega di pagamento (employees only). */
  importoDelega: number;
  verifiche: Verifica[];
  esito: Esito;
}

export function calcolaCessione(i: CessioneInput): CessioneRisultato {
  const quinto = i.netto / 5;
  const rataMax = Math.max(quinto - i.trattenute, 0);
  const importoMax = capitaleDaRata(rataMax, i.tan, i.mesi);
  const importoDelega = i.tipo === "pensionato" ? 0 : capitaleDaRata(quinto, i.tan, i.mesi);

  const verifiche: Verifica[] = [];
  if (rataMax <= 0) {
    verifiche.push({
      livello: "ko",
      titolo: "Quinto già impegnato",
      testo:
        i.netto > 0
          ? "Le trattenute in corso occupano già tutto il quinto disponibile. Un rinnovo anticipato può liberare nuova liquidità."
          : "Inserisci lo stipendio o la pensione netta mensile.",
    });
  } else {
    verifiche.push({
      livello: "ok",
      titolo: "Rata massima",
      testo: `La rata può arrivare a ${formatEuro(rataMax)} al mese, trattenuta direttamente in busta paga o sulla pensione.`,
    });
  }

  if (i.tipo === "pubblico") {
    verifiche.push({
      livello: "ok",
      titolo: "Dipendente pubblico",
      testo: "Per i dipendenti pubblici le condizioni sono in genere le più vantaggiose.",
    });
  } else if (i.tipo === "privato") {
    verifiche.push({
      livello: "info",
      titolo: "Dipendente privato",
      testo: "Contano anche l’azienda (dimensioni, solidità) e il TFR maturato.",
    });
  } else {
    const etaFine = i.eta + Math.ceil(i.mesi / 12);
    verifiche.push(
      etaFine <= ETA_FINE_CESSIONE_PENSIONATO
        ? {
            livello: "ok",
            titolo: "Età a fine piano",
            testo: `Termineresti il piano a circa ${etaFine} anni.`,
          }
        : {
            livello: "ko",
            titolo: "Età a fine piano",
            testo: `Termineresti a circa ${etaFine} anni, oltre il limite di ${ETA_FINE_CESSIONE_PENSIONATO} che si applica di solito. Prova una durata più breve.`,
          },
    );
    verifiche.push({
      livello: "info",
      titolo: "Pensione minima",
      testo: "La rata non può ridurre la pensione sotto il trattamento minimo INPS.",
    });
  }

  verifiche.push({
    livello: "info",
    titolo: "Altri finanziamenti",
    testo: "La cessione del quinto non richiede garanzie e si può ottenere anche con altri prestiti in corso.",
  });

  return { rataMax, importoMax, importoDelega, verifiche, esito: esitoDa(verifiche) };
}
