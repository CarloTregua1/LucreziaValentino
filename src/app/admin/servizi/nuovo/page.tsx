import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nuovo servizio | Admin" };

export default function AdminNewServizioPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Nuovo servizio</h1>
      <p className="mt-6 text-[var(--color-muted)]">Form servizio — in costruzione.</p>
    </div>
  );
}
