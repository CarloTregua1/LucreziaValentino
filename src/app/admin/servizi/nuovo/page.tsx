import type { Metadata } from "next";
import { getCategories } from "@/lib/actions/categories";
import { ServizioForm } from "../_components/servizio-form";

export const metadata: Metadata = { title: "Nuovo servizio | Admin" };

export const dynamic = "force-dynamic";

export default async function AdminNuovoServizioPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-10 font-serif text-3xl text-[var(--color-foreground)]">Nuovo servizio</h1>
      <ServizioForm categories={categories} />
    </div>
  );
}
