"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
}

export function NavLinks({ links }: Props) {
  const pathname = usePathname();

  // Mark the most specific matching link (longest prefix), matching the
  // mobile menu's behaviour.
  const activeHref = links
    .filter((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {links.map((link) => {
        const active = link.href === activeHref;
        return (
          <Link
            key={link.href}
            href={link.href}
            data-active={active}
            aria-current={active ? "page" : undefined}
            className={`link-underline text-sm tracking-wide ${
              active
                ? "text-[var(--color-foreground)]"
                : "text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
