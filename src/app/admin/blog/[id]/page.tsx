import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminPostById } from "@/lib/content/posts";
import { PostForm } from "../_components/post-form";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Modifica articolo | Admin" };

export const dynamic = "force-dynamic";

export default async function AdminEditArticoloPage({ params }: Props) {
  const { id } = await params;
  const post = await getAdminPostById(id);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 font-serif text-3xl text-[var(--color-foreground)] sm:mb-10">
        Modifica articolo
      </h1>
      <PostForm post={post} />
    </div>
  );
}
