import { adminAuth } from "./admin";

export async function verifySessionCookie(
  cookie: string
): Promise<{ uid: string; email: string; role: string } | null> {
  try {
    const decoded = await adminAuth.verifySessionCookie(cookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      role: (decoded["role"] as string) ?? "customer",
    };
  } catch {
    return null;
  }
}

export async function setAdminClaim(uid: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, { role: "admin" });
}

export async function createSessionCookie(
  idToken: string,
  expiresIn = 60 * 60 * 24 * 14 * 1000 // 14 days
): Promise<string> {
  return adminAuth.createSessionCookie(idToken, { expiresIn });
}
