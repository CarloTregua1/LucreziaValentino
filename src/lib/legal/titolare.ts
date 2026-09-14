import { getSettings } from "@/lib/actions/settings";

/**
 * Identity of the data controller / seller shown on the legal pages.
 *
 * Sourced from the admin settings so Lucrezia can keep P.IVA and the registered
 * address current without a code change; the fallbacks mirror the contacts the
 * footer already publishes, so the pages are never blank if the settings doc
 * hasn't been filled in yet. `vatNumber` and `address` have no sensible default
 * — the pages omit those lines while they're empty.
 */
export interface Titolare {
  name: string;
  email: string;
  phone: string;
  vatNumber: string;
  address: string;
}

const FALLBACK = {
  name: "Lucrezia Valentino",
  email: "s.lucreziavalentino@gmail.com",
  phone: "+39 350 850 2846",
} as const;

export async function getTitolare(): Promise<Titolare> {
  const settings = await getSettings();
  return {
    name: settings.shopName.trim() || FALLBACK.name,
    email: settings.shopEmail.trim() || FALLBACK.email,
    phone: settings.shopPhone.trim() || FALLBACK.phone,
    vatNumber: settings.vatNumber.trim(),
    address: settings.address.trim(),
  };
}

/** The controller's contact block, reused verbatim across the three pages. */
export function titolareLines(t: Titolare): string[] {
  return [
    t.name,
    t.address,
    t.vatNumber ? `P. IVA ${t.vatNumber}` : "",
    t.email,
    t.phone,
  ].filter(Boolean);
}
