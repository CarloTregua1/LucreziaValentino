// Seed realistic DEMO data so the admin panel can be explored end-to-end:
// customers (users), orders (ordini) with varied statuses, and chat
// conversations with messages.
//
// Usage:
//   node scripts/seed-demo.mjs           seed (wipes previous demo data first)
//   node scripts/seed-demo.mjs --clean   remove all demo data, seed nothing
//
// Every document written carries `_demo: true` so it can be found and removed
// without touching real data. Re-running is safe: the script clears prior demo
// docs before inserting a fresh set. Reads Firebase Admin credentials from
// .env.local (same convention as the other scripts).

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
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

const ORDINI = "ordini";
const USERS = "users";
const CONVERSATIONS = "conversations";
const MESSAGES = "messages";

const iso = (date) => date.toISOString();
const daysAgo = (n, hour = 10, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d;
};

/* ──────────────────────────── Demo customers ──────────────────────────── */

const CUSTOMERS = [
  { uid: "demo-user-01", displayName: "Giulia Romano", email: "giulia.romano@gmail.com", phone: "+39 340 1122334", joinedDaysAgo: 72 },
  { uid: "demo-user-02", displayName: "Marco Bianchi", email: "marco.bianchi@libero.it", phone: "+39 333 9988776", joinedDaysAgo: 65 },
  { uid: "demo-user-03", displayName: "Francesca Conti", email: "francesca.conti@outlook.it", phone: "+39 347 4455667", joinedDaysAgo: 58 },
  { uid: "demo-user-04", displayName: "Alessandro Greco", email: "a.greco@gmail.com", phone: "+39 320 7766554", joinedDaysAgo: 44 },
  { uid: "demo-user-05", displayName: "Chiara Marino", email: "chiara.marino92@gmail.com", phone: "+39 349 1239871", joinedDaysAgo: 33 },
  { uid: "demo-user-06", displayName: "Davide Ferrari", email: "davide.ferrari@hotmail.it", phone: "+39 366 5544332", joinedDaysAgo: 21 },
  { uid: "demo-user-07", displayName: "Sara Esposito", email: "sara.esposito@gmail.com", phone: "+39 351 8877665", joinedDaysAgo: 12 },
  { uid: "demo-user-08", displayName: "Luca Rizzo", email: "luca.rizzo@virgilio.it", phone: "+39 342 2233445", joinedDaysAgo: 5 },
];

/* ──────────────────────────── Demo orders ──────────────────────────── */
// References real services by slug (resolved from Firestore at run time).

const ORDER_SPECS = [
  { customer: 0, items: [["consulenza-creditizia", 1]], status: "fulfilled", daysAgo: 70 },
  { customer: 1, items: [["formazione-professionale", 1]], status: "fulfilled", daysAgo: 61 },
  { customer: 2, items: [["orientamento-professionale", 1], ["ebook-professionali", 2]], status: "paid", daysAgo: 49 },
  { customer: 0, items: [["microcredito", 1]], status: "paid", daysAgo: 40 },
  { customer: 3, items: [["caf-patronato", 1]], status: "fulfilled", daysAgo: 37 },
  { customer: 4, items: [["ai-innovazione", 1]], status: "paid", daysAgo: 29 },
  { customer: 5, items: [["sicurezza-lavoro", 1]], status: "paid", daysAgo: 22 },
  { customer: 2, items: [["corsi-online", 1]], status: "fulfilled", daysAgo: 18 },
  { customer: 6, items: [["consulenza-creditizia", 1]], status: "pending", daysAgo: 9 },
  { customer: 7, items: [["orientamento-professionale", 1]], status: "paid", daysAgo: 6 },
  { customer: 1, items: [["ai-innovazione", 1]], status: "cancelled", daysAgo: 4 },
  { customer: 4, items: [["formazione-professionale", 1]], status: "refunded", daysAgo: 2 },
];

/* ──────────────────────────── Demo conversations ──────────────────────────── */
// Each thread is an array of [role, text, daysAgo, hour, min].

