"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/constants";
import type { ConversationDoc } from "@/types";

interface Props {
  initial: ConversationDoc[];
}

export function ConversationsList({ initial }: Props) {
  const [items, setItems] = useState<ConversationDoc[]>(initial);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      orderBy("lastMessageAt", "desc"),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => d.data() as ConversationDoc));
      },
      (err) => {
        console.warn("Live conversations subscription denied:", err.message);
      },
    );
    return unsub;
  }, []);

  if (items.length === 0) {
    return (
      <div className="mt-8 border border-[var(--color-border)] p-12 text-center">
        <p className="text-[var(--color-muted)]">
          Nessun messaggio ancora. Quando un cliente ti scriverà, la
          conversazione apparirà qui in tempo reale.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((c) => (
        <li key={c.id}>
          <Link
            href={`/admin/messaggi/${c.id}`}
            className="grid grid-cols-[1fr_auto] gap-4 py-5 transition-colors hover:bg-[var(--color-card-subtle)]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-serif text-lg text-[var(--color-foreground)]">
                  {c.userName || c.userEmail}
                </p>
                {c.unreadByAdmin && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </div>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                {c.userEmail}
              </p>
              <p
                className={`mt-2 truncate text-sm ${
                  c.unreadByAdmin
                    ? "text-[var(--color-foreground)]"
                    : "text-[var(--color-foreground-soft)]"
                }`}
              >
                {c.lastMessagePreview}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                {formatRelative(c.lastMessageAt)}
              </p>
              {c.unreadByAdmin && (
                <span className="mt-2 inline-block bg-[var(--color-accent-light)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--color-accent-deep)]">
                  Nuovo
                </span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function formatRelative(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const min = Math.floor(diffMs / 60_000);
    if (min < 1) return "Adesso";
    if (min < 60) return `${min} min fa`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} ore fa`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `${day} g fa`;
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
    }).format(d);
  } catch {
    return "";
  }
}
