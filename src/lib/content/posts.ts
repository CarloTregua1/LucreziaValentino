import { adminDb } from "@/lib/firebase/admin";
import { getStaticPosts, type BlogPost } from "@/lib/content/blog";
import type { PostDoc } from "@/types";

export const POSTS_COLLECTION = "posts";
function toBlogPost(doc: PostDoc): BlogPost {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.subtitle,
    category: "",
    date: (doc.publishedAt ?? doc.createdAt).slice(0, 10),
    image: doc.image,
    imageAlt: doc.title,
    body: doc.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

/** Every post in Firestore, drafts included, newest first. Admin only. */
export async function getAdminPosts(): Promise<PostDoc[]> {
  try {
    const snap = await adminDb.collection(POSTS_COLLECTION).get();
    return snap.docs
      .map((d) => d.data() as PostDoc)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (e) {
    console.error("getAdminPosts failed", e);
    return [];
  }
}

export async function getAdminPostById(id: string): Promise<PostDoc | null> {
  try {
    const doc = await adminDb.collection(POSTS_COLLECTION).doc(id).get();
    return doc.exists ? (doc.data() as PostDoc) : null;
  } catch (e) {
    console.error("getAdminPostById failed", e);
    return null;
  }
}

/** What readers see: the hand-written articles plus published posts, newest first. */
export async function getAllPosts(): Promise<BlogPost[]> {
  const published = (await getAdminPosts())
    .filter((p) => p.status === "published")
    .map(toBlogPost);
  return [...getStaticPosts(), ...published].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fixed = getStaticPosts().find((p) => p.slug === slug);
  if (fixed) return fixed;

  try {
    const snap = await adminDb
      .collection(POSTS_COLLECTION)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0].data() as PostDoc;
    return doc.status === "published" ? toBlogPost(doc) : null;
  } catch (e) {
    console.error("getPostBySlug failed", e);
    return null;
  }
}
