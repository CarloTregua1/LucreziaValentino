import Link from "next/link";
import { CartLink } from "./cart-count";

const NAV_LINKS = [
  { href: "/servizi", label: "Servizi" },
  { href: "/chi-siamo", label: "Chi sono" },
  { href: "/account/messaggi", label: "Contatti" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-md">
      <div className="container-xl flex items-center justify-between py-5">
        <Link
          href="/"
          className="group flex items-baseline gap-2 text-[var(--color-foreground)]"
        >
          <span className="font-serif text-2xl leading-none tracking-tight">
            Lucrezia
          </span>
          <span
            aria-hidden
            className="hidden font-serif italic text-sm text-[var(--color-accent)] sm:inline"
          >
            studio
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm tracking-wide text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/account"
            className="link-underline hidden text-sm tracking-wide text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)] sm:inline-block"
          >
            Account
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
