"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  markConversationRead,
  sendAdminMessage,
} from "@/lib/actions/messages";
import { COLLECTIONS } from "@/lib/constants";
import type { MessageDoc } from "@/types";

interface Props {
  conversationId: string;
  initialMessages: MessageDoc[];
}

export function AdminThread({ conversationId, initialMessages }: Props) {
  const [messages, setMessages] = useState<MessageDoc[]>(initialMessages);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const messagesRef = collection(
      doc(collection(db, COLLECTIONS.CONVERSATIONS), conversationId),
      COLLECTIONS.MESSAGES,
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => d.data() as MessageDoc));
      },
      (err) => {
        console.warn("Live admin thread subscription denied:", err.message);
      },
    );
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      void markConversationRead("admin", conversationId);
    }
  }, [messages.length, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = content.trim();
    if (!trimmed) return;
    setContent("");
    startTransition(async () => {
      const result = await sendAdminMessage(conversationId, trimmed);
      if (!result.ok) {
        setError(result.error);
        setContent(trimmed);
        textareaRef.current?.focus();
        return;
      }
      // Show the reply immediately. If the live subscription is active it
      // replaces the whole array, so the id check avoids a duplicate.
      setMessages((prev) =>
        prev.some((m) => m.id === result.data.id)
          ? prev
          : [...prev, result.data],
      );
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex max-h-[60vh] min-h-[420px] flex-col overflow-hidden border border-[var(--color-border)]">
        <div className="flex-1 overflow-y-auto bg-[var(--color-card-subtle)] p-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[280px] items-center justify-center text-center">
              <p className="text-sm text-[var(--color-muted)]">
                Nessun messaggio in questa conversazione.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`flex ${
                    m.senderRole === "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] ${
                      m.senderRole === "admin"
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                        : "border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)]"
                    } px-5 py-4`}
                  >
                    {m.senderRole === "customer" && (
                      <p className="mb-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                        Cliente
                      </p>
                    )}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {m.content}
                    </p>
                    <p
                      className={`mt-2 text-[10px] uppercase tracking-widest ${
                        m.senderRole === "admin"
                          ? "text-[var(--color-muted-light)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {formatTime(m.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi una risposta…"
          rows={3}
          maxLength={2000}
          className="w-full resize-none border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm leading-relaxed text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] focus:outline-none"
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            {content.length}/2000 · ⌘ + Invio
          </p>
          <button
            type="submit"
            disabled={pending || !content.trim()}
            className="bg-[var(--color-foreground)] px-8 py-3 text-sm tracking-wide text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Invio…" : "Rispondi"}
          </button>
        </div>
      </form>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    return new Intl.DateTimeFormat("it-IT", {
      ...(sameDay ? {} : { day: "2-digit", month: "short" }),
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}
