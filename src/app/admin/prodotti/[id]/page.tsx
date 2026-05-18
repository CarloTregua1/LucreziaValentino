import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Modifica prodotto | Admin" };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">
        Modifica prodotto
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">ID: {id}</p>
      <p className="mt-6 text-[var(--color-muted)]">Form prodotto — in costruzione.</p>
    </div>
  );
}
