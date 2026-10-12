import { cookies } from "next/headers";
import { verifySessionCookie } from "./auth";

export const NOT_ALLOWED =
  "Sessione scaduta o permessi insufficienti. Accedi di nuovo.";

/** The signed-in user whatever their role, or null. */
export async function getSessionUser() {
  const cookie = (await cookies()).get("session")?.value;
  return cookie ? verifySessionCookie(cookie) : null;
}

/**
 * The signed-in admin, or null. The proxy only keeps non-admins away from the
 * /admin pages; Server Actions and Route Handlers are reachable by direct POST
 * whatever page they were written for, so anything that writes has to check
 * for itself.
 */
export async function getAdminUser() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
