import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ordini | Admin" };

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Ordini</h1>
      <p className="mt-6 text-[var(--color-muted)]">Lista ordini — in costruzione.</p>
    </div>
  );
}
