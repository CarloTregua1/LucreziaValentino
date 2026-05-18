import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Checkout
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Checkout — in costruzione.</p>
      </div>
    </section>
  );
}
