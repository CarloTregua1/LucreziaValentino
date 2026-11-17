// Delete orders created by Stripe TEST-mode payments (demos, local testing).
// Usage:  node --env-file=.env scripts/delete-test-orders.mjs          (dry run)
//         node --env-file=.env scripts/delete-test-orders.mjs --yes    (delete)
//
// Local .env points at the real Firestore, so test payments made on this Mac
// (e.g. during `npm run demo`) land in the real /admin/ordini list. An order's
// doc id is its Stripe Checkout Session id, and test sessions are always
// `cs_test_…` while real ones are `cs_live_…` — so this only ever touches
// test orders.

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const confirm = process.argv.includes("--yes");

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const snap = await getFirestore().collection("ordini").get();
const test = snap.docs.filter((d) => d.id.startsWith("cs_test_"));

console.log(`${test.length} test order(s) out of ${snap.size}.`);
for (const d of test) {
  const o = d.data();
  console.log(`  ${d.id.slice(0, 24)}…  ${o.createdAt}  ${(o.totalCents / 100).toFixed(2)} €`);
}

if (!confirm) {
  if (test.length) console.log("\nDry run — re-run with --yes to delete them.");
  process.exit(0);
}

await Promise.all(test.map((d) => d.ref.delete()));
console.log(`Deleted ${test.length}.`);
