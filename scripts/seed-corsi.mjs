// Seed the four "Corsi di Formazione" services into Firestore.
// Usage: node --env-file=.env scripts/seed-corsi.mjs
//
// These four are separate servizi sharing the category "Corsi di Formazione",
// because a servizio carries exactly one priceCents — there is no concept of
// purchasable options inside a single entry. Re-running upserts by slug.
//
// Falls back to .env.local if the environment isn't already populated.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
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

const CATEGORY = "Corsi di Formazione";
const img = (slug, alt) => [{ url: `/images/servizi/${slug}.jpeg`, alt, order: 0 }];

/** @type {Array<Omit<import("../src/types").ServizioDoc,"id"|"createdAt"|"updatedAt">>} */
const CORSI = [
  {
    slug: "corso-educazione-finanziaria",
    name: "Corso di Educazione Finanziaria",
    category: CATEGORY,
    type: "consulenza",
    priceCents: 17900,
    externalUrl: "",
    shortDescription:
      "Impara, pianifica, scegli: un percorso online e in presenza su risparmio, investimenti, pianificazione finanziaria e finanziamenti, con consulenza individuale inclusa.",
    description:
      "<p>Un percorso formativo pensato per chi desidera gestire il proprio denaro con maggiore consapevolezza, comprendere gli strumenti finanziari e costruire scelte sostenibili nel tempo.</p>" +
      "<p>Il corso si svolge <strong>online e in presenza</strong> e unisce teoria e pratica, con particolare attenzione al mondo dei prestiti e dei finanziamenti.</p>" +
      "<h3>Cosa imparerai</h3>" +
      "<ul>" +
      "<li><strong>Gestire il risparmio</strong> — strategie pratiche per ottimizzare il proprio denaro e raggiungere i propri obiettivi.</li>" +
      "<li><strong>Investimenti consapevoli</strong> — le principali forme di investimento e come valutare rischi e opportunità.</li>" +
      "<li><strong>Pianificazione finanziaria</strong> — budget, obiettivi e protezione: imparare a pianificare il proprio futuro.</li>" +
      "<li><strong>Finanziamenti e prestiti</strong> — tutto ciò che serve sapere per scegliere con consapevolezza.</li>" +
      "</ul>" +
      "<h3>Focus prestiti e finanziamenti</h3>" +
      "<ul>" +
      "<li>Come scegliere un prestito in base alle proprie esigenze</li>" +
      "<li>Come funzionano le diverse tipologie di prestito</li>" +
      "<li>TAN, TAEG, rata, spese e costi: come leggerli e confrontarli</li>" +
      "<li>Prestiti personali, cessione del quinto, delegazione di pagamento e mutui: caratteristiche e differenze</li>" +
      "<li>Valutare l'affidabilità degli istituti e delle offerte</li>" +
      "<li>Consigli pratici per evitare errori e scegliere in sicurezza</li>" +
      "</ul>" +
      "<h3>Cosa include il corso</h3>" +
      "<ul>" +
      "<li>Lezioni online e in presenza</li>" +
      "<li>Materiali didattici e slide</li>" +
      "<li>Guide pratiche e case study</li>" +
      "<li>Sessioni di Q&amp;A e supporto docente</li>" +
      "<li>Attestato di partecipazione</li>" +
      "</ul>" +
      "<h3>Costo del corso</h3>" +
      "<p><strong>Corso di Educazione Finanziaria — € 179</strong></p>" +
      "<p>Con consulenza individuale inclusa.</p>" +
      "<p><em>Più consapevolezza, migliori decisioni, più libertà finanziaria.</em></p>",
    images: img("corso-educazione-finanziaria", "Corso di Educazione Finanziaria"),
    status: "published",
    seo: {
      title: "Corso di Educazione Finanziaria — Risparmio, investimenti e prestiti",
      description:
        "Corso online e in presenza su risparmio, investimenti, pianificazione finanziaria e prestiti. Consulenza individuale inclusa e attestato di partecipazione.",
    },
  },
  {
    slug: "corso-oam-catania",
    name: "Corso di Preparazione OAM — Catania",
    category: CATEGORY,
    type: "consulenza",
    priceCents: 29900,
    externalUrl: "",
    shortDescription:
      "Percorso completo di preparazione all'esame OAM con 16 ore di lezioni in presenza a Catania, corso online con attestato, ebook didattico ed esercitazioni sui quesiti ufficiali.",
    description:
      "<p>Percorso completo di preparazione alla prova valutativa OAM, con lezioni <strong>in presenza a Catania</strong> il sabato, pensato per chi vuole diventare agente, mediatore o collaboratore nel credito e nei servizi di pagamento.</p>" +
      "<p>Il corso unisce formazione online, materiali didattici ed esercitazioni pratiche a un accompagnamento diretto fino alla prova.</p>" +
      "<h3>Il corso include</h3>" +
      "<ul>" +
      "<li>Corso online con attestato</li>" +
      "<li>Ebook didattico</li>" +
      "<li>16 ore di lezioni in presenza con docente esperta</li>" +
      "<li>Dispense e schede di sintesi</li>" +
      "<li>Esercitazioni e simulazioni sui quesiti ufficiali</li>" +
      "<li>Correzione commentata degli errori</li>" +
      "<li>Gruppo WhatsApp dedicato</li>" +
      "<li>Incontro finale di ripasso online</li>" +
      "</ul>" +
      "<h3>Programma del corso</h3>" +
      "<ul>" +
      "<li><strong>1. Sistema finanziario e OAM</strong> — soggetti, autorità, agenti, mediatori e collaboratori.</li>" +
      "<li><strong>2. Prodotti di credito</strong> — prestiti, mutui, credito ai consumatori, cessione del quinto e moneta elettronica.</li>" +
      "<li><strong>3. Normativa</strong> — trasparenza, antiriciclaggio, privacy, reclami e responsabilità.</li>" +
      "<li><strong>4. Preparazione alla prova</strong> — quiz, simulazioni, correzione degli errori e strategia d'esame.</li>" +
      "</ul>" +
      "<h3>Lezioni in presenza a Catania</h3>" +
      "<p>Quattro sabati di novembre 2026: <strong>7, 14, 21 e 28 novembre 2026</strong>, orario 9:00 – 13:00 (4 ore).</p>" +
      "<p>Sede del corso a Catania, in zona centrale: l'indirizzo sarà comunicato agli iscritti.</p>" +
      "<h3>Il percorso comprende</h3>" +
      "<ul>" +
      "<li>Corso online con attestato</li>" +
      "<li>Ebook didattico</li>" +
      "<li>16 ore di formazione in presenza</li>" +
      "<li>Materiali, esercitazioni e assistenza</li>" +
      "<li>Utilizzo della sala incluso</li>" +
      "</ul>" +
      "<h3>Investimento complessivo</h3>" +
      "<p><strong>Corso di Preparazione OAM — Catania — € 299</strong> a partecipante.</p>" +
      "<p><strong>Posti limitati:</strong> minimo 10 e massimo 15 partecipanti.</p>",
    images: img("corso-oam-catania", "Corso di preparazione OAM a Catania"),
    status: "published",
    seo: {
      title: "Corso di Preparazione OAM a Catania — 16 ore in presenza",
      description:
        "Preparazione all'esame OAM a Catania: 16 ore in presenza su quattro sabati di novembre 2026, corso online con attestato, ebook ed esercitazioni. Posti limitati.",
    },
  },
  {
    slug: "corso-oam-reggio-calabria",
    name: "Corso di Preparazione OAM — Reggio Calabria",
    category: CATEGORY,
    type: "consulenza",
    priceCents: 29900,
    externalUrl: "",
    shortDescription:
      "Preparazione all'esame OAM a Reggio Calabria: 16 ore di lezioni in presenza, due lezioni in FAD asincrona incluse, corso online con attestato ed esercitazioni sui quesiti ufficiali.",
    description:
      "<p>Corso di preparazione alla prova valutativa OAM con lezioni <strong>in presenza a Reggio Calabria</strong>, per chi desidera diventare agente, mediatore o collaboratore nei servizi di pagamento e nel credito.</p>" +
      "<p>Formazione di qualità, esercitazioni e simulazioni, con supporto e assistenza fino alla prova.</p>" +
      "<h3>Il corso include</h3>" +
      "<ul>" +
      "<li>Corso online con attestato</li>" +
      "<li>16 ore di lezioni in presenza con docente esperta</li>" +
      "<li>Materiali didattici e dispense</li>" +
      "<li>Esercitazioni e simulazioni sui quesiti ufficiali</li>" +
      "<li>Correzione commentata degli errori</li>" +
      "<li>Gruppo WhatsApp dedicato</li>" +
      "<li>Incontro finale di ripasso online</li>" +
      "</ul>" +
      "<h3>Programma del corso</h3>" +
      "<ul>" +
      "<li><strong>1. Sistema finanziario e OAM</strong> — soggetti, autorità, agenti, mediatori e collaboratori.</li>" +
      "<li><strong>2. Prodotti e servizi</strong> — prestiti, mutui, credito ai consumatori, cessione del quinto, pagamento e moneta elettronica.</li>" +
      "<li><strong>3. Normativa</strong> — trasparenza, antiriciclaggio, privacy, reclami e responsabilità.</li>" +
      "<li><strong>4. Preparazione alla prova</strong> — quiz, simulazioni, correzione degli errori e strategia d'esame.</li>" +
      "</ul>" +
      "<h3>Lezioni in presenza a Reggio Calabria</h3>" +
      "<p><strong>24 e 25 ottobre 2026</strong>, orario 9:00 – 17:00 (8 ore al giorno).</p>" +
      "<p>La sede dettagliata sarà comunicata agli iscritti.</p>" +
      "<h4>2 lezioni in FAD</h4>" +
      "<p>Due lezioni online in modalità FAD asincrona, incluse nel corso.</p>" +
      "<h3>Cosa include il corso</h3>" +
      "<ul>" +
      "<li>Lezioni online e in presenza</li>" +
      "<li>Materiali didattici e slide</li>" +
      "<li>Guide pratiche e case study</li>" +
      "<li>Sessioni di Q&amp;A e supporto docente</li>" +
      "<li>Attestato di partecipazione</li>" +
      "</ul>" +
      "<h3>Investimento complessivo</h3>" +
      "<p><strong>Corso di Preparazione OAM — Reggio Calabria — € 299</strong> a partecipante.</p>" +
      "<p><strong>Posti limitati.</strong></p>",
    images: img("corso-oam-reggio-calabria", "Corso di preparazione OAM a Reggio Calabria"),
    status: "published",
    seo: {
      title: "Corso di Preparazione OAM a Reggio Calabria — 16 ore in presenza",
      description:
        "Preparazione all'esame OAM a Reggio Calabria: 16 ore in presenza il 24 e 25 ottobre 2026, due lezioni in FAD incluse, corso online con attestato ed esercitazioni.",
    },
  },
  {
    slug: "corso-abilitazione-oam-ivass",
    name: "Corso di Abilitazione OAM e IVASS",
    category: CATEGORY,
    type: "consulenza",
    priceCents: 59900,
    externalUrl: "",
    shortDescription:
      "Un unico percorso con doppia conformità: abilitazione OAM per agenti e mediatori creditizi e formazione iniziale IVASS per intermediari assicurativi, con attestato.",
    description:
      "<p>Corso di abilitazione rivolto ad <strong>agenti e mediatori creditizi (OAM)</strong> e a <strong>intermediari assicurativi (IVASS)</strong>: un unico percorso, doppia conformità.</p>" +
      "<p>Il corso rilascia attestato ed è conforme ai regolamenti vigenti.</p>" +
      "<h3>Area OAM — Credito</h3>" +
      "<p>Abilitazione OAM. Materie trattate:</p>" +
      "<ul>" +
      "<li>Trasparenza bancaria</li>" +
      "<li>Antiriciclaggio</li>" +
      "<li>Tecnica bancaria</li>" +
      "<li>Valutazione del merito creditizio</li>" +
      "<li>Credito al consumo</li>" +
      "</ul>" +
      "<h3>Area IVASS — Assicurazioni</h3>" +
      "<p>Formazione iniziale IVASS. Materie trattate:</p>" +
      "<ul>" +
      "<li>Normativa e regolamenti IVASS</li>" +
      "<li>Prodotti danni</li>" +
      "<li>Prodotti vita</li>" +
      "<li>Etica e deontologia professionale</li>" +
      "<li>Tutela del consumatore</li>" +
      "</ul>" +
      "<h3>Vantaggi</h3>" +
      "<ul>" +
      "<li>Lezioni in presenza e in FAD</li>" +
      "<li>Docente: Lucrezia Valentino</li>" +
      "<li>Ebook per approfondire</li>" +
      "<li>Materiale didattico aggiornato</li>" +
      "</ul>" +
      "<h3>Costo del corso</h3>" +
      "<p><strong>Corso di Abilitazione OAM e IVASS — € 599</strong></p>",
    images: img("corso-abilitazione-oam-ivass", "Corso di abilitazione OAM e IVASS"),
    status: "published",
    seo: {
      title: "Corso di Abilitazione OAM e IVASS — Unico percorso, doppia conformità",
      description:
        "Abilitazione OAM per agenti e mediatori creditizi e formazione iniziale IVASS per intermediari assicurativi in un unico corso con attestato.",
    },
  },
];

const now = new Date().toISOString();

for (const corso of CORSI) {
  const existing = await db.collection("servizi").where("slug", "==", corso.slug).limit(1).get();
  if (existing.empty) {
    const ref = db.collection("servizi").doc();
    await ref.set({ ...corso, id: ref.id, createdAt: now, updatedAt: now });
    console.log(`created  ${corso.slug}  € ${(corso.priceCents / 100).toFixed(2)}`);
  } else {
    const ref = existing.docs[0].ref;
    await ref.update({ ...corso, updatedAt: now });
    console.log(`updated  ${corso.slug}  € ${(corso.priceCents / 100).toFixed(2)}`);
  }
}

console.log(`\n${CORSI.length} corsi seeded under category "${CATEGORY}".`);
process.exit(0);
