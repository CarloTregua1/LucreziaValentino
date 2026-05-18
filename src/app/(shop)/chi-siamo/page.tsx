import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi sono",
  description: "Lucrezia, consulente specializzata in bonus e ottimizzazione fiscale.",
};

export default function AboutPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl max-w-3xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Chi sono
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-muted)]">
          Professionista della consulenza finanziaria, specializzata in bonus e fiscalità — in costruzione.
        </p>
      </div>
    </section>
  );
}
