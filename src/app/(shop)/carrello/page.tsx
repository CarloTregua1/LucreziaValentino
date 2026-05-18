import type { Metadata } from "next";
import { CartContents } from "./cart-contents";

export const metadata: Metadata = { title: "Carrello" };

export default function CartPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl max-w-4xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Carrello
        </h1>
        <CartContents />
      </div>
    </section>
  );
}