const THREADS = [
  {
    customer: 0,
    messages: [
      ["customer", "Buongiorno Lucrezia, avrei bisogno di una consulenza sul mutuo prima casa. Posso prenotare un incontro online?", 71, 9, 12],
      ["admin", "Buongiorno Giulia, certamente. Possiamo vederci questa settimana: preferisce giovedì pomeriggio o venerdì mattina?", 71, 11, 30],
      ["customer", "Giovedì pomeriggio è perfetto, grazie!", 71, 14, 5],
      ["admin", "Ottimo, le invio il link per l'incontro. A presto!", 70, 9, 0],
    ],
  },
  {
    customer: 2,
    messages: [
      ["customer", "Salve, ho acquistato gli ebook ma non ho ricevuto il link per il download. Può aiutarmi?", 48, 16, 20],
      ["admin", "Buonasera Francesca, mi scuso per il disguido. Le ho appena inviato il link via email, mi confermi la ricezione?", 48, 18, 45],
      ["customer", "Ricevuto, tutto a posto. Grazie mille per la rapidità!", 47, 8, 30],
    ],
  },
  {
    customer: 4,
    messages: [
      ["customer", "Ciao Lucrezia, sto preparando l'esame OAM. I corsi online includono anche le simulazioni d'esame?", 30, 10, 0],
      ["admin", "Ciao Chiara, sì: il percorso include video-lezioni, dispense e simulazioni con quiz di verifica. Vuoi che ti illustri il programma completo?", 30, 12, 15],
      ["customer", "Sì grazie, sarebbe utilissimo.", 29, 9, 40],
    ],
  },
  {
    customer: 6,
    messages: [
      ["customer", "Buonasera, vorrei informazioni sulla consulenza creditizia per un consolidamento debiti. Come funziona?", 8, 19, 10],
      ["admin", "Buonasera Davide, nella consulenza analizziamo la sua situazione e valutiamo insieme le soluzioni più sostenibili. Possiamo fissare un primo incontro conoscitivo, mi dica pure la sua disponibilità.", 8, 20, 30],
      ["customer", "Perfetto. Sarei disponibile la prossima settimana, in serata se possibile.", 7, 21, 0],
    ],
  },
  {
    customer: 7,
    messages: [
      ["customer", "Salve! Ho appena prenotato la consulenza di orientamento. C'è qualcosa che devo preparare prima dell'incontro?", 5, 11, 25],
      ["admin", "Ciao Luca, benvenuto! Se hai un CV aggiornato portalo pure, e pensa a 2-3 obiettivi professionali che vorresti approfondire. Al resto pensiamo insieme.", 5, 13, 50],
    ],
  },
  {
    customer: 1,
    messages: [
      ["customer", "Gentile Lucrezia, la formazione professionale è erogabile anche in presenza per la mia azienda a Catania?", 3, 15, 0],
      ["admin", "Gentile Marco, assolutamente sì: i percorsi possono essere svolti in presenza o online. Mi può indicare il numero di partecipanti e gli obiettivi formativi così le preparo una proposta?", 3, 16, 20],
      ["customer", "Saremmo circa 8 persone, area amministrazione. Resto in attesa della proposta, grazie.", 2, 9, 15],
    ],
  },
];

/* ──────────────────────────── Cleanup ──────────────────────────── */

async function deleteDemoFrom(collection) {
  const snap = await db.collection(collection).where("_demo", "==", true).get();
  let n = 0;
  for (const doc of snap.docs) {
    // Clear any messages subcollection first (conversations).
    const sub = await doc.ref.collection(MESSAGES).get();
    for (const m of sub.docs) await m.ref.delete();
    await doc.ref.delete();
    n++;
  }
  return n;
}

async function clean() {
  const users = await deleteDemoFrom(USERS);
  const ordini = await deleteDemoFrom(ORDINI);
  const convs = await deleteDemoFrom(CONVERSATIONS);
  console.log(`✓ Rimossi dati demo — ${users} utenti, ${ordini} ordini, ${convs} conversazioni.`);
}

/* ──────────────────────────── Seed ──────────────────────────── */

async function loadServizi() {
  const snap = await db.collection("servizi").get();
  const bySlug = {};
  for (const d of snap.docs) {
    const s = d.data();
    bySlug[s.slug] = { id: d.id, ...s };
  }
  return bySlug;
}

