import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Convenzioni",
  description:
    "Convenzione PACard — condizioni agevolate su educazione finanziaria, consulenza del credito, orientamento e formazione per i dipendenti della Pubblica Amministrazione e i loro familiari.",
};

export default function ConvenzioniPage() {
  return (
    <div>
      <section className="section-spacing">
        {/* Two columns on desktop, mirroring the servizio detail page: the
            locandina on the left, the heading and copy on the right, tops
            level. The order utilities keep the heading first when the grid
            stacks, so on a phone the page still opens with its own title
            rather than a full-width poster.

            Sizes come from the standard text-* utilities rather than
            text-[var(--text-h1)], which Tailwind v4 compiles to a color,
            not a font-size. */}
        <div className="container-xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Locandina — carries the detail (services, discount, contacts)
                at a size the page can't show legibly, so it opens full size. */}
            <div className="order-2 lg:order-1 lg:col-span-7">
              <a
                href="/images/convenzione-pacard.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-accent)]"
              >
                <Image
                  src="/images/convenzione-pacard.jpeg"
                  alt="Locandina della convenzione PACard: 20% di sconto sui servizi in convenzione — educazione finanziaria, consulenza del credito, orientamento professionale e corsi di formazione — per i dipendenti della Pubblica Amministrazione e i loro familiari."
                  width={1254}
                  height={1254}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
                <span className="block px-5 py-4 text-sm tracking-wide text-[var(--color-foreground-soft)] transition-colors group-hover:text-[var(--color-foreground)]">
                  Apri la locandina a dimensione piena →
                </span>
              </a>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <p className="section-index">· Convenzioni</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-[var(--color-foreground)] sm:text-5xl">
                Convenzione{" "}
                <span className="serif-italic text-[var(--color-accent)]">
                  PACard
                </span>
              </h1>

              <div className="mt-8 space-y-5 leading-relaxed text-[var(--color-foreground-soft)]">
                <p>
                  Sono convenzionata con PACard – Convenzioni per il mondo PA,
                  il circuito dedicato ai dipendenti della Pubblica
                  Amministrazione e ai loro familiari.
                </p>
                <p>
                  La convenzione consente agli aventi diritto di accedere a
                  condizioni agevolate su specifici servizi di educazione
                  finanziaria, consulenza del credito, orientamento e
                  formazione.
                </p>
                <p>
                  Scopri i servizi convenzionati, le agevolazioni previste e le
                  modalità di accesso.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <Link
                  href="/servizi"
                  className="link-underline self-start text-sm text-[var(--color-foreground)]"
                >
                  Vedi tutte le aree di competenza →
                </Link>
                <Link
                  href="/account/messaggi"
                  className="link-underline self-start text-sm text-[var(--color-foreground)]"
                >
                  Richiedi informazioni sulla convenzione →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
