import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Dashboard</h1>
      <p className="mt-4 text-[var(--color-muted)]">Statistiche — in costruzione.</p>
    </div>
  );
}
