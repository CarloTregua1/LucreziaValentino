import type { Metadata } from "next";
import { getAllConversations } from "@/lib/actions/messages";
import { ConversationsList } from "./_components/conversations-list";

export const metadata: Metadata = { title: "Messaggi | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const conversations = await getAllConversations();
  const unread = conversations.filter((c) => c.unreadByAdmin).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-foreground)]">
            Messaggi
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {conversations.length} conversazioni totali
            {unread > 0 && (
              <span className="ml-2 text-[var(--color-accent-deep)]">
                · {unread} da leggere
              </span>
            )}
          </p>
        </div>
      </div>

      <ConversationsList initial={conversations} />
    </div>
  );
}
