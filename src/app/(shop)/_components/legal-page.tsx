import type { ReactNode } from "react";

export interface LegalSection {
  /** Anchor id — also the target of the sidebar index. */
  id: string;
  title: string;
  body: ReactNode;
}

interface Props {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  updatedAt: string;
  sections: LegalSection[];
  /** Optional closing note rendered under the last section. */
  footnote?: ReactNode;
}

/**
 * Shared shell for the three legal pages. Two columns on desktop: a sticky
 * index on the left, the text on the right, capped at a comfortable measure.
 * Headings use fixed Tailwind sizes rather than the --text-h* tokens, which
 * Tailwind reads as colours in arbitrary `text-[...]` values.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updatedAt,
  sections,
  footnote,
}: Props) {
  return (
    <div>
      <section className="section-spacing border-b border-[var(--color-border)]">
        <div className="container-xl">
          <p className="section-index">· {eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] text-[var(--color-foreground)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-[var(--color-foreground-soft)]">
            {intro}
          </p>
          <p className="mt-8 text-xs tracking-widest uppercase text-[var(--color-muted)]">
            Ultimo aggiornamento: {updatedAt}
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-xl grid gap-14 lg:grid-cols-12 lg:gap-20">
          <nav aria-label="Indice" className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow-muted">Indice</p>
              <ol className="mt-5 space-y-3">
                {sections.map((section, idx) => (
                  <li key={section.id} className="flex gap-3 text-sm">
                    <span className="font-serif text-[var(--color-accent)] tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${section.id}`}
                      className="link-underline text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)]"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="legal-prose min-w-0 lg:col-span-8">
            {sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-[var(--color-border)] pt-8 first:border-0 first:pt-0"
              >
                <h2 className="font-serif text-xl text-[var(--color-foreground)] sm:text-2xl">
                  <span className="mr-3 text-[var(--color-accent)] tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}

            {footnote ? (
              <p className="mt-14 border-t border-[var(--color-border)] pt-8 text-sm leading-relaxed text-[var(--color-muted)]">
                {footnote}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
