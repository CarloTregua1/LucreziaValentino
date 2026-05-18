import Link from "next/link";

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
            href="/prodotti"
            className="text-sm tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Collezione
          </Link>
          <Link
            href="/chi-siamo"
            className="text-sm tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Chi siamo
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/account"
            className="text-sm tracking-wide text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            Account
          </Link>
          <Link
            href="/carrello"
            className="text-sm tracking-wide text-[var(--color-foreground)]"
          >
            Carrello (0)
          </Link>
        </div>
      </div>
    </header>
  );
}
