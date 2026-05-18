import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collezione",
  description: "Scopri tutti i prodotti Lucrezia.",
};

export default function ProductsPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Collezione
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">I prodotti appariranno qui.</p>
      </div>
    </section>
  );
}
