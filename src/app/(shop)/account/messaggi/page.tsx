import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifySessionCookie } from "@/lib/firebase/auth";
import { getMessagesForUser } from "@/lib/actions/messages";
import { CustomerThread } from "./customer-thread";

export const metadata: Metadata = { title: "Messaggi" };
export const dynamic = "force-dynamic";

export default async function CustomerMessagesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect("/login?from=/account/messaggi");

  const user = await verifySessionCookie(session);
  if (!user) redirect("/login");

  const initialMessages = await getMessagesForUser(user.uid);

  return (
    <section className="section-spacing">
      <div className="container-xl max-w-3xl">
        <Link
          href="/account"
          className="link-underline text-xs uppercase tracking-widest text-[var(--color-muted)]"
        >
          ← Area riservata
        </Link>

        <h1 className="mt-6 font-serif text-[var(--text-h1)] leading-[1.02] text-[var(--color-foreground)]">
          Scrivi a{" "}
          <span className="serif-italic text-[var(--color-accent)]">
            Lucrezia.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[var(--color-foreground-soft)]">
          Una chat diretta e riservata con Lucrezia. Di norma risponde entro
          24 ore nei giorni lavorativi.
        </p>

        <CustomerThread userId={user.uid} initialMessages={initialMessages} />
      </div>
    </section>
  );
}
