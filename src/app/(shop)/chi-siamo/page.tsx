import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "La storia di Lucrezia e la sua filosofia di moda italiana.",
};

export default function AboutPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl max-w-3xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Chi siamo
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
          La storia di Lucrezia — in costruzione.
        </p>
      </div>
    </section>
  );
}
