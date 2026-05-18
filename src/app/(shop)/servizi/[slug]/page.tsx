import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug,
    description: `Scopri ${slug} — consulenza di Lucrezia.`,
  };
}

export default async function ServizioDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <section className="section-spacing">
      <div className="container-xl">
        <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
          {slug}
        </h1>
        <p className="mt-6 text-[var(--color-muted)]">Dettaglio servizio — in costruzione.</p>
      </div>
    </section>
  );
}
