import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/actions/categories";
import { CategoryRowActions } from "./_components/category-row-actions";

export const metadata: Metadata = { title: "Categorie | Admin" };

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Categorie</h1>
        <Link
          href="/admin/categorie/nuova"
          className="bg-[var(--color-foreground)] px-5 py-2.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
        >
          + Nuova categoria
        </Link>
      </div>

      <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)]">
        Le categorie raggruppano i servizi sul sito. L&apos;ordine determina come appaiono nei filtri.
      </p>

      {categories.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[var(--color-muted)]">Nessuna categoria ancora.</p>
          <Link
            href="/admin/categorie/nuova"
            className="mt-4 inline-block text-sm text-[var(--color-accent)] underline underline-offset-2"
          >
            Crea la prima categoria
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-[var(--color-border)]">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-card-subtle)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Ordine
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[var(--color-border)] bg-[var(--color-card)] last:border-0"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-[var(--color-foreground)]">{c.name}</p>
                    {c.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--color-muted)]">
                        {c.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-[var(--color-muted)]">{c.slug}</td>
                  <td className="px-4 py-4 text-[var(--color-foreground)]">{c.order}</td>
                  <td className="px-4 py-4 text-right">
                    <CategoryRowActions category={c} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
