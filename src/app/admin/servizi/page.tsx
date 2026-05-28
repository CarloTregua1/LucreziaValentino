import type { Metadata } from "next";
import Link from "next/link";
import { getServizi } from "@/lib/actions/servizi";
import { ServizioRowActions } from "./_components/servizio-row-actions";

export const metadata: Metadata = { title: "Servizi | Admin" };

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    cents / 100
  );
}

export default async function AdminServiziPage() {
  const servizi = await getServizi();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Servizi</h1>
        <Link
          href="/admin/servizi/nuovo"
          className="bg-[var(--color-foreground)] px-5 py-2.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
        >
          + Nuovo servizio
        </Link>
      </div>

      {servizi.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[var(--color-muted)]">Nessun servizio ancora.</p>
          <Link
            href="/admin/servizi/nuovo"
            className="mt-4 inline-block text-sm text-[var(--color-accent)] underline underline-offset-2"
          >
            Crea il primo servizio
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-[var(--color-border)]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-card-subtle)]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Prezzo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
                  Stato
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {servizi.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--color-border)] bg-[var(--color-card)] last:border-0"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-[var(--color-foreground)]">{s.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{s.slug}</p>
                  </td>
                  <td className="px-4 py-4 capitalize text-[var(--color-muted)]">{s.type}</td>
                  <td className="px-4 py-4 text-[var(--color-foreground)]">
                    {formatPrice(s.priceCents)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-[var(--color-card-subtle)] text-[var(--color-muted)]"
                      }`}
                    >
                      {s.status === "published" ? "Pubblicato" : "Bozza"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <ServizioRowActions servizio={s} />
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
