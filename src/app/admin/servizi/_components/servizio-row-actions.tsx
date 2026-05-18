"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteServizio, toggleServizioStatus } from "@/lib/actions/servizi";
import type { ServizioDoc } from "@/types";

interface Props {
  servizio: ServizioDoc;
}

export function ServizioRowActions({ servizio }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    const next = servizio.status === "published" ? "draft" : "published";
    await toggleServizioStatus(servizio.id, next);
    router.refresh();
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm(`Eliminare "${servizio.name}"? L'operazione è irreversibile.`)) return;
    setBusy(true);
    await deleteServizio(servizio.id);
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={busy}
        className="text-xs text-[var(--color-muted)] underline-offset-2 hover:text-[var(--color-foreground)] hover:underline disabled:opacity-40"
      >
        {servizio.status === "published" ? "Bozza" : "Pubblica"}
      </button>
      <a
        href={`/admin/servizi/${servizio.id}`}
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
  );
}
