import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Servizi | Admin" };

export default function AdminServiziPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Servizi</h1>
        <Link
          href="/admin/servizi/nuovo"
          className="bg-[var(--color-foreground)] px-5 py-2.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
        >
          + Nuovo servizio
        </Link>
      </div>
      <p className="mt-6 text-[var(--color-muted)]">Lista servizi — in costruzione.</p>
    </div>
  );
}
