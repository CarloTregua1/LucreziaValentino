import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ordine confermato" };

export default function CheckoutSuccessPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl text-center">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Grazie per il tuo ordine
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Conferma ordine — in costruzione.</p>
      </div>
    </section>
  );
}
