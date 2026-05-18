import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messaggi" };

export default function CustomerMessagesPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Messaggi
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Chat con Lucrezia — in costruzione.</p>
      </div>
    </section>
  );
}
