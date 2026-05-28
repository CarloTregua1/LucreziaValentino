import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/actions/categories";
import { CategoryForm } from "../_components/category-form";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);
  return { title: category ? `${category.name} | Admin` : "Categoria | Admin" };
}

export default async function AdminEditCategoriaPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-10 font-serif text-3xl text-[var(--color-foreground)]">
        Modifica: {category.name}
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
