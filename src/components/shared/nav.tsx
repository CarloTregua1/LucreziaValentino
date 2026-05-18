import Link from "next/link";
import { CartLink } from "./cart-count";

export function Nav() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="container-xl flex items-center justify-between py-5">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-[var(--color-foreground)]"
        >
          Lucrezia
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/servizi"
            className="text-sm tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Servizi
          </Link>
          <Link
            href="/chi-siamo"
            className="text-sm tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Chi sono
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/account"
            className="text-sm tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Account
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
