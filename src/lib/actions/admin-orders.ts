"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getAdminUser } from "@/lib/firebase/session";
import type { OrderDoc } from "@/types";

export async function getAllOrders(): Promise<OrderDoc[]> {
  if (!(await getAdminUser())) return [];

  try {
    const snap = await adminDb.collection("ordini").get();
    return snap.docs
      .map((d) => d.data() as OrderDoc)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}
