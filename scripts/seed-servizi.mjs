// Seed the 9 real services into Firestore.
// Usage: node scripts/seed-servizi.mjs
//
// Reads Firebase Admin credentials from .env.local (same convention as
// set-admin.mjs). Prices are PLACEHOLDERS — Lucrezia can edit them from the
// admin panel. Ebook & corsi online link out to external platforms instead of
// the cart (externalUrl set). Re-running upserts by slug (no duplicates).

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = resolve(__dirname, "../.env.local");
const env = readFileSync(envPath, "utf8");
for (const line of env.split("\n")) {
  const eqIdx = line.indexOf("=");
  if (eqIdx === -1) continue;
  const key = line.slice(0, eqIdx).trim();
  let val = line.slice(eqIdx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  val = val.replace(/\\n/g, "\n");
  if (key) process.env[key] = val;
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const img = (slug, alt) => [{ url: `/images/servizi/${slug}.png`, alt, order: 0 }];

/** @type {Array<Omit<import("../src/types").ServizioDoc,"id"|"createdAt"|"updatedAt">>} */
const SERVIZI = [
  {
    slug: "consulenza-creditizia",
    name: "Consulenza Creditizia",
    category: "Credito",
    type: "consulenza",
    priceCents: 6000,
    externalUrl: "",
    shortDescription:
      "Analisi del merito creditizio e ricerca della soluzione di finanziamento più adatta: mutui, prestiti personali, cessione del quinto e consolidamento debiti.",
    description:
      "<p>Ti affianco nell'analisi del tuo profilo economico e nella scelta della soluzione di credito più adatta ai tuoi obiettivi, con un approccio orientato a trasparenza e sostenibilità.</p><ul><li><strong>Mutui</strong> — acquisto, ristrutturazione e surroga.</li><li><strong>Prestiti personali e finanziamenti</strong> per progetti privati o professionali.</li><li><strong>Cessione del quinto</strong> di stipendio o pensione.</li><li><strong>Consolidamento e rinegoziazione</strong> dei debiti per alleggerire le rate.</li><li>Valutazione comparata dei prodotti e assistenza in tutte le fasi dell'istruttoria.</li></ul><p>Iscritta all'OAM — Organismo degli Agenti e dei Mediatori (sezione collaboratori di mediatori creditizi).</p>",
    images: img("consulenza-creditizia", "Consulenza creditizia"),
    status: "published",
    seo: {
      title: "Consulenza Creditizia — Mutui, prestiti e consolidamento",
      description:
        "Consulenza sul credito: mutui, prestiti, cessione del quinto e consolidamento debiti, con analisi del merito creditizio e soluzioni su misura.",
    },
  },
  {
    slug: "caf-patronato",
    name: "Orientamento e Supporto Previdenziale e Assistenziale",
    category: "CAF & Patronato",
    type: "consulenza",
    priceCents: 3500,
    externalUrl: "",
    shortDescription:
      "Assistenza fiscale, previdenziale e assistenziale: dichiarazione dei redditi (730), ISEE, pensioni, contributi, bonus e pratiche INPS.",
    description:
      "<p>Come operatrice professionale certificata CAF e Patronato ti accompagno tra normative e pratiche, tutelando i tuoi diritti e semplificando le procedure.</p><ul><li><strong>Pratiche fiscali</strong> — modello 730, ISEE, RED e detrazioni per famiglie e persone con disabilità.</li><li><strong>Pratiche previdenziali</strong> — pensioni, versamenti volontari, estratti contributivi e ricongiunzioni.</li><li><strong>Prestazioni assistenziali</strong> — assegni familiari, invalidità civile, infortuni e malattie professionali.</li><li><strong>Disoccupazione (NASpI)</strong> e permessi di soggiorno.</li><li>Verifica della posizione contributiva e simulazioni pensionistiche.</li></ul><p>Per lavoratori dipendenti e autonomi, pensionati, famiglie e cittadini.</p>",
    images: img("caf-patronato", "Orientamento previdenziale e assistenziale"),
    status: "published",
    seo: {
      title: "CAF e Patronato — 730, ISEE, pensioni e pratiche INPS",
      description:
        "Assistenza fiscale, previdenziale e assistenziale: 730, ISEE, pensioni, contributi, bonus, NASpI e pratiche INPS con un operatore certificato.",
    },
  },
  {
    slug: "formazione-professionale",
    name: "Formazione Professionale",
    category: "Formazione",
    type: "consulenza",
    priceCents: 12000,
    externalUrl: "",
    shortDescription:
      "Percorsi formativi su misura per enti, aziende e privati: CAF, paghe e contributi, contabilità, segreteria e figure amministrative.",
    description:
      "<p>Progetto ed erogo percorsi formativi teorico-pratici, con metodologie interattive e casi reali, per preparare studenti e professionisti alle sfide del mercato del lavoro.</p><ul><li><strong>Servizi CAF e Patronato</strong> — dichiarazioni fiscali, ISEE, pratiche previdenziali e assistenziali.</li><li><strong>Paghe e contributi</strong> — elaborazione cedolini e adempimenti.</li><li><strong>Contabilità generale</strong> — partita doppia e bilancio d'esercizio.</li><li><strong>Segreteria e office management</strong> — competenze amministrative e organizzative.</li><li>Progettazione didattica, materiali e valutazione finale delle competenze.</li></ul><p>Docente nei percorsi del Progetto GOL (Regione Lombardia) e iscritta al Registro dei Formatori Professionisti AIF.</p>",
    images: img("formazione-professionale", "Formazione professionale"),
    status: "published",
    seo: {
      title: "Formazione Professionale — Corsi su misura",
      description:
        "Percorsi formativi su misura su CAF, paghe e contributi, contabilità e figure amministrative, con docenza certificata AIF.",
    },
  },
  {
    slug: "orientamento-professionale",
    name: "Orientamento e Sviluppo Professionale",
    category: "Orientamento",
    type: "consulenza",
    priceCents: 7000,
    externalUrl: "",
    shortDescription:
      "Orientamento certificato ASNOR: analisi delle competenze, definizione degli obiettivi e piano d'azione concreto per la tua crescita.",
    description:
      "<p>Come orientatrice certificata ASNOR ti aiuto a riconoscere talenti e attitudini e a costruire un percorso formativo e professionale realmente tuo.</p><ul><li><strong>Analisi dei bisogni</strong> e valutazione delle soft e hard skills.</li><li><strong>Percorsi personalizzati</strong> per inserimento, riqualificazione o scelta degli studi.</li><li><strong>Tecniche di ricerca attiva</strong> del lavoro: CV, lettera motivazionale e colloquio.</li><li><strong>Coaching e mentoring</strong> per la crescita e il posizionamento professionale.</li><li>Supporto continuo in ogni fase dello sviluppo.</li></ul><p>Iscritta al Registro degli Orientatori Professionali ASNOR.</p>",
    images: img("orientamento-professionale", "Orientamento e sviluppo professionale"),
    status: "published",
    seo: {
      title: "Orientamento e Sviluppo Professionale — Certificata ASNOR",
      description:
        "Orientamento professionale certificato ASNOR: analisi delle competenze, obiettivi e piano d'azione per la crescita personale e di carriera.",
    },
  },
  {
    slug: "ai-innovazione",
    name: "AI e Innovazione Digitale",
    category: "Innovazione",
    type: "consulenza",
    priceCents: 9000,
    externalUrl: "",
    shortDescription:
      "Formazione e consulenza su ChatGPT e intelligenza artificiale per studiare, lavorare e fare impresa con gli strumenti digitali di oggi.",
    description:
      "<p>Trasformiamo l'intelligenza artificiale in uno strumento pratico e quotidiano, applicato a formazione, lavoro e servizi.</p><ul><li><strong>ChatGPT e strumenti AI</strong> — dall'uso di base ai prompt avanzati.</li><li><strong>Digital transformation</strong> — strumenti digitali per lavorare meglio.</li><li><strong>Automazione e produttività</strong> — ottimizzare processi e tempo.</li><li><strong>AI per l'educazione</strong> — materiali didattici personalizzati e inclusivi.</li><li>Applicazioni nei processi di recruiting e nella creazione di contenuti.</li></ul><p>Formatrice certificata sull'uso di ChatGPT e dell'intelligenza artificiale in ambito educativo e professionale.</p>",
    images: img("ai-innovazione", "AI e innovazione digitale"),
    status: "published",
    seo: {
      title: "AI e Innovazione Digitale — Formazione su ChatGPT",
      description:
        "Formazione e consulenza su ChatGPT e intelligenza artificiale per studio, lavoro e impresa: prompt, automazione e produttività.",
    },
  },
  {
    slug: "microcredito",
    name: "Microcredito e Autoimpiego",
    category: "Microcredito",
    type: "consulenza",
    priceCents: 8000,
    externalUrl: "",
    shortDescription:
      "Formazione e accompagnamento sul microcredito e l'autoimpiego, per trasformare un'idea in un progetto imprenditoriale sostenibile.",
    description:
      "<p>Affianco aspiranti imprenditori e piccole realtà nel comprendere e utilizzare il microcredito in modo efficace, sostenibile e responsabile.</p><ul><li><strong>Fondamenti del microcredito</strong> — normativa, principi e strumenti operativi.</li><li><strong>Valutazione del merito creditizio</strong> e analisi del rischio.</li><li><strong>Inclusione finanziaria</strong> e sostegno all'autoimprenditorialità.</li><li><strong>Sviluppo del progetto</strong> e accesso alle misure di autoimpiego.</li><li>Educazione finanziaria a supporto delle decisioni economiche.</li></ul><p>Docente qualificata accreditata ENM nel progetto «Yes I Start Up — YISU Sicilia II» dell'Ente Nazionale Microcredito.</p>",
    images: img("microcredito", "Microcredito e autoimpiego"),
    status: "published",
    seo: {
      title: "Microcredito e Autoimpiego — Formazione e accompagnamento",
      description:
        "Formazione e accompagnamento sul microcredito e l'autoimpiego per trasformare un'idea in un progetto imprenditoriale sostenibile.",
    },
  },
  {
    slug: "sicurezza-lavoro",
    name: "Formazione Sicurezza sul Lavoro",
    category: "Sicurezza",
    type: "consulenza",
    priceCents: 9000,
    externalUrl: "",
    shortDescription:
      "Corsi di formazione sulla salute e sicurezza sul lavoro ai sensi del D.Lgs. 81/08, per lavoratori, preposti e aziende.",
    description:
      "<p>La sicurezza non è solo un obbligo: è un valore che protegge le persone e costruisce il futuro dell'impresa. Corsi pratici, interattivi e sempre aggiornati alla normativa vigente.</p><ul><li><strong>Formazione lavoratori</strong> — rischio basso, medio e alto.</li><li><strong>Corsi per aziende</strong>, preposti, dirigenti e RSPP.</li><li><strong>Normativa e aggiornamenti</strong> ai sensi del D.Lgs. 81/08.</li><li><strong>Metodo interattivo</strong> — lezioni pratiche e materiali didattici inclusi.</li><li>Erogazione in presenza e in modalità FAD.</li></ul><p>Percorso di formazione formatori della sicurezza sul lavoro in corso (Pedago).</p>",
    images: img("sicurezza-lavoro", "Formazione sicurezza sul lavoro"),
    status: "published",
    seo: {
      title: "Formazione Sicurezza sul Lavoro — D.Lgs. 81/08",
      description:
        "Corsi di formazione su salute e sicurezza sul lavoro ai sensi del D.Lgs. 81/08 per lavoratori, preposti, dirigenti e aziende.",
    },
  },
  {
    slug: "ebook-professionali",
    name: "Ebook Professionali — Orizzonti Finanziari",
    category: "Ebook",
    type: "digitale",
    priceCents: 1990,
    externalUrl: "https://www.amazon.it/dp/B0D2B1HFBX",
    shortDescription:
      "La collana «Orizzonti Finanziari»: guide ed ebook per l'educazione finanziaria e la preparazione agli esami OCF, OAM e IVASS.",
    description:
      "<p>Una collana che unisce rigore tecnico e approccio didattico, pensata per rendere i contenuti finanziari accessibili a studenti e professionisti.</p><ul><li><strong>Educazione finanziaria di base</strong> e gestione del sovraindebitamento.</li><li><strong>Preparazione esame OCF</strong> — consulenti finanziari.</li><li><strong>Preparazione esame OAM</strong> — agenti e mediatori creditizi.</li><li><strong>Preparazione esame IVASS</strong> — intermediari assicurativi.</li><li>Contenuti chiari, aggiornati e subito applicabili.</li></ul><p>Acquisto e download gestiti sulla piattaforma esterna.</p>",
    images: img("ebook-professionali", "Ebook professionali — collana Orizzonti Finanziari"),
    status: "published",
    seo: {
      title: "Ebook Professionali — Collana Orizzonti Finanziari",
      description:
        "Guide ed ebook per l'educazione finanziaria e la preparazione agli esami OCF, OAM e IVASS. Collana «Orizzonti Finanziari».",
    },
  },
  {
    slug: "corsi-online",
    name: "Corsi Online",
    category: "Formazione online",
    type: "digitale",
    priceCents: 4900,
    externalUrl: "https://www.lezione-online.it/",
    shortDescription:
      "Corsi online di educazione e preparazione finanziaria su piattaforma, con video-lezioni, materiali ed esercitazioni pratiche.",
    description:
      "<p>Formazione flessibile, ovunque tu sia: corsi 100% online da seguire al tuo ritmo, con contenuti aggiornati e attestato finale.</p><ul><li><strong>Corsi di preparazione</strong> agli esami OCF e OAM.</li><li><strong>Educazione finanziaria</strong> e gestione consapevole del denaro.</li><li><strong>Video-lezioni, materiali ed esercitazioni</strong> con quiz di verifica.</li><li><strong>Accesso H24</strong> e supporto dedicato ai discenti.</li><li>Attestati riconosciuti al termine del percorso.</li></ul><p>Iscrizione e accesso gestiti sulla piattaforma esterna.</p>",
    images: img("corsi-online", "Corsi online su piattaforma"),
    status: "published",
    seo: {
      title: "Corsi Online — Educazione e preparazione finanziaria",
      description:
        "Corsi online di educazione e preparazione finanziaria con video-lezioni, materiali, esercitazioni e attestato finale.",
    },
  },
];

const base = Date.now();

async function run() {
  let created = 0;
  let updated = 0;

  for (let i = 0; i < SERVIZI.length; i++) {
    const s = SERVIZI[i];
    // Spaced timestamps so the listing (sorted by createdAt desc) keeps the
    // order defined in this array — index 0 is the newest.
    const createdAt = new Date(base - i * 60_000).toISOString();
    const updatedAt = createdAt;

    const existing = await db
      .collection("servizi")
      .where("slug", "==", s.slug)
      .limit(1)
      .get();

    if (existing.empty) {
      const ref = db.collection("servizi").doc();
      await ref.set({ ...s, id: ref.id, createdAt, updatedAt });
      created++;
      console.log(`+ creato: ${s.name}`);
    } else {
      const ref = existing.docs[0].ref;
      // Preserve original createdAt on update so manual reordering survives.
      await ref.set({ ...s, id: ref.id, updatedAt }, { merge: true });
      updated++;
      console.log(`~ aggiornato: ${s.name}`);
    }
  }

  console.log(`\n✓ Fatto — ${created} creati, ${updated} aggiornati.`);
  console.log(
    "I prezzi sono segnaposto: modificali da /admin/servizi quando vuoi."
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
