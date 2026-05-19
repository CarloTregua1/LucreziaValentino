import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
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

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/set-admin.mjs <email>");
  process.exit(1);
}

const auth = getAuth();
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { role: "admin" });
console.log(`✓ ${email} è ora admin (UID: ${user.uid})`);
console.log("Esci e rientra nell'account per aggiornare il cookie di sessione.");
