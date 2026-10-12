// Creates one category for every distinct `category` already used by a servizio.
// Usage: node --env-file=.env scripts/seed-categories.mjs
//
// The servizi were seeded with a category name but the `categories` collection
// was never populated, which left the admin form's category picker empty — and
// a new servizio cannot be saved without choosing one. Idempotent: a category
// whose name already exists is left alone.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const servizi = await db.collection("servizi").get();
const names = [...new Set(servizi.docs.map((d) => d.get("category")).filter(Boolean))].sort(
  (a, b) => a.localeCompare(b, "it"),
);

const existing = await db.collection("categories").get();
const have = new Set(existing.docs.map((d) => d.get("name")));

const now = new Date().toISOString();
let order = existing.size;
for (const name of names) {
  if (have.has(name)) {
    console.log(`= ${name}`);
    continue;
  }
  const ref = db.collection("categories").doc();
  await ref.set({
    id: ref.id,
    slug: slugify(name),
    name,
    description: "",
    order: order++,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`+ ${name}`);
}

console.log(`\n${names.length} categories in use by ${servizi.size} servizi.`);
