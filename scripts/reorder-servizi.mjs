// Rewrite the servizi ordering.
// Usage: node --env-file=.env scripts/reorder-servizi.mjs
//
// The listing (/servizi and the "Aree di competenza" grid on the homepage) is
// sorted by createdAt descending — there is no separate order field — so the
// canonical order lives here as a list of slugs and is applied by rewriting
// createdAt with timestamps spaced one minute apart, index 0 being the newest.
// Both seed scripts preserve createdAt on update, so re-seeding won't undo it.
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

// Position 1 first. The four "Corsi di Formazione" close the list, after
// "Corsi Online".
const ORDER = [
  "consulenza-creditizia",
  "caf-patronato",
  "formazione-professionale",
  "orientamento-professionale",
  "ai-innovazione",
  "microcredito",
  "sicurezza-lavoro",
  "ebook-professionali",
  "corsi-online",
  "corso-educazione-finanziaria",
  "corso-oam-catania",
  "corso-oam-reggio-calabria",
  "corso-abilitazione-oam-ivass",
];

const snap = await db.collection("servizi").get();
const bySlug = new Map(snap.docs.map((d) => [d.data().slug, d]));

const missing = ORDER.filter((slug) => !bySlug.has(slug));
if (missing.length) {
  console.error(`Slug non trovati in Firestore: ${missing.join(", ")}`);
  process.exit(1);
}

const extra = [...bySlug.keys()].filter((slug) => !ORDER.includes(slug));
if (extra.length) {
  console.error(
    `Servizi presenti in Firestore ma assenti da ORDER: ${extra.join(", ")}.\n` +
      "Aggiungili alla lista, altrimenti finirebbero in una posizione casuale."
  );
  process.exit(1);
}

const base = Date.now();

for (let i = 0; i < ORDER.length; i++) {
  const doc = bySlug.get(ORDER[i]);
  const createdAt = new Date(base - i * 60_000).toISOString();
  await doc.ref.update({ createdAt });
  console.log(`${String(i + 1).padStart(2)}. ${doc.data().name}`);
}

console.log(`\n✓ ${ORDER.length} servizi riordinati.`);
process.exit(0);
