"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/servizi", label: "Servizi" },
  { href: "/admin/ordini", label: "Ordini" },
  { href: "/admin/messaggi", label: "Messaggi" },
  { href: "/admin/categorie", label: "Categorie" },
  { href: "/admin/impostazioni", label: "Impostazioni" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const currentLabel =
    [...NAV].sort((a, b) => b.href.length - a.href.length).find((n) =>
      pathname === n.href || pathname.startsWith(n.href + "/")
    )?.label ?? "Admin";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-card-subtle)] md:flex-row">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden">
        <Link
          href="/admin"
          className="font-serif text-lg text-[var(--color-foreground)]"
        >
          Lucrezia Admin
        </Link>
        <button
          type="button"
          aria-label="Apri menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center border border-[var(--color-border)] text-[var(--color-foreground)]"
        >
          <span className="sr-only">Menu</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M4 4l10 10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <path d="M2 5h14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 9h14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 13h14" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Mobile current-section indicator */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-card-subtle)] px-4 py-2 text-xs uppercase tracking-widest text-[var(--color-muted)] md:hidden">
        {currentLabel}
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Chiudi menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar (drawer on mobile, fixed on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)] px-4 py-8 transition-transform duration-200 md:static md:z-auto md:w-60 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between md:block">
          <Link
            href="/admin"
            className="font-serif text-xl text-[var(--color-foreground)]"
          >
            Lucrezia Admin
          </Link>
          <button
            type="button"
            aria-label="Chiudi menu"
            onClick={() => setOpen(false)}
            className="text-sm text-[var(--color-muted)] md:hidden"
          >
            Chiudi
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[var(--color-card-subtle)] text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-card-subtle)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
