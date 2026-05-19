import Link from "next/link";

const COLUMNS = [
  {
    title: "Studio",
    links: [
      { href: "/servizi", label: "Servizi" },
      { href: "/chi-siamo", label: "Chi sono" },
    ],
  },
  {
    title: "Assistenza",
    links: [
      { href: "/account/messaggi", label: "Contattami" },
      { href: "/account/ordini", label: "I miei ordini" },
      { href: "/account", label: "Area riservata" },
    ],
  },
  {
    title: "Legale",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/termini", label: "Termini" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-foreground)] text-[var(--color-background)]">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-xl flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
          <div>
            <p
              className="eyebrow"
              style={{ color: "var(--color-accent-light)" }}
            >
              Pronto a fare il punto?
            </p>
            <p className="mt-3 font-serif text-3xl leading-tight text-[var(--color-background)] sm:text-4xl">
              Scrivimi.{" "}
              <span className="serif-italic text-[var(--color-accent-light)]">
                Ti rispondo io.
              </span>
            </p>
          </div>
          <Link
            href="/account/messaggi"
            className="inline-block border border-[var(--color-background)] px-8 py-3 text-sm tracking-widest uppercase text-[var(--color-background)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
          >
            Invia un messaggio
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-xl py-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl leading-none text-[var(--color-background)]">
              Lucrezia
              <span className="ml-2 serif-italic text-[var(--color-accent-light)]">
                studio
              </span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted-light)]">
              Consulenza in bonus e fiscalità per privati e aziende. Ogni
              percorso è costruito su misura, con priorità chiare e scadenze
              monitorate.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <p
                className="eyebrow"
                style={{ color: "var(--color-accent-light)" }}
              >
                {col.title}
              </p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-[var(--color-background)]/90 hover:text-[var(--color-background)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <p
              className="eyebrow"
              style={{ color: "var(--color-accent-light)" }}
            >
              Contatti
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-background)]/90">
              <li>Lun – Ven · 9:00 – 18:00</li>
              <li>Italia · da remoto</li>
              <li>
                <a
                  href="mailto:ciao@lucrezia.it"
                  className="link-underline"
                >
                  ciao@lucrezia.it
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-widest uppercase text-[var(--color-muted-light)]">
            © {new Date().getFullYear()} Lucrezia · Tutti i diritti riservati
          </p>
          <p className="text-xs tracking-widest uppercase text-[var(--color-muted-light)]">
            Progettato con cura, in Italia
          </p>
        </div>
      </div>
    </footer>
  );
}
