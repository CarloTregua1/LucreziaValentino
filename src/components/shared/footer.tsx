import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)]">
      <div className="container-xl py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="font-serif text-xl text-[var(--color-foreground)]">Lucrezia</p>
            <p className="mt-2 text-xs text-[var(--color-muted)]">Consulente in bonus e fiscalità</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Servizi
            </p>
            <Link href="/servizi" className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">Tutti i servizi</Link>
            <Link href="/chi-siamo" className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">Chi sono</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Assistenza
            </p>
            <Link href="/account/messaggi" className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">Contattami</Link>
            <Link href="/account/ordini" className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">I miei ordini</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Legale
            </p>
            <Link href="/privacy" className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">Privacy</Link>
            <Link href="/termini" className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)]">Termini</Link>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6">
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} Lucrezia. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
