"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  settingsSchema,
  type SettingsFormValues,
  type SettingsInput,
} from "@/lib/schemas/settings";
import { saveSettings } from "@/lib/actions/settings";
import type { SettingsDoc } from "@/types";

interface Props {
  settings: SettingsDoc;
}

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormValues, unknown, SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      shopName: settings.shopName,
      shopEmail: settings.shopEmail,
      shopPhone: settings.shopPhone,
      vatNumber: settings.vatNumber,
      address: settings.address,
      openingHours: settings.openingHours,
      responseTime: settings.responseTime,
      instagramUrl: settings.instagramUrl,
      linkedinUrl: settings.linkedinUrl,
      heroTagline: settings.heroTagline,
      footerTagline: settings.footerTagline,
    },
  });

  async function onSubmit(data: SettingsInput) {
    setServerError(null);
    const result = await saveSettings(data);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setSavedAt(new Date());
    router.refresh();
  }

  const labelClass =
    "block text-xs font-medium uppercase tracking-widest text-[var(--color-muted)] mb-1.5";
  const inputClass =
    "w-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm text-[var(--color-foreground)] focus:border-[var(--color-accent)] focus:outline-none";
  const errorClass = "mt-1 text-xs text-[var(--color-error)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {serverError && (
        <div className="border border-[var(--color-error)] bg-red-50 px-4 py-3 text-sm text-[var(--color-error)]">
          {serverError}
        </div>
      )}

      {savedAt && !isDirty && (
        <div className="border border-[var(--color-border)] bg-[var(--color-card-subtle)] px-4 py-3 text-sm text-[var(--color-muted)]">
          Modifiche salvate alle{" "}
          {savedAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}.
        </div>
      )}

      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Negozio</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome attività *</label>
            <input {...register("shopName")} className={inputClass} />
            {errors.shopName && <p className={errorClass}>{errors.shopName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" {...register("shopEmail")} className={inputClass} />
            {errors.shopEmail && <p className={errorClass}>{errors.shopEmail.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Telefono</label>
            <input {...register("shopPhone")} className={inputClass} placeholder="+39 …" />
          </div>
          <div>
            <label className={labelClass}>Partita IVA</label>
            <input {...register("vatNumber")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sede / indirizzo</label>
            <input {...register("address")} className={inputClass} placeholder="Città, Provincia" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Comunicazione</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Orari di apertura</label>
            <input
              {...register("openingHours")}
              className={inputClass}
              placeholder="Lun–Ven 9:00–18:00"
            />
          </div>
          <div>
            <label className={labelClass}>Tempo di risposta</label>
            <input
              {...register("responseTime")}
              className={inputClass}
              placeholder="Entro 24 ore lavorative"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tagline homepage</label>
            <textarea {...register("heroTagline")} rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tagline footer</label>
            <textarea {...register("footerTagline")} rows={2} className={inputClass} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl text-[var(--color-foreground)]">Social</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Instagram</label>
            <input
              {...register("instagramUrl")}
              className={inputClass}
              placeholder="https://instagram.com/…"
            />
            {errors.instagramUrl && (
              <p className={errorClass}>{errors.instagramUrl.message}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input
              {...register("linkedinUrl")}
              className={inputClass}
              placeholder="https://linkedin.com/in/…"
            />
            {errors.linkedinUrl && (
              <p className={errorClass}>{errors.linkedinUrl.message}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-foreground)] px-8 py-3 text-sm text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] disabled:opacity-50"
        >
          {isSubmitting ? "Salvataggio…" : "Salva impostazioni"}
        </button>
      </div>
    </form>
  );
}
