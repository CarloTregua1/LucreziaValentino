import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getConversationForUser,
  getMessagesForUser,
} from "@/lib/actions/messages";
import { AdminThread } from "./admin-thread";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Conversazione | Admin" };
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminConversationPage({ params }: Props) {
  const { id } = await params;
  const [conversation, messages] = await Promise.all([
    getConversationForUser(id),
    getMessagesForUser(id),
  ]);

  if (!conversation) notFound();

  return (
    <div>
      <Link
        href="/admin/messaggi"
        className="link-underline text-xs uppercase tracking-widest text-[var(--color-muted)]"
      >
        ← Tutte le conversazioni
      </Link>

      <div className="mt-4 border-b border-[var(--color-border)] pb-6">
        <h1 className="font-serif text-3xl text-[var(--color-foreground)]">
          {conversation.userName || conversation.userEmail}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {conversation.userEmail} · cliente dal{" "}
          {formatDate(conversation.createdAt)}
        </p>
      </div>

      <AdminThread conversationId={id} initialMessages={messages} />
    </div>
  );
}
