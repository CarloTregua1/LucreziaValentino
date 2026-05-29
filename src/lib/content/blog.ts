// Static blog content. Articles live here (no database) so the blog can be
// edited directly in code. Newest first is handled by getAllPosts().

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  image: string;
  imageAlt: string;
  /** Paragraphs of body copy (plain text). */
  body: string[];
}

const POSTS: BlogPost[] = [
  {
    slug: "benvenuti-educazione-finanziaria-crescita",
    title: "Benvenuti: educazione finanziaria, formazione e crescita",
    excerpt:
      "Uno spazio chiaro e accessibile dedicato a finanza, formazione, orientamento e imprenditorialità, per trasformare temi complessi in competenze pratiche.",
    category: "Editoriale",
    date: "2026-05-20",
    image: "/images/servizi/formazione-professionale.png",
    imageAlt: "Formazione professionale",
    body: [
      "Nel mondo della finanza, della formazione, dell'orientamento professionale e dell'imprenditorialità, avere informazioni corrette e strumenti adeguati può fare la differenza tra una scelta consapevole e una decisione presa senza le giuste competenze. Questo blog nasce proprio con l'obiettivo di offrire contenuti chiari, professionali e accessibili dedicati all'educazione finanziaria, alla crescita professionale, al microcredito, allo sviluppo imprenditoriale e alle competenze richieste nel mercato del lavoro moderno.",
      "Attraverso articoli, approfondimenti, guide pratiche e aggiornamenti normativi, troverai contenuti dedicati a gestione del risparmio, prestiti, sovraindebitamento, microcredito, investimenti, strumenti assicurativi, preparazione agli esami OCF, OAM e IVASS, oltre a temi legati a orientamento, formazione digitale, soft skills, innovazione e sviluppo di progetti professionali e imprenditoriali.",
      "Particolare attenzione viene dedicata anche ai percorsi formativi professionalizzanti, al mondo CAF e Patronato, alle pratiche amministrative e previdenziali, ai servizi digitali della Pubblica Amministrazione e all'utilizzo dell'intelligenza artificiale applicata alla formazione, ai servizi e al lavoro.",
      "L'obiettivo è aiutare studenti, professionisti, lavoratori, cittadini e aspiranti imprenditori a comprendere meglio strumenti finanziari, opportunità formative, pratiche di patronato e procedure amministrative spesso considerate complesse, trasformandole in conoscenze pratiche e realmente utilizzabili nella vita quotidiana e professionale.",
      "Questo spazio vuole essere un punto di riferimento autorevole ma vicino alle persone, dove competenza, etica, inclusione e aggiornamento continuo si incontrano per creare valore, consapevolezza e nuove opportunità di crescita personale, professionale e imprenditoriale.",
    ],
  },
  {
    slug: "consulenza-creditizia-e-finanziaria-bussola",
    title: "Consulenza creditizia e finanziaria: una bussola per le tue scelte",
    excerpt:
      "Credito, mutui, consolidamento e strumenti finanziari spiegati con chiarezza: perché affidarsi a un professionista fa la differenza.",
    category: "Credito e finanza",
    date: "2026-05-12",
    image: "/images/servizi/consulenza-creditizia.png",
    imageAlt: "Consulenza creditizia",
    body: [
      "Il settore della consulenza creditizia e finanziaria rappresenta oggi un punto di riferimento fondamentale per privati, famiglie, professionisti e imprese che desiderano gestire in modo più consapevole il proprio rapporto con il denaro, il credito e gli strumenti finanziari. In un contesto economico sempre più complesso, affidarsi a professionisti qualificati significa poter comprendere meglio opportunità, rischi e soluzioni disponibili.",
      "Questo blog nasce con l'obiettivo di offrire contenuti chiari, professionali e accessibili dedicati al mondo della consulenza del credito e della consulenza finanziaria, approfondendo temi legati al credito al consumo, alla cessione del quinto, ai mutui, al consolidamento debiti, al microcredito, alla gestione sostenibile delle risorse economiche e agli strumenti finanziari e assicurativi dedicati a privati e professionisti.",
      "Attraverso articoli, guide pratiche, casi studio e aggiornamenti normativi, verranno affrontati anche temi legati alla tutela del consumatore, alla sostenibilità finanziaria, alla pianificazione economica e alle competenze richieste per operare nel settore creditizio e finanziario, con particolare attenzione ai percorsi di preparazione per gli esami OAM, OCF e IVASS.",
      "Particolare attenzione sarà dedicata anche all'evoluzione digitale del settore, all'utilizzo dell'intelligenza artificiale nei servizi finanziari, alle nuove esigenze dei clienti e all'importanza di una consulenza etica, trasparente e orientata alla reale sostenibilità economica della persona.",
      "L'obiettivo è aiutare cittadini, studenti e professionisti a comprendere meglio il funzionamento del mondo creditizio e finanziario, sviluppando maggiore consapevolezza nelle scelte economiche e valorizzando il ruolo del consulente come figura di supporto, orientamento e accompagnamento nelle decisioni finanziarie più importanti.",
    ],
  },
  {
    slug: "ocf-oam-ivass-come-prepararsi",
    title: "OCF, OAM e IVASS: come prepararsi agli esami di abilitazione",
    excerpt:
      "Tre sigle, tre professioni del settore finanziario e assicurativo. Cosa sono gli esami e come affrontare la preparazione con metodo.",
    category: "Formazione",
    date: "2026-04-28",
    image: "/images/servizi/ebook-professionali.png",
    imageAlt: "Ebook professionali per la preparazione agli esami",
    body: [
      "Chi vuole lavorare come consulente finanziario, agente o mediatore creditizio o intermediario assicurativo deve superare un esame di abilitazione. Le tre sigle più ricorrenti — OCF, OAM e IVASS — corrispondono ad altrettanti percorsi professionali, ciascuno con una propria normativa e una propria prova d'esame.",
      "L'esame OCF (Organismo di vigilanza e tenuta dell'albo unico dei Consulenti Finanziari) abilita all'iscrizione all'albo dei consulenti finanziari. La prova valutativa OAM riguarda gli agenti in attività finanziaria e i mediatori creditizi, figure centrali nel mondo del credito. L'esame IVASS, infine, è rivolto agli intermediari assicurativi e riassicurativi, secondo la disciplina della distribuzione assicurativa (IDD).",
      "In tutti e tre i casi la preparazione richiede metodo: studio della normativa di riferimento, comprensione dei prodotti e tanta pratica con quiz e simulazioni d'esame. Non basta memorizzare: serve capire la logica delle regole, perché è quella che permette di rispondere anche alle domande formulate in modo nuovo.",
      "Il mio consiglio è di organizzare lo studio per blocchi tematici, alternando teoria ed esercitazioni, e di arrivare all'esame dopo aver svolto un numero consistente di simulazioni a tempo. È il modo migliore per ridurre l'ansia e presentarsi sicuri il giorno della prova.",
      "Per accompagnare chi affronta questi percorsi ho realizzato guide ed ebook dedicati e corsi online con video-lezioni ed esercitazioni. Trovi tutto nella sezione Servizi: l'obiettivo è rendere la preparazione chiara, ordinata e davvero alla portata di tutti.",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
