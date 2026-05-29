"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { verifySessionCookie } from "@/lib/firebase/auth";
import { COLLECTIONS } from "@/lib/constants";
import { sendChatNotificationEmail } from "@/lib/email/chat-notification";
import type { ConversationDoc, MessageDoc } from "@/types";

const MAX_LEN = 2000;
const PREVIEW_LEN = 140;

type ActionResult<T = undefined> =
  | (T extends undefined ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  return verifySessionCookie(sessionCookie);
}

function validateContent(raw: string): { ok: true; content: string } | { ok: false; error: string } {
  const content = raw.trim();
  if (!content) return { ok: false, error: "Il messaggio non può essere vuoto." };
  if (content.length > MAX_LEN)
    return { ok: false, error: `Messaggio troppo lungo (max ${MAX_LEN} caratteri).` };
  return { ok: true, content };
}

/* ──────────────────────────── Customer → admin ──────────────────────────── */

export async function sendCustomerMessage(content: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user) return { ok: false, error: "Sessione scaduta. Accedi di nuovo." };

  const validated = validateContent(content);
  if (!validated.ok) return validated;

  let userName = user.email;
  try {
    const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(user.uid).get();
    if (userDoc.exists) {
      userName = (userDoc.data()?.displayName as string | undefined) ?? user.email;
    }
  } catch {
    // Best-effort; fall back to email.
  }

  const conversationRef = adminDb.collection(COLLECTIONS.CONVERSATIONS).doc(user.uid);
  const now = new Date().toISOString();
  const messageRef = conversationRef.collection(COLLECTIONS.MESSAGES).doc();

  const conv = await conversationRef.get();
  const isNew = !conv.exists;

  const message: MessageDoc = {
    id: messageRef.id,
    senderId: user.uid,
    senderRole: "customer",
    content: validated.content,
    createdAt: now,
  };

  const conversationData: Partial<ConversationDoc> & Pick<ConversationDoc, "id" | "userId" | "userEmail" | "userName" | "lastMessageAt" | "lastMessagePreview" | "unreadByAdmin" | "unreadByCustomer"> = {
    id: user.uid,
    userId: user.uid,
    userEmail: user.email,
    userName,
    lastMessageAt: now,
    lastMessagePreview: validated.content.slice(0, PREVIEW_LEN),
    unreadByAdmin: true,
    unreadByCustomer: false,
  };

  if (isNew) {
    conversationData.createdAt = now;
  }

  try {
    const batch = adminDb.batch();
    batch.set(messageRef, message);
    batch.set(conversationRef, conversationData, { merge: true });
    await batch.commit();
  } catch (e) {
    console.error("sendCustomerMessage failed", e);
    return { ok: false, error: "Invio non riuscito. Riprova." };
  }

  // Best-effort email notification to Lucrezia; never blocks message delivery.
  await sendChatNotificationEmail({
    userId: user.uid,
    userName,
    userEmail: user.email,
    content: validated.content,
  });

  revalidatePath("/account/messaggi");
  revalidatePath("/admin/messaggi");
  revalidatePath(`/admin/messaggi/${user.uid}`);

  return { ok: true };
}

/* ──────────────────────────── Admin → customer ──────────────────────────── */

export async function sendAdminMessage(
  conversationId: string,
  content: string,
): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "admin")
    return { ok: false, error: "Non autorizzato." };

  const validated = validateContent(content);
  if (!validated.ok) return validated;

  const conversationRef = adminDb
    .collection(COLLECTIONS.CONVERSATIONS)
    .doc(conversationId);
  const conv = await conversationRef.get();
  if (!conv.exists)
    return { ok: false, error: "Conversazione non trovata." };

  const now = new Date().toISOString();
  const messageRef = conversationRef.collection(COLLECTIONS.MESSAGES).doc();

  const message: MessageDoc = {
    id: messageRef.id,
    senderId: user.uid,
    senderRole: "admin",
    content: validated.content,
    createdAt: now,
  };

  try {
    const batch = adminDb.batch();
    batch.set(messageRef, message);
    batch.update(conversationRef, {
      lastMessageAt: now,
      lastMessagePreview: validated.content.slice(0, PREVIEW_LEN),
      unreadByAdmin: false,
      unreadByCustomer: true,
    });
    await batch.commit();
  } catch (e) {
    console.error("sendAdminMessage failed", e);
    return { ok: false, error: "Invio non riuscito. Riprova." };
  }

  revalidatePath("/account/messaggi");
  revalidatePath("/admin/messaggi");
  revalidatePath(`/admin/messaggi/${conversationId}`);

  return { ok: true };
}

/* ──────────────────────────── Read markers ──────────────────────────── */

export async function markConversationRead(
  role: "customer" | "admin",
  conversationId?: string,
): Promise<void> {
  const user = await getAuthUser();
  if (!user) return;

  const id = role === "customer" ? user.uid : conversationId;
  if (!id) return;
  if (role === "admin" && user.role !== "admin") return;

  const field = role === "customer" ? "unreadByCustomer" : "unreadByAdmin";

  try {
    await adminDb.collection(COLLECTIONS.CONVERSATIONS).doc(id).update({
      [field]: false,
    });
  } catch {
    // Conversation may not exist yet; nothing to mark.
  }
}

/* ──────────────────────────── Server-side reads ──────────────────────────── */

export async function getConversationForUser(
  userId: string,
): Promise<ConversationDoc | null> {
  try {
    const doc = await adminDb.collection(COLLECTIONS.CONVERSATIONS).doc(userId).get();
    if (!doc.exists) return null;
    return doc.data() as ConversationDoc;
  } catch {
    return null;
  }
}

export async function getMessagesForUser(userId: string): Promise<MessageDoc[]> {
  try {
    const snap = await adminDb
      .collection(COLLECTIONS.CONVERSATIONS)
      .doc(userId)
      .collection(COLLECTIONS.MESSAGES)
      .orderBy("createdAt", "asc")
      .get();
    return snap.docs.map((d) => d.data() as MessageDoc);
  } catch (e) {
    console.error("getMessagesForUser failed", e);
    return [];
  }
}

export async function getAllConversations(): Promise<ConversationDoc[]> {
  try {
    const snap = await adminDb.collection(COLLECTIONS.CONVERSATIONS).get();
    return snap.docs
      .map((d) => d.data() as ConversationDoc)
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  } catch (e) {
    console.error("getAllConversations failed", e);
    return [];
  }
}
