import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--color-card-subtle)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)] px-4 py-8">
        <Link href="/admin" className="font-serif text-xl text-[var(--color-foreground)]">
          Lucrezia Admin
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/prodotti", label: "Prodotti" },
            { href: "/admin/ordini", label: "Ordini" },
            { href: "/admin/messaggi", label: "Messaggi" },
            { href: "/admin/categorie", label: "Categorie" },
            { href: "/admin/impostazioni", label: "Impostazioni" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-card-subtle)] hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
