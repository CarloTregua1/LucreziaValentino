import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Prodotti | Admin" };

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Prodotti</h1>
        <Link
          href="/admin/prodotti/nuovo"
          className="bg-[var(--color-foreground)] px-5 py-2.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
        >
          + Nuovo prodotto
        </Link>
      </div>
      <p className="mt-6 text-[var(--color-muted)]">Lista prodotti — in costruzione.</p>
    </div>
  );
}
