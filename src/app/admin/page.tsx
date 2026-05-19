import type { Metadata } from "next";
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";

export const metadata: Metadata = { title: "Dashboard Admin" };
export const dynamic = "force-dynamic";

async function getStats() {
  const results = await Promise.allSettled([
    adminDb.collection("servizi").get(),
    adminDb.collection("ordini").get(),
  ]);

  const serviziDocs = results[0].status === "fulfilled"
    ? results[0].value.docs.map((d) => d.data())
    : [];
  const ordiniDocs = results[1].status === "fulfilled"
    ? results[1].value.docs.map((d) => d.data())
    : [];

  return {
    totalServizi: serviziDocs.length,
    publishedServizi: serviziDocs.filter((s) => s.status === "published").length,
    totalOrdini: ordiniDocs.length,
    revenueCents: ordiniDocs
      .filter((o) => o.status === "paid" || o.status === "fulfilled")
      .reduce((sum, o) => sum + (o.totalCents ?? 0), 0),
  };
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    cents / 100
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Servizi pubblicati", value: stats.publishedServizi, sub: `${stats.totalServizi} totali`, href: "/admin/servizi" },
    { label: "Ordini", value: stats.totalOrdini, sub: "totale ordini", href: "/admin/ordini" },
    { label: "Ricavi", value: formatEur(stats.revenueCents), sub: "ordini pagati", href: "/admin/ordini" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex flex-col border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition-colors hover:border-[var(--color-accent)]"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              {c.label}
            </p>
            <p className="mt-3 font-serif text-4xl text-[var(--color-foreground)]">{c.value}</p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-serif text-xl text-[var(--color-foreground)]">Azioni rapide</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/servizi/nuovo"
            className="bg-[var(--color-foreground)] px-5 py-2.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
          >
            + Nuovo servizio
          </Link>
          <Link
            href="/admin/ordini"
            className="border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-foreground)] transition-colors hover:border-[var(--color-accent)]"
          >
            Vedi ordini
          </Link>
        </div>
      </div>
    </div>
  );
}
