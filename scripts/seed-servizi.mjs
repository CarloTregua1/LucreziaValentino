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
    priceCents: 7500,
    externalUrl: "",
    shortDescription:
      "Un servizio dedicato a chi desidera affrontare con maggiore consapevolezza le proprie scelte di finanziamento: mutui, prestiti personali, cessione del quinto, delega di pagamento e consolidamento debiti.",
    description:
      "<p>La consulenza creditizia è un servizio dedicato a chi desidera affrontare con maggiore consapevolezza le proprie scelte finanziarie e comprendere quale soluzione di finanziamento sia maggiormente coerente con le proprie esigenze.</p>" +
      "<p>Attraverso un'analisi personalizzata della situazione economica e degli obiettivi del cliente, il servizio offre un supporto qualificato nella comprensione delle principali forme di credito, favorendo decisioni informate, sostenibili e orientate al benessere finanziario.</p>" +
      "<p>La consulenza può riguardare mutui, prestiti personali, cessione del quinto e consolidamento debiti, con particolare attenzione alla sostenibilità dell'impegno economico e alla pianificazione delle proprie risorse nel tempo.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Un'analisi preliminare della situazione economica e finanziaria del cliente, finalizzata a individuare le soluzioni maggiormente coerenti con le esigenze, gli obiettivi e la capacità di rimborso.</p>" +
      "<ul><li>Analisi delle esigenze e degli obiettivi finanziari</li><li>Valutazione della sostenibilità dell'impegno economico</li><li>Analisi della situazione reddituale e finanziaria</li><li>Esame delle principali caratteristiche delle diverse forme di finanziamento</li><li>Confronto tra le possibili soluzioni di credito</li><li>Supporto nella comprensione di costi, condizioni e durata dell'operazione</li><li>Indicazioni sulla documentazione generalmente richiesta nelle fasi preliminari di valutazione</li><li>Individuazione delle soluzioni maggiormente coerenti con il profilo e gli obiettivi del cliente</li><li>Orientamento finalizzato a una scelta consapevole e responsabile</li></ul>" +
      "<h3>Ambiti di consulenza</h3>" +
      "<ul><li><strong>Mutui</strong> — valutazione delle principali soluzioni per l'acquisto dell'abitazione, la surroga o la rinegoziazione del mutuo, con attenzione alla sostenibilità della rata e alla pianificazione finanziaria.</li><li><strong>Prestiti personali</strong> — analisi delle caratteristiche del finanziamento, dei costi e della compatibilità dell'impegno economico rispetto alla situazione del cliente.</li><li><strong>Cessione del quinto</strong> — valutazione delle opportunità dedicate a lavoratori dipendenti e pensionati, con approfondimento delle caratteristiche e delle condizioni previste dalla normativa.</li><li><strong>Delega di pagamento</strong> — analisi di questo strumento riservato ai lavoratori dipendenti, valutandone sostenibilità, condizioni e compatibilità con eventuali altri impegni finanziari in corso.</li><li><strong>Consolidamento debiti</strong> — analisi delle possibili soluzioni per la gestione e la riorganizzazione degli impegni finanziari esistenti, finalizzate a una maggiore sostenibilità economica.</li></ul>" +
      "<h3>Servizi complementari</h3>" +
      "<h4>Informazioni Creditizie e Banche Dati</h4>" +
      "<p>Supporto orientativo nella lettura delle informazioni presenti nelle principali banche dati creditizie e nella comprensione delle procedure previste dalla normativa per l'aggiornamento, la rettifica o la cancellazione di dati inesatti o non correttamente trattati.</p>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>La consulenza ha finalità informative, orientative e di supporto all'analisi delle esigenze finanziarie del cliente. L'eventuale concessione del credito resta subordinata alle valutazioni effettuate dagli istituti di credito o dagli intermediari finanziari competenti, nel rispetto della normativa vigente.</p>" +
      "<p>Iscritta OAM — Organismo Agenti e Mediatori. Numero di iscrizione OAM: M594.</p>" +
      "<h3>La consulenza include</h3>" +
      "<p><strong>Consulenza Creditizia Personalizzata — € 75</strong></p>" +
      "<ul><li>Incontro individuale online</li><li>Analisi preliminare della situazione economica e finanziaria</li><li>Orientamento sulle principali soluzioni di credito</li><li>Supporto nella comprensione di costi, condizioni e sostenibilità</li><li>Durata indicativa: fino a 60 minuti</li></ul>" +
      "<p>Per richieste che richiedono approfondimenti documentali o analisi particolarmente complesse è possibile concordare percorsi di consulenza personalizzati.</p>",
    images: img("consulenza-creditizia", "Consulenza creditizia"),
    status: "published",
    seo: {
      title: "Consulenza Creditizia — Mutui, prestiti e consolidamento",
      description:
        "Consulenza sul credito: mutui, prestiti personali, cessione del quinto, delega di pagamento e consolidamento debiti, per scelte consapevoli e sostenibili.",
    },
  },
  {
    slug: "caf-patronato",
    name: "Orientamento e Supporto Previdenziale, Assistenziale e Fiscale",
    category: "CAF & Patronato",
    type: "consulenza",
    priceCents: 3900,
    externalUrl: "",
    shortDescription:
      "Servizio di orientamento e consulenza informativa su diritti, prestazioni, agevolazioni e adempimenti in ambito fiscale, previdenziale e assistenziale.",
    description:
      "<p>Servizio di orientamento e consulenza informativa dedicato a cittadini, lavoratori, pensionati e famiglie che desiderano comprendere con maggiore chiarezza diritti, prestazioni, agevolazioni e adempimenti in ambito fiscale, previdenziale e assistenziale.</p>" +
      "<p>Attraverso un approccio personalizzato, il servizio offre supporto nella lettura della normativa, nella comprensione delle procedure e nell'individuazione delle soluzioni maggiormente coerenti con le esigenze del cliente.</p>" +
      "<p>L'obiettivo è fornire informazioni chiare e strumenti utili per affrontare con maggiore consapevolezza pratiche e prestazioni di competenza degli enti pubblici e previdenziali.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Un'analisi preliminare della situazione personale, familiare e previdenziale del cliente, finalizzata a individuare le prestazioni, le agevolazioni e gli adempimenti maggiormente pertinenti al caso specifico.</p>" +
      "<ul><li>Orientamento su ISEE ordinario e ISEE specifici</li><li>Informazioni sulle principali prestazioni INPS e assistenziali</li><li>Supporto nella comprensione di pensioni e posizione contributiva</li><li>Orientamento su NASpI, ADI, Supporto per la Formazione e il Lavoro (SFL) e altre misure di sostegno</li><li>Informazioni su Assegno Unico e prestazioni rivolte alle famiglie</li><li>Orientamento su invalidità civile, agevolazioni e benefici previsti dalla normativa</li><li>Supporto nella comprensione della documentazione generalmente richiesta per le principali pratiche</li><li>Indicazioni operative personalizzate in base alle esigenze rappresentate</li></ul>" +
      "<h3>Ambiti di intervento</h3>" +
      "<ul><li><strong>ISEE e prestazioni collegate</strong> — orientamento sulla documentazione necessaria, sulle diverse tipologie di ISEE e sulle principali prestazioni collegate all'indicatore della situazione economica equivalente.</li><li><strong>Pensioni e contributi</strong> — supporto informativo sulla posizione contributiva, sulle principali prestazioni pensionistiche e sulle opportunità previste dalla normativa previdenziale.</li><li><strong>Prestazioni INPS</strong> — orientamento sulle principali prestazioni economiche, previdenziali e assistenziali erogate dall'INPS.</li><li><strong>Assegno Unico e prestazioni per la famiglia</strong> — informazioni su requisiti, modalità di accesso e adempimenti connessi alle misure di sostegno rivolte ai nuclei familiari.</li><li><strong>Disoccupazione e misure di sostegno al reddito</strong> — orientamento su NASpI, ADI, SFL e altre misure previste dalla normativa vigente.</li><li><strong>Invalidità civile e prestazioni assistenziali</strong> — supporto informativo su benefici, agevolazioni e principali procedure previste per il riconoscimento delle prestazioni assistenziali.</li></ul>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>L'attività svolta ha finalità esclusivamente informative, orientative e di supporto alla comprensione delle procedure e della normativa di riferimento. L'eventuale presentazione delle pratiche agli enti competenti resta subordinata alle modalità previste dalla normativa vigente e alle competenze dei soggetti autorizzati.</p>" +
      "<h3>La consulenza include</h3>" +
      "<p><strong>Consulenza Previdenziale e Assistenziale Personalizzata — € 39</strong></p>" +
      "<ul><li>Analisi preliminare della situazione personale e familiare</li><li>Orientamento su ISEE, pensioni e prestazioni INPS</li><li>Supporto informativo su NASpI, ADI, SFL e Assegno Unico</li><li>Indicazioni sulla documentazione necessaria</li><li>Consulenza individuale online</li><li>Durata indicativa: fino a 45 minuti</li></ul>" +
      "<p>Servizio di orientamento e consulenza informativa finalizzato a supportare il cliente nella comprensione di prestazioni, agevolazioni e procedure previdenziali, assistenziali e fiscali.</p>",
    images: img("caf-patronato", "Orientamento previdenziale e assistenziale"),
    status: "published",
    seo: {
      title: "CAF & Patronato — ISEE, pensioni, INPS e prestazioni",
      description:
        "Orientamento e consulenza informativa su ISEE, pensioni, prestazioni INPS, NASpI, ADI, SFL, Assegno Unico e invalidità civile.",
    },
  },
  {
    slug: "formazione-professionale",
    name: "Progettazione e Formazione Professionale",
    category: "Formazione",
    type: "consulenza",
    priceCents: 12000,
    externalUrl: "",
    shortDescription:
      "Percorsi formativi su misura per enti, aziende, professionisti e privati, per lo sviluppo di competenze tecniche, amministrative, finanziarie e trasversali.",
    description:
      "<p>Percorsi formativi rivolti a enti, aziende, professionisti e privati, finalizzati allo sviluppo di competenze tecniche, amministrative, finanziarie e trasversali richieste dal mercato del lavoro.</p>" +
      "<p>Ogni percorso viene sviluppato sulla base degli obiettivi formativi, delle esigenze del committente e delle caratteristiche dei partecipanti, attraverso metodologie pratiche e orientate all'applicazione concreta delle competenze.</p>" +
      "<p>L'utilizzo di esercitazioni, simulazioni, casi studio e strumenti operativi favorisce un apprendimento efficace e immediatamente spendibile nel contesto professionale.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>La formazione viene progettata in funzione degli obiettivi da raggiungere e delle competenze da sviluppare, con particolare attenzione alla qualità dei contenuti e all'efficacia dell'apprendimento.</p>" +
      "<ul><li>Analisi dei fabbisogni formativi</li><li>Progettazione di percorsi personalizzati</li><li>Predisposizione di materiali didattici e operativi</li><li>Attività formative teoriche e pratiche</li><li>Simulazioni, esercitazioni e casi studio</li><li>Supporto durante il percorso formativo</li><li>Verifica e valutazione delle competenze acquisite</li><li>Orientamento allo sviluppo professionale</li><li>Attività individuali o di gruppo</li><li>Formazione online o in presenza</li></ul>" +
      "<h3>Aree formative</h3>" +
      "<ul><li><strong>CAF e Patronato</strong> — percorsi dedicati ai principali adempimenti fiscali, previdenziali e assistenziali, con simulazioni operative, casi pratici e strumenti professionali.</li><li><strong>Segreteria amministrativa e office management</strong> — competenze organizzative, documentali e gestionali per attività di segreteria, front office, back office e supporto amministrativo.</li><li><strong>Amministrazione del personale</strong> — elementi di amministrazione del personale, gestione documentale del rapporto di lavoro e principali procedure amministrative.</li><li><strong>Educazione finanziaria</strong> — gestione consapevole delle risorse economiche, risparmio, credito, pianificazione finanziaria e cultura finanziaria.</li><li><strong>Preparazione esami OAM, OCF e IVASS</strong> — preparazione agli esami abilitanti del settore creditizio, finanziario e assicurativo, con approfondimenti normativi, esercitazioni, simulazioni d'esame e supporto allo studio.</li><li><strong>Programma GOL e politiche attive del lavoro</strong> — percorsi formativi e di orientamento per persone in cerca di occupazione, in aggiornamento o riqualificazione e beneficiari delle misure GOL.</li><li><strong>Orientamento professionale e soft skills</strong> — competenze trasversali, orientamento al lavoro, comunicazione efficace, organizzazione personale, problem solving e crescita professionale.</li><li><strong>Innovazione digitale e intelligenza artificiale</strong> — utilizzo consapevole degli strumenti digitali e delle tecnologie innovative a supporto delle attività professionali, formative e organizzative.</li></ul>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>Esperienza nella progettazione e nell'erogazione di percorsi formativi rivolti a enti, aziende, professionisti e privati. Docente nei percorsi del Programma GOL e iscritta al Registro dei Formatori Professionisti AIF.</p>" +
      "<p>Le attività formative possono essere erogate in modalità individuale o di gruppo, online o in presenza, in funzione degli obiettivi formativi e delle esigenze organizzative del committente.</p>" +
      "<h3>Investimento</h3>" +
      "<p><strong>Progettazione e formazione professionale personalizzata — a partire da € 120</strong></p>" +
      "<ul><li>Analisi del fabbisogno formativo</li><li>Progettazione didattica</li><li>Materiali formativi dedicati</li><li>Attività formative online o in presenza</li><li>Supporto personalizzato</li><li>Percorsi individuali o di gruppo</li></ul>" +
      "<p>Le attività formative vengono definite sulla base degli obiettivi, del numero di partecipanti, della durata del percorso e delle modalità di erogazione previste. Contattami per ricevere una proposta formativa personalizzata.</p>",
    images: img("formazione-professionale", "Progettazione e formazione professionale"),
    status: "published",
    seo: {
      title: "Progettazione e Formazione Professionale — Corsi su misura",
      description:
        "Percorsi formativi su misura per enti, aziende, professionisti e privati: CAF, amministrazione, educazione finanziaria, esami OAM/OCF/IVASS, GOL e soft skills.",
    },
  },
  {
    slug: "orientamento-professionale",
    name: "Orientamento Professionale e Sviluppo delle Competenze",
    category: "Orientamento",
    type: "consulenza",
    priceCents: 7000,
    externalUrl: "",
    shortDescription:
      "Orientamento professionale certificato ASNOR: analisi delle competenze, definizione degli obiettivi e costruzione di un piano d'azione personalizzato.",
    description:
      "<p>Servizio di orientamento professionale rivolto a studenti, lavoratori, professionisti e persone che desiderano valorizzare le proprie competenze, affrontare una transizione professionale o definire con maggiore chiarezza il proprio percorso formativo e lavorativo.</p>" +
      "<p>Attraverso un percorso personalizzato è possibile individuare punti di forza, competenze, interessi e obiettivi professionali, costruendo un piano d'azione concreto e coerente con le proprie aspirazioni.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Come orientatrice professionale certificata ASNOR, supporto persone e professionisti nell'analisi delle competenze, nella definizione degli obiettivi e nella costruzione di percorsi di crescita personale e professionale.</p>" +
      "<ul><li>Analisi delle competenze, delle attitudini e delle esperienze maturate</li><li>Valutazione delle soft skills e delle competenze professionali</li><li>Definizione degli obiettivi formativi e lavorativi</li><li>Costruzione di un percorso personalizzato di sviluppo professionale</li><li>Supporto nella ricerca attiva del lavoro</li><li>Revisione e ottimizzazione del curriculum vitae</li><li>Preparazione ai colloqui di selezione</li><li>Orientamento alla formazione e alla riqualificazione professionale</li><li>Supporto nelle fasi di cambiamento o transizione lavorativa</li></ul>" +
      "<h3>Aree di intervento</h3>" +
      "<ul><li><strong>Orientamento scolastico e universitario</strong> — supporto nella scelta dei percorsi di studio e delle opportunità formative più coerenti con interessi, attitudini e obiettivi.</li><li><strong>Inserimento e reinserimento lavorativo</strong> — orientamento per chi desidera entrare nel mondo del lavoro o reinserirsi dopo un periodo di inattività.</li><li><strong>Crescita e sviluppo professionale</strong> — valorizzazione delle competenze e definizione di strategie di crescita professionale.</li><li><strong>Curriculum vitae e personal branding</strong> — supporto nella costruzione o revisione del CV e nel miglioramento della propria presentazione professionale.</li><li><strong>Riqualificazione professionale e Programma GOL</strong> — orientamento per chi desidera aggiornare le proprie competenze o intraprendere nuove opportunità professionali.</li><li><strong>Soft skills e occupabilità</strong> — competenze trasversali richieste dal mercato del lavoro: comunicazione, organizzazione, problem solving e lavoro in team.</li></ul>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>Iscritta al Registro degli Orientatori Professionali ASNOR. Esperienza nell'orientamento, nella formazione e nello sviluppo delle competenze professionali all'interno di percorsi individuali e progetti finanziati.</p>" +
      "<p>Le attività possono essere svolte online o in presenza, in funzione delle esigenze della persona e degli obiettivi definiti.</p>" +
      "<h3>Le soluzioni disponibili</h3>" +
      "<p><strong>Consulenza Orientativa — € 50</strong></p>" +
      "<ul><li>Incontro individuale online</li><li>Analisi preliminare delle competenze e delle esperienze</li><li>Definizione degli obiettivi professionali</li><li>Indicazioni operative personalizzate</li><li>Durata indicativa: fino a 30 minuti</li></ul>" +
      "<p><strong>Consulenza Professionale Completa — € 70</strong></p>" +
      "<ul><li>Incontro individuale online</li><li>Analisi approfondita delle competenze, delle attitudini e delle esperienze maturate</li><li>Definizione degli obiettivi professionali e formativi</li><li>Piano d'azione personalizzato</li><li>Orientamento alla formazione, alla riqualificazione professionale e alle opportunità lavorative</li><li>Indicazioni operative e supporto decisionale</li><li>Durata indicativa: fino a 60 minuti</li></ul>" +
      "<p>Scegli la soluzione più adatta alle tue esigenze e costruisci un percorso coerente con le tue competenze, i tuoi obiettivi e le opportunità offerte dal mercato del lavoro.</p>",
    images: img("orientamento-professionale", "Orientamento professionale e sviluppo delle competenze"),
    status: "published",
    seo: {
      title: "Orientamento Professionale — Certificata ASNOR",
      description:
        "Orientamento professionale certificato ASNOR: analisi delle competenze, obiettivi, CV, colloqui e piano d'azione per la crescita professionale.",
    },
  },
  {
    slug: "ai-innovazione",
    name: "Intelligenza Artificiale e Innovazione Digitale",
    category: "Innovazione",
    type: "consulenza",
    priceCents: 9000,
    externalUrl: "",
    shortDescription:
      "Formazione e consulenza sull'utilizzo consapevole dell'intelligenza artificiale e degli strumenti digitali per migliorare studio, lavoro, organizzazione e produttività.",
    description:
      "<p>Percorsi di formazione e consulenza dedicati all'utilizzo consapevole dell'intelligenza artificiale e degli strumenti digitali per migliorare studio, lavoro, organizzazione e produttività.</p>" +
      "<p>L'obiettivo è trasformare le tecnologie emergenti in strumenti concreti e facilmente applicabili nella vita professionale, formativa e imprenditoriale.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Attraverso un approccio pratico e orientato ai risultati, supporto professionisti, studenti, aziende ed enti nell'utilizzo efficace degli strumenti di intelligenza artificiale e innovazione digitale.</p>" +
      "<ul><li>Introduzione all'intelligenza artificiale e ai principali strumenti disponibili</li><li>Utilizzo di ChatGPT e strumenti AI per attività professionali e formative</li><li>Tecniche di prompt engineering e utilizzo avanzato dell'AI</li><li>Digital transformation e ottimizzazione dei processi</li><li>Automazione e produttività personale</li><li>AI per la formazione, l'educazione e la progettazione didattica</li><li>AI per la creazione di contenuti professionali e comunicazione digitale</li><li>Utilizzo dell'AI nei processi organizzativi e decisionali</li><li>Supporto all'adozione di strumenti innovativi in ambito professionale</li></ul>" +
      "<h3>Aree di intervento</h3>" +
      "<ul><li><strong>ChatGPT e strumenti di intelligenza artificiale</strong> — utilizzo pratico dei principali strumenti AI per studio, lavoro e attività professionali.</li><li><strong>Produttività e automazione</strong> — soluzioni digitali per ottimizzare attività, processi e gestione del tempo.</li><li><strong>Formazione e didattica digitale</strong> — applicazione dell'AI nella progettazione formativa e nella creazione di materiali didattici.</li><li><strong>Creazione di contenuti</strong> — utilizzo dell'AI per articoli, presentazioni, social media, ebook e materiali professionali.</li><li><strong>Innovazione per professionisti e imprese</strong> — strategie e strumenti per integrare l'AI nei processi lavorativi e organizzativi.</li></ul>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>Attività di formazione e consulenza finalizzate alla comprensione e all'utilizzo consapevole delle tecnologie emergenti e degli strumenti di intelligenza artificiale. I percorsi possono essere sviluppati in modalità individuale o di gruppo, online o in presenza, in funzione delle esigenze del cliente.</p>" +
      "<h3>La consulenza include</h3>" +
      "<p><strong>Consulenza individuale personalizzata — € 90</strong></p>" +
      "<ul><li>Incontro individuale online</li><li>Analisi delle esigenze e degli obiettivi</li><li>Supporto operativo personalizzato</li><li>Indicazioni pratiche e strumenti immediatamente applicabili</li><li>Durata indicativa: fino a 60 minuti</li></ul>",
    images: img("ai-innovazione", "Intelligenza artificiale e innovazione digitale"),
    status: "published",
    seo: {
      title: "Intelligenza Artificiale e Innovazione Digitale",
      description:
        "Formazione e consulenza su ChatGPT, intelligenza artificiale e strumenti digitali per produttività, automazione, didattica e creazione di contenuti.",
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
      "Orientamento, formazione ed educazione finanziaria per chi desidera avviare un'attività o approfondire le opportunità del microcredito e dell'autoimpiego.",
    description:
      "<p>Servizio di orientamento, formazione ed educazione finanziaria rivolto a persone che desiderano avviare un'attività, sviluppare un progetto imprenditoriale o approfondire le opportunità offerte dal microcredito e dalle misure di sostegno all'autoimpiego.</p>" +
      "<p>Attraverso un approccio pratico e personalizzato è possibile acquisire una maggiore consapevolezza delle opportunità disponibili, valutare la sostenibilità della propria idea e definire un percorso coerente con i propri obiettivi professionali e imprenditoriali.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Supporto aspiranti imprenditori, lavoratori autonomi e persone che desiderano avviare un'attività nella comprensione delle opportunità offerte dal microcredito e dalle misure di autoimpiego, favorendo scelte consapevoli e sostenibili.</p>" +
      "<ul><li>Informazioni sul microcredito e sulle principali misure di sostegno all'autoimpiego</li><li>Analisi preliminare dell'idea progettuale</li><li>Orientamento alle opportunità di finanziamento disponibili</li><li>Educazione finanziaria per l'avvio e la gestione dell'attività</li><li>Supporto nella definizione degli obiettivi imprenditoriali</li><li>Indicazioni sui percorsi di accompagnamento e tutoraggio</li><li>Approfondimento delle opportunità offerte dall'Ente Nazionale per il Microcredito e da altri strumenti di sostegno</li><li>Supporto nella pianificazione delle attività e nella definizione delle priorità operative</li></ul>" +
      "<h3>Aree di intervento</h3>" +
      "<ul><li><strong>Microcredito</strong> — caratteristiche, finalità e opportunità offerte dagli strumenti di microfinanza destinati a persone e microimprese.</li><li><strong>Autoimpiego e autoimprenditorialità</strong> — orientamento per l'avvio di attività professionali, artigianali, commerciali e di servizi.</li><li><strong>Educazione finanziaria per l'impresa</strong> — gestione consapevole delle risorse economiche e sviluppo di competenze utili alla sostenibilità dell'attività.</li><li><strong>Sviluppo del progetto</strong> — analisi preliminare dell'idea imprenditoriale e definizione degli obiettivi di crescita.</li><li><strong>Opportunità e incentivi</strong> — informazioni e orientamento sulle principali misure di sostegno disponibili per l'avvio e lo sviluppo delle attività economiche.</li></ul>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>Docente qualificata e accreditata ENM nell'ambito dei percorsi dedicati al microcredito e all'autoimpiego. Esperta in educazione finanziaria, orientamento e formazione professionale, con esperienza nell'accompagnamento allo sviluppo di iniziative imprenditoriali e professionali.</p>" +
      "<p>Le attività possono essere svolte online o in presenza, in funzione delle esigenze della persona e degli obiettivi definiti.</p>" +
      "<h3>La consulenza include</h3>" +
      "<p><strong>Consulenza orientativa su Microcredito e Autoimpiego — € 80</strong></p>" +
      "<ul><li>Incontro individuale personalizzato</li><li>Analisi preliminare del progetto</li><li>Orientamento alle opportunità disponibili</li><li>Indicazioni operative personalizzate</li><li>Supporto nella definizione degli obiettivi</li><li>Durata indicativa: fino a 60 minuti</li></ul>",
    images: img("microcredito", "Microcredito e autoimpiego"),
    status: "published",
    seo: {
      title: "Microcredito e Autoimpiego — Orientamento e formazione",
      description:
        "Orientamento, formazione ed educazione finanziaria sul microcredito e sull'autoimpiego per trasformare un'idea in un progetto sostenibile.",
    },
  },
  {
    slug: "sicurezza-lavoro",
    name: "Formazione sulla Salute e Sicurezza nei Luoghi di Lavoro",
    category: "Sicurezza",
    type: "consulenza",
    priceCents: 9000,
    externalUrl: "",
    shortDescription:
      "Percorsi formativi sulla salute e sicurezza nei luoghi di lavoro per lavoratori, preposti, dirigenti, aziende ed enti, nel rispetto della normativa vigente.",
    description:
      "<p>Percorsi formativi dedicati alla salute e sicurezza nei luoghi di lavoro, finalizzati alla diffusione della cultura della prevenzione, alla tutela delle persone e alla promozione di comportamenti responsabili e consapevoli.</p>" +
      "<p>Le attività formative sono rivolte a lavoratori, aziende, enti e organizzazioni e vengono sviluppate nel rispetto della normativa vigente, con un approccio pratico e orientato all'applicazione concreta delle conoscenze.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>La sicurezza non rappresenta soltanto un obbligo normativo, ma un valore fondamentale per la tutela delle persone e per la crescita sostenibile delle organizzazioni. I percorsi formativi vengono progettati per favorire la comprensione dei rischi, delle misure di prevenzione e delle corrette procedure operative, attraverso esempi pratici, casi reali e metodologie didattiche coinvolgenti.</p>" +
      "<ul><li>Formazione generale e specifica dei lavoratori</li><li>Percorsi formativi per preposti e dirigenti</li><li>Aggiornamenti in materia di salute e sicurezza sul lavoro</li><li>Approfondimenti sulla normativa vigente</li><li>Sensibilizzazione alla cultura della prevenzione</li><li>Utilizzo di casi pratici ed esercitazioni</li><li>Materiali didattici e strumenti di supporto all'apprendimento</li><li>Formazione in presenza e a distanza</li></ul>" +
      "<h3>Aree di intervento</h3>" +
      "<ul><li><strong>Formazione dei lavoratori</strong> — conoscenza dei rischi presenti nei luoghi di lavoro e delle misure di prevenzione e protezione.</li><li><strong>Formazione per preposti e dirigenti</strong> — responsabilità, obblighi e competenze richieste dalle diverse figure aziendali.</li><li><strong>Cultura della sicurezza</strong> — promozione di comportamenti responsabili e consapevoli per la prevenzione degli infortuni e la tutela della salute.</li><li><strong>Aggiornamento professionale</strong> — approfondimenti e aggiornamenti sulle principali disposizioni normative in materia di sicurezza sul lavoro.</li><li><strong>Formazione per aziende ed enti</strong> — percorsi personalizzati progettati in funzione delle caratteristiche organizzative e delle esigenze formative del committente.</li></ul>" +
      "<h3>Trasparenza professionale</h3>" +
      "<p>Formatrice qualificata nell'ambito della salute e sicurezza nei luoghi di lavoro. Esperienza nella formazione professionale, nella progettazione didattica e nello sviluppo delle competenze rivolte a persone, aziende ed enti di formazione.</p>" +
      "<p>Le attività formative possono essere erogate in modalità individuale o di gruppo, online o in presenza, in funzione degli obiettivi didattici e delle esigenze organizzative del committente.</p>" +
      "<h3>Investimento</h3>" +
      "<p><strong>Consulenza e formazione personalizzata — € 90</strong></p>" +
      "<ul><li>Analisi delle esigenze formative</li><li>Individuazione del percorso più adatto</li><li>Supporto personalizzato</li><li>Attività individuale o di gruppo</li><li>Durata variabile in funzione delle esigenze del cliente</li></ul>",
    images: img("sicurezza-lavoro", "Formazione sulla salute e sicurezza nei luoghi di lavoro"),
    status: "published",
    seo: {
      title: "Formazione Salute e Sicurezza sul Lavoro",
      description:
        "Percorsi formativi su salute e sicurezza nei luoghi di lavoro per lavoratori, preposti, dirigenti e aziende, nel rispetto della normativa vigente.",
    },
  },
  {
    slug: "ebook-professionali",
    name: "Ebook Professionali — Collana Orizzonti Finanziari",
    category: "Ebook",
    type: "digitale",
    priceCents: 1990,
    externalUrl: "https://scrimmedizioni.com/product-detail?productidn=4416562",
    shortDescription:
      "La collana «Orizzonti Finanziari»: guide professionali ed ebook dedicati all'educazione finanziaria, alla crescita professionale e alla preparazione agli esami OCF, OAM e IVASS.",
    description:
      "<p>La collana Orizzonti Finanziari raccoglie guide professionali ed ebook dedicati all'educazione finanziaria, alla crescita professionale e alla preparazione agli esami OCF, OAM e IVASS.</p>" +
      "<p>Contenuti progettati per offrire conoscenze chiare, aggiornate e immediatamente applicabili nello studio, nella formazione e nell'attività professionale.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Una collana editoriale che unisce rigore tecnico, esperienza formativa e applicazione pratica, offrendo contenuti chiari, aggiornati e immediatamente utilizzabili nello studio e nell'attività professionale.</p>" +
      "<h4>Tematiche disponibili</h4>" +
      "<ul><li>Educazione finanziaria e gestione consapevole del denaro</li><li>Risparmio, investimenti e pianificazione finanziaria</li><li>Sovraindebitamento e sostenibilità economica personale</li><li>Preparazione all'esame OCF — Consulente Finanziario Abilitato all'Offerta Fuori Sede</li><li>Preparazione all'esame OAM — Agenti in Attività Finanziaria e Mediatori Creditizi</li><li>Preparazione all'esame IVASS — Intermediari Assicurativi</li><li>Guide operative e materiali di approfondimento professionale</li></ul>" +
      "<h4>Caratteristiche degli ebook</h4>" +
      "<ul><li>Linguaggio professionale ma comprensibile</li><li>Contenuti aggiornati e strutturati</li><li>Approccio pratico con esempi, approfondimenti ed esercitazioni</li><li>Strumenti utili per lo studio, l'aggiornamento professionale e la preparazione agli esami</li><li>Accesso immediato in formato digitale</li><li>Materiali consultabili in qualsiasi momento</li></ul>" +
      "<h4>A chi sono rivolti</h4>" +
      "<p>Studenti, professionisti, consulenti, operatori del settore finanziario, creditizio e assicurativo e persone interessate ad accrescere le proprie competenze economiche e finanziarie.</p>" +
      "<p>L'acquisto e il download degli ebook sono gestiti tramite piattaforma esterna dedicata. La collana è in continua evoluzione: nuovi titoli e aggiornamenti vengono pubblicati periodicamente per offrire contenuti sempre attuali e in linea con l'evoluzione normativa e professionale dei settori di riferimento.</p>",
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
    externalUrl:
      "https://www.lezione-online.it/corso/corso-base-di-educazione-finanziaria-gestisci-in-modo-consapevole-le-tue-finanze/?ref=6474645",
    shortDescription:
      "Percorsi formativi online dedicati all'educazione finanziaria e alla preparazione agli esami OCF, OAM e IVASS, da seguire in autonomia e secondo i propri ritmi.",
    description:
      "<p>Percorsi formativi online dedicati all'educazione finanziaria e alla preparazione agli esami OCF, OAM e IVASS, progettati per sviluppare competenze concrete e favorire la crescita professionale.</p>" +
      "<p>I corsi sono realizzati per offrire una preparazione completa, pratica e aggiornata, consentendo di studiare in autonomia e secondo i propri ritmi, con accesso immediato ai contenuti formativi.</p>" +
      "<h3>Cosa include</h3>" +
      "<p>Una formazione professionale pensata per supportare studenti, aspiranti consulenti e professionisti nello sviluppo delle competenze necessarie per affrontare con maggiore sicurezza il percorso di studio e gli esami di abilitazione.</p>" +
      "<h4>Percorsi disponibili</h4>" +
      "<ul><li>Preparazione all'esame OCF — Consulente Finanziario Abilitato all'Offerta Fuori Sede</li><li>Preparazione all'esame OAM — Agenti in Attività Finanziaria e Mediatori Creditizi</li><li>Preparazione all'esame IVASS — Intermediari Assicurativi</li><li>Educazione finanziaria, risparmio e pianificazione finanziaria</li><li>Approfondimenti su credito, investimenti e strumenti finanziari</li></ul>" +
      "<h4>Caratteristiche dei corsi</h4>" +
      "<ul><li>Video-lezioni strutturate e aggiornate</li><li>Materiali didattici e dispense di approfondimento</li><li>Esercitazioni pratiche e simulazioni d'esame</li><li>Quiz di verifica dell'apprendimento</li><li>Accesso online 24 ore su 24</li><li>Studio flessibile secondo i propri tempi</li><li>Supporto dedicato durante il percorso formativo</li><li>Aggiornamenti periodici dei contenuti</li></ul>" +
      "<h4>A chi sono rivolti</h4>" +
      "<p>Studenti, professionisti, aspiranti consulenti finanziari, agenti in attività finanziaria, mediatori creditizi, intermediari assicurativi e persone interessate ad acquisire competenze nel settore finanziario, creditizio e assicurativo.</p>" +
      "<p>Iscrizione e accesso ai contenuti gestiti tramite piattaforma online dedicata.</p>",
    images: img("corsi-online", "Corsi online su piattaforma"),
    status: "published",
    seo: {
      title: "Corsi Online — Educazione finanziaria ed esami OCF, OAM, IVASS",
      description:
        "Corsi online di educazione finanziaria e preparazione agli esami OCF, OAM e IVASS, con video-lezioni, materiali, esercitazioni e simulazioni.",
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
