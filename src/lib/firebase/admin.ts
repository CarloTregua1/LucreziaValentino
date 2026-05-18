import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

function makeProxy<T extends object>(getInstance: () => T): T {
  return new Proxy({} as T, {
    get(_, prop) {
      const instance = getInstance();
      const value = instance[prop as keyof T];
      return typeof value === "function" ? (value as Function).bind(instance) : value;
    },
  });
}

export const adminAuth: Auth = makeProxy(() => getAuth(getAdminApp()));
export const adminDb: Firestore = makeProxy(() => getFirestore(getAdminApp()));
