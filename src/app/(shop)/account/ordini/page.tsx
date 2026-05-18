import type { Metadata } from "next";

export const metadata: Metadata = { title: "I miei ordini" };

export default function OrdersPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          I miei ordini
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Storico ordini — in costruzione.</p>
      </div>
    </section>
  );
}
