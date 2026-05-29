import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  formatPostDate,
} from "@/lib/content/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "Articolo non trovato" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="border-b border-[var(--color-border)]">
        <div className="container-xl flex items-center gap-2 py-4 text-xs uppercase tracking-widest text-[var(--color-muted)]">
          <Link href="/" className="link-underline hover:text-[var(--color-foreground)]">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/blog"
            className="link-underline hover:text-[var(--color-foreground)]"
          >
            Blog
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--color-foreground)] normal-case tracking-normal">
            {post.title}
          </span>
        </div>
      </div>

      <article className="section-spacing">
        <div className="container-xl">
          {/* Header */}
          <header className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
              <span className="text-[var(--color-accent)]">{post.category}</span>
              <span aria-hidden>·</span>
              <span>{formatPostDate(post.date)}</span>
            </div>
            <h1 className="mt-5 font-serif text-[var(--text-h1)] leading-[1.05] text-[var(--color-foreground)]">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-foreground-soft)]">
              {post.excerpt}
            </p>
          </header>

          {/* Cover */}
          <div className="relative mx-auto mt-12 aspect-[16/9] max-w-4xl overflow-hidden bg-[var(--color-card-subtle)]">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              priority
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 64rem"
            />
          </div>

          {/* Body */}
          <div className="mx-auto mt-14 max-w-2xl space-y-6 text-lg leading-relaxed text-[var(--color-foreground-soft)]">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Signature */}
          <p className="mx-auto mt-12 max-w-2xl font-serif italic text-2xl text-[var(--color-accent)]">
            — Lucrezia
          </p>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-spacing border-t border-[var(--color-border)] bg-[var(--color-cream-deep)]">
          <div className="container-xl">
            <p className="section-index">Continua a leggere</p>
            <div className="mt-10 grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col bg-[var(--color-background)] p-8 transition-colors hover:bg-[var(--color-accent-light)] sm:p-10"
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    <span className="text-[var(--color-accent)]">
                      {p.category}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{formatPostDate(p.date)}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-[var(--color-foreground)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-soft)]">
                    {p.excerpt}
                  </p>
                  <span className="mt-6 text-sm text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
                    Leggi →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
