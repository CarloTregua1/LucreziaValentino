export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/firebase/auth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Token mancante" }, { status: 400 });
    }

    const sessionCookie = await createSessionCookie(
      idToken,
      SESSION_MAX_AGE_SECONDS * 1000
    );

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
    return NextResponse.json({ error: "Autenticazione non riuscita" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
