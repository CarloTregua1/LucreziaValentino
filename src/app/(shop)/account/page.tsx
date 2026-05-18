import type { Metadata } from "next";

export const metadata: Metadata = { title: "Il mio account" };

export default function AccountPage() {
  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          Il mio account
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Account — in costruzione.</p>
      </div>
    </section>
  );
}
