import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/actions/categories";
import { getServizioById } from "@/lib/actions/servizi";
import { ServizioForm } from "../_components/servizio-form";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const servizio = await getServizioById(id);
  return { title: servizio ? `${servizio.name} | Admin` : "Servizio | Admin" };
}

export default async function AdminEditServizioPage({ params }: Props) {
  const { id } = await params;
  const [servizio, categories] = await Promise.all([
    getServizioById(id),
    getCategories(),
  ]);

  if (!servizio) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-10 font-serif text-3xl text-[var(--color-foreground)]">
        Modifica: {servizio.name}
      </h1>
      <ServizioForm servizio={servizio} categories={categories} />
    </div>
  );
}
