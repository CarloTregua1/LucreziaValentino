import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categorie | Admin" };

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Categorie</h1>
      <p className="mt-6 text-[var(--color-muted)]">Gestione categorie — in costruzione.</p>
    </div>
  );
}
