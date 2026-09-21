// Put the four Orizzonti Finanziari titles on the "ebook-professionali"
// servizio. Usage: node --env-file=.env scripts/set-ebook-links.mjs
//
// A targeted update instead of re-running seed-servizi.mjs, which would also
// rewrite the prose and the price with the values hard-coded in the seed.
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

const SLUG = "ebook-professionali";

const LINKS = [
  {
    label: "Io Conto — Educazione finanziaria",
    url: "https://scrimmedizioni.com/product-detail/productidn/3538423/io-conto-ebook-ivii-coll-orizzonti-finanziari--s-lucrezia-valentino",
  },
  {
    label: "Esame OAM",
    url: "https://scrimmedizioni.com/product-detail/productidn/3589344/esame-oam-ebook-iivii-coll-orizzonti-finanziari--s-lucrezia-valentino",
  },
  {
    label: "Esame OCF — Parte 1",
    url: "https://scrimmedizioni.com/product-detail/productidn/4416562/esame-ocf-parte-1-il-settore-finanziario-fondamenti-e-conoscenze-essenziali-parte-iiii-ebook-iiivii-coll-orizzonti-finanziari--s-lucrezia-valentino",
  },
  {
    label: "Esame OCF — Parte 2",
    url: "https://scrimmedizioni.com/product-detail/productidn/4832686/esame-ocf-parte-2-il-settore-finanziario-fondamenti-e-conoscenze-essenziali-parte-iiiii-ebook-iiivii-coll-orizzonti-finanziari--s-lucrezia-valentino",
  },
];

const snap = await db.collection("servizi").where("slug", "==", SLUG).limit(1).get();

if (snap.empty) {
  console.error(`Servizio "${SLUG}" non trovato.`);
  process.exit(1);
}

const doc = snap.docs[0];
await doc.ref.update({
  externalLinks: LINKS,
  updatedAt: new Date().toISOString(),
});

console.log(`✓ ${doc.data().name}`);
for (const l of LINKS) console.log(`  · ${l.label}`);
process.exit(0);
