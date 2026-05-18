import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nuovo prodotto | Admin" };

export default function AdminNewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Nuovo prodotto</h1>
      <p className="mt-6 text-[var(--color-muted)]">Form prodotto — in costruzione.</p>
    </div>
  );
}
