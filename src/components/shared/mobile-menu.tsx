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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center text-[var(--color-foreground)] md:hidden"
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

      {open && (
        <button
          type="button"
          aria-label="Chiudi menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          style={{ top: "var(--mobile-nav-h, 64px)" }}
        />
      )}

      <div
        className={`fixed inset-x-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)] transition-transform duration-200 md:hidden ${
          open ? "translate-y-0" : "-translate-y-[120%]"
        }`}
        style={{ top: "var(--mobile-nav-h, 64px)" }}
      >
        <nav className="container-xl flex flex-col py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-[var(--color-border)] py-4 text-base text-[var(--color-foreground)] transition-colors last:border-0 hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="py-4">
            <CartLink />
          </div>
        </nav>
      </div>
    </>
  );
}
