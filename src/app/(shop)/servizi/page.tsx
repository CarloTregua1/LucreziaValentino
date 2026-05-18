import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servizi",
  description: "Consulenza su bonus e fiscalità — scopri tutti i servizi di Lucrezia.",
};

export default function ServiziPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Servizi
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">I servizi appariranno qui.</p>
      </div>
    </section>
  );
}
