"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/firebase/session";
import type { OrderDoc } from "@/types";

export async function getOrdersForCurrentUser(): Promise<OrderDoc[]> {
  const user = await getSessionUser();
  if (!user) return [];

  try {
    const snap = await adminDb.collection("ordini").get();
    const mine = snap.docs
      .map((d) => d.data() as OrderDoc)
      .filter((o) => o.userId === user.uid)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return mine;
  } catch {
    return [];
  }
}

/** An order, for the admin or for the customer it belongs to. */
export async function getOrderById(id: string): Promise<OrderDoc | null> {
  const user = await getSessionUser();
  if (!user) return null;

  try {
    const doc = await adminDb.collection("ordini").doc(id).get();
    if (!doc.exists) return null;
    const order = doc.data() as OrderDoc;
    return user.role === "admin" || order.userId === user.uid ? order : null;
  } catch {
    return null;
  }
}
