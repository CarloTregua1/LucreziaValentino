import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Modifica servizio | Admin" };

export default async function AdminEditServizioPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">
        Modifica servizio
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">ID: {id}</p>
      <p className="mt-6 text-[var(--color-muted)]">Form servizio — in costruzione.</p>
    </div>
  );
}
