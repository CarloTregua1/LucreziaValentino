import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messaggi | Admin" };

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Messaggi</h1>
      <p className="mt-6 text-[var(--color-muted)]">Inbox clienti — in costruzione.</p>
    </div>
  );
}
