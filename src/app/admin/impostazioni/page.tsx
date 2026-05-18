import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impostazioni | Admin" };

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Impostazioni</h1>
      <p className="mt-6 text-[var(--color-muted)]">Impostazioni negozio — in costruzione.</p>
    </div>
  );
}
