import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Dettaglio ordine | Admin" };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Ordine #{id}</h1>
      <p className="mt-6 text-[var(--color-muted)]">Dettaglio ordine — in costruzione.</p>
    </div>
  );
}
