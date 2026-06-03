"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartLink } from "./cart-count";

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
}

export function MobileMenu({ links }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Highlight the most specific matching link (longest prefix), so e.g.
  // /account/messaggi marks "Contatti" rather than both it and "Account".
  const activeHref = links
    .filter((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center text-[var(--color-foreground)] lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <>
              <path d="M5 5l10 10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
            </>
          ) : (
            <>
              <path d="M2 6h16" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 10h16" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 14h16" stroke="currentColor" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </button>

      {/* Backdrop — anchored to the header's bottom edge so it never dims the
          bar itself, and tracks the real nav height (no hard-coded offset). */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`absolute inset-x-0 top-full z-30 h-screen bg-black/40 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        id="mobile-nav"
        inert={!open}
        className={`absolute inset-x-0 top-full z-40 border-b border-[var(--color-border)] bg-[var(--color-background)] shadow-lg transition-[opacity,transform] duration-200 ease-out lg:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav className="container-xl flex flex-col py-2">
          {links.map((link) => {
            const active = link.href === activeHref;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`border-b border-[var(--color-border)] py-4 text-base transition-colors last:border-0 ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="py-4">
            <CartLink />
          </div>
        </nav>
      </div>
    </>
  );
}
