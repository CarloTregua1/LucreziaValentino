import type { Metadata } from "next";
import { CategoryForm } from "../_components/category-form";

export const metadata: Metadata = { title: "Nuova categoria | Admin" };

export default function AdminNuovaCategoriaPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-10 font-serif text-3xl text-[var(--color-foreground)]">
        Nuova categoria
      </h1>
      <CategoryForm />
    </div>
  );
}