async function seed() {
  // Always start from a clean demo slate so re-runs stay consistent.
  await clean();

  const servizi = await loadServizi();
  if (Object.keys(servizi).length === 0) {
    console.warn(
      "⚠ Nessun servizio trovato in Firestore. Esegui prima `node scripts/seed-servizi.mjs`."
    );
  }

  // Users
  for (const c of CUSTOMERS) {
    await db.collection(USERS).doc(c.uid).set({
      uid: c.uid,
      email: c.email,
      displayName: c.displayName,
      role: "customer",
      phone: c.phone,
      createdAt: Timestamp.fromDate(daysAgo(c.joinedDaysAgo)),
      _demo: true,
    });
  }
  console.log(`+ ${CUSTOMERS.length} utenti demo`);

  // Orders
  let orderCount = 0;
  for (let i = 0; i < ORDER_SPECS.length; i++) {
    const spec = ORDER_SPECS[i];
    const customer = CUSTOMERS[spec.customer];

    const items = [];
    for (const [slug, qty] of spec.items) {
      const s = servizi[slug];
      const name = s?.name ?? slug;
      const priceCents = s?.priceCents ?? 5000;
      const image = s?.images?.[0]?.url;
      items.push({
        productId: s?.id ?? slug,
        slug,
        name,
        ...(image ? { image } : {}),
        priceCents,
        quantity: qty,
        subtotalCents: priceCents * qty,
      });
    }
    const subtotalCents = items.reduce((sum, it) => sum + it.subtotalCents, 0);
    const created = daysAgo(spec.daysAgo, 12, (i * 7) % 60);
    const id = `demo_ord_${String(i + 1).padStart(2, "0")}`;

    await db.collection(ORDINI).doc(id).set({
      id,
      userId: customer.uid,
      email: customer.email,
      status: spec.status,
      items,
      subtotalCents,
      totalCents: subtotalCents,
      currency: "EUR",
      stripeSessionId: `cs_test_demo_${id}`,
      stripePaymentIntentId:
        spec.status === "pending" || spec.status === "cancelled"
          ? ""
          : `pi_test_demo_${id}`,
      createdAt: iso(created),
      updatedAt: iso(created),
      _demo: true,
    });
    orderCount++;
  }
  console.log(`+ ${orderCount} ordini demo`);

  // Conversations + messages
  let convCount = 0;
  for (const thread of THREADS) {
    const customer = CUSTOMERS[thread.customer];
    const convRef = db.collection(CONVERSATIONS).doc(customer.uid);

    const sorted = [...thread.messages].sort((a, b) => {
      const da = daysAgo(a[2], a[3], a[4]).getTime();
      const dbb = daysAgo(b[2], b[3], b[4]).getTime();
      return da - dbb;
    });
    const last = sorted[sorted.length - 1];
    const lastDate = daysAgo(last[2], last[3], last[4]);
    const firstDate = daysAgo(sorted[0][2], sorted[0][3], sorted[0][4]);
    const lastFromCustomer = last[0] === "customer";

    await convRef.set({
      id: customer.uid,
      userId: customer.uid,
      userEmail: customer.email,
      userName: customer.displayName,
      lastMessageAt: iso(lastDate),
      lastMessagePreview: last[1].slice(0, 140),
      unreadByAdmin: lastFromCustomer,
      unreadByCustomer: !lastFromCustomer,
      createdAt: iso(firstDate),
      _demo: true,
    });

    for (let j = 0; j < sorted.length; j++) {
      const [role, content, d, h, m] = sorted[j];
      const at = daysAgo(d, h, m);
      const mid = `demo_msg_${j + 1}`;
      await convRef.collection(MESSAGES).doc(mid).set({
        id: mid,
        senderId: role === "admin" ? "admin" : customer.uid,
        senderRole: role,
        content,
        createdAt: iso(at),
      });
    }
    convCount++;
  }
  console.log(`+ ${convCount} conversazioni demo (con messaggi)`);

  console.log(
    `\n✓ Fatto. Apri /admin per esplorare ordini, ricavi e messaggi.\n` +
      `  Per rimuovere tutto: node scripts/seed-demo.mjs --clean`
  );
}

/* ──────────────────────────── Entry ──────────────────────────── */

const run = process.argv.includes("--clean") ? clean : seed;
run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
