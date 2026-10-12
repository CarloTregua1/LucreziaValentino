"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePost, setPostStatus } from "@/lib/actions/posts";
import type { PostDoc } from "@/types";

interface Props {
  post: PostDoc;
}

export function PostRowActions({ post }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const published = post.status === "published";

  async function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setBusy(true);
    const result = await action();
    if (!result.ok) alert(result.error);
    router.refresh();
    setBusy(false);
  }

  function handleDelete() {
    if (!confirm(`Eliminare "${post.title}"? L'operazione è irreversibile.`)) return;
    run(() => deletePost(post.id));
  }

  // Padded so each one is a comfortable target for a thumb.
  const action =
    "-mx-1 px-1 py-2 text-sm underline-offset-2 hover:underline disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <Link
        href={`/admin/blog/${post.id}`}
        className={`${action} text-[var(--color-foreground)]`}
      >
        Modifica
      </Link>
      <button
        type="button"
        onClick={() => run(() => setPostStatus(post.id, published ? "draft" : "published"))}
        disabled={busy}
        className={`${action} text-[var(--color-muted)] hover:text-[var(--color-foreground)]`}
      >
        {published ? "Riporta in bozza" : "Pubblica"}
      </button>
      {published && (
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          className={`${action} text-[var(--color-muted)] hover:text-[var(--color-foreground)]`}
        >
          Vedi sul sito
        </Link>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className={`${action} text-[var(--color-error)]`}
      >
        Elimina
      </button>
    </div>
  );
}
