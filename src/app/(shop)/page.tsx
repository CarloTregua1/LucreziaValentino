import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lucrezia — Moda italiana",
  description: "Scopri la collezione esclusiva di Lucrezia.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-xl">
          <h1 className="font-serif text-[var(--text-display)] leading-[0.95] text-[var(--color-foreground)]">
            Lucrezia
          </h1>
          <p className="mt-6 max-w-md text-lg text-[var(--color-muted)]">
            Moda italiana di qualità, consegnata con cura.
          </p>
        </div>
      </section>

      {/* Featured products placeholder */}
      <section className="section-spacing bg-[var(--color-card-subtle)]">
        <div className="container-xl">
          <h2 className="font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
            Collezione
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            I prodotti appariranno qui.
          </p>
        </div>
      </section>
    </div>
  );
}
