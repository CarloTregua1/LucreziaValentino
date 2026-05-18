import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySessionCookie } from "@/lib/firebase/auth";
import { LogoutButtonClient } from "./logout-button";

export const metadata: Metadata = { title: "Il mio account" };

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) redirect("/login");

  const user = await verifySessionCookie(session);
  if (!user) redirect("/login");

  return (
    <section className="section-spacing">
      <div className="container-xl max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
          Il mio account
        </p>
        <h1 className="mt-3 font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Benvenuta
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">{user.email}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/account/ordini"
            className="border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-foreground)]"
          >
            <p className="font-serif text-xl text-[var(--color-foreground)]">I miei ordini</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Visualizza lo storico dei tuoi acquisti
            </p>
          </Link>

          <Link
            href="/account/messaggi"
            className="border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-foreground)]"
          >
            <p className="font-serif text-xl text-[var(--color-foreground)]">Messaggi</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Scrivi a Lucrezia
            </p>
          </Link>
        </div>

        <div className="mt-12">
          <LogoutButtonClient />
        </div>
      </div>
    </section>
  );
}
