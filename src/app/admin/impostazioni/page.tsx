import type { Metadata } from "next";
import { getSettings } from "@/lib/actions/settings";
import { SettingsForm } from "./_components/settings-form";

export const metadata: Metadata = { title: "Impostazioni | Admin" };

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl text-[var(--color-foreground)]">Impostazioni</h1>
      <p className="mt-3 text-sm text-[var(--color-muted)]">
        Dati di contatto e tagline mostrate sul sito pubblico.
      </p>
      <div className="mt-10">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
