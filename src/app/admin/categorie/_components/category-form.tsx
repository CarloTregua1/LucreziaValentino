"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  categorySchema,
  type CategoryFormValues,
  type CategoryInput,
} from "@/lib/schemas/category";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import type { CategoryDoc } from "@/types";

interface Props {
  category?: CategoryDoc;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues, unknown, CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          slug: category.slug,
          name: category.name,
          description: category.description,
          order: category.order,
        }
      : {
          order: 0,
          description: "",
        },
  });

  const nameValue = watch("name");

  function handleNameBlur() {
    if (!category && nameValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }

  async function onSubmit(data: CategoryInput) {
    setServerError(null);

    const result = category
      ? await updateCategory(category.id, data)
      : await createCategory(data);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    router.push("/admin/categorie");
    router.refresh();
  }

  const labelClass =
    "block text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] mb-1.5";
  const inputClass =
    "w-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none";
  const errorClass = "mt-1 text-xs text-[var(--color-error)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">
          {serverError}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nome *</label>
          <input
            {...register("name")}
            onBlur={handleNameBlur}
            className={inputClass}
            placeholder="Bonus aziendali"
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input
            {...register("slug")}
            className={inputClass}
            placeholder="bonus-aziendali"
          />
          {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Ordine</label>
          <input
            type="number"
            min="0"
            step="1"
            className={inputClass}
            defaultValue={category?.order ?? 0}
            onChange={(e) =>
              setValue("order", parseInt(e.target.value || "0", 10), {
                shouldValidate: true,
              })
            }
          />
          {errors.order && <p className={errorClass}>{errors.order.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Descrizione</label>
          <textarea
            {...register("description")}
            rows={4}
            className={inputClass}
            placeholder="Descrizione opzionale mostrata accanto alla categoria."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-foreground)] px-8 py-3 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] disabled:opacity-50"
        >
          {isSubmitting ? "Salvataggio…" : category ? "Aggiorna categoria" : "Crea categoria"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categorie")}
          className="px-6 py-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}
