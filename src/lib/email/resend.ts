import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }
  _resend = new Resend(key);
  return _resend;
}

// Lazy proxy so the module is safe to import at build time without env vars set.
export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    const instance = getResend();
    const value = instance[prop as keyof Resend];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(instance) : value;
  },
});

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Lucrezia <noreply@lucrezia.it>";

export const ADMIN_EMAIL =
  process.env.LUCREZIA_NOTIFICATION_EMAIL ?? "info@lucrezia.it";
