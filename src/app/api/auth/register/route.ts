export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/constants";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

export async function POST(req: Request) {
  try {
    const { idToken, displayName } = await req.json();

    if (!idToken || !displayName) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);

    await adminDb
      .collection(COLLECTIONS.USERS)
      .doc(decoded.uid)
      .set({
        uid: decoded.uid,
        email: decoded.email ?? "",
        displayName,
        role: "customer",
        createdAt: FieldValue.serverTimestamp(),
      });

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Registrazione non riuscita" }, { status: 500 });
  }
}
