"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCategory } from "@/lib/actions/categories";
import type { CategoryDoc } from "@/types";

interface Props {
  category: CategoryDoc;
}

export function CategoryRowActions({ category }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Eliminare la categoria "${category.name}"?`)) return;
    setBusy(true);
    setError(null);
    const result = await deleteCategory(category.id);
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <a
          href={`/admin/categorie/${category.id}`}
          className="text-xs text-[var(--color-muted)] underline-offset-2 hover:text-[var(--color-foreground)] hover:underline"
        >
          Modifica
        </a>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-xs text-[var(--color-error)] underline-offset-2 hover:underline disabled:opacity-40"
        >
          Elimina
        </button>
      </div>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
