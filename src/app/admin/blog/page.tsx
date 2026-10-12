import type { Metadata } from "next";
import Link from "next/link";
import { getAdminPosts } from "@/lib/content/posts";
import { formatPostDate } from "@/lib/content/blog";
import { PostRowActions } from "./_components/post-row-actions";

export const metadata: Metadata = { title: "Blog | Admin" };

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Blog</h1>
        <Link
          href="/admin/blog/nuovo"
          className="bg-[var(--color-foreground)] px-5 py-2.5 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]"
        >
          + Nuovo articolo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[var(--color-muted)]">Nessun articolo ancora.</p>
          <Link
            href="/admin/blog/nuovo"
            className="mt-4 inline-block text-sm text-[var(--color-accent)] underline underline-offset-2"
          >
            Scrivi il primo articolo
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-[var(--color-border)] border border-[var(--color-border)] bg-[var(--color-card)]">
          {posts.map((post) => (
            <li key={post.id} className="flex gap-4 p-4 sm:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt=""
                className="h-16 w-16 shrink-0 border border-[var(--color-border)] bg-[var(--color-card-subtle)] object-cover sm:h-20 sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-[var(--color-card-subtle)] text-[var(--color-muted)]"
                    }`}
                  >
                    {post.status === "published" ? "Pubblicato" : "Bozza"}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {formatPostDate(post.publishedAt ?? post.createdAt)}
                  </span>
                </div>
                <p className="mt-2 break-words font-medium text-[var(--color-foreground)]">
                  {post.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
                  {post.subtitle}
                </p>
                <div className="mt-2">
                  <PostRowActions post={post} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs text-[var(--color-muted)]">
        Qui trovi gli articoli scritti da questo pannello. I tre articoli già
        presenti sul blog fanno parte del sito e non compaiono in questo elenco.
      </p>
    </div>
  );
}
