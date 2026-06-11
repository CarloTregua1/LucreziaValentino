// Create (or update) a Firebase Auth user and grant it the admin role.
// Unlike set-admin.mjs (which only sets the claim on an existing user), this
// creates the account if it doesn't exist, sets/updates the password, applies
// the `role: "admin"` custom claim, and writes the Firestore users profile doc.
//
// Usage:
//   node scripts/create-admin.mjs <email> <password> ["Display Name"]
//
// Reads Firebase Admin credentials from .env.local.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const email = process.argv[2];
const password = process.argv[3];
const displayName = process.argv[4] ?? email?.split("@")[0];

if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password> ["Display Name"]');
  process.exit(1);
}

const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password, displayName, emailVerified: true });
  console.log(`~ Utente esistente aggiornato: ${email}`);
} catch (e) {
  if (e.code === "auth/user-not-found") {
    user = await auth.createUser({ email, password, displayName, emailVerified: true });
    console.log(`+ Utente creato: ${email}`);
  } else {
    throw e;
  }
}

await auth.setCustomUserClaims(user.uid, { role: "admin" });

const userRef = db.collection("users").doc(user.uid);
const existing = await userRef.get();
await userRef.set(
  {
    uid: user.uid,
    email,
    displayName,
    role: "admin",
    ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
  },
  { merge: true },
);

console.log(`✓ ${email} è ora admin (UID: ${user.uid})`);
console.log("Accedi da /login con le credenziali fornite per usare il pannello admin.");
process.exit(0);
