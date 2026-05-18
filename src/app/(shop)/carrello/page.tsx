import type { Metadata } from "next";

export const metadata: Metadata = { title: "Carrello" };

export default function CartPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Carrello
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Carrello — in costruzione.</p>
      </div>
    </section>
  );
}
