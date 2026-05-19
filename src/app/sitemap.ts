import type { MetadataRoute } from "next";
import { getServizi } from "@/lib/actions/servizi";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://lucrezia-shop.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/servizi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/chi-siamo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const servizi = await getServizi("published");
  const serviceRoutes: MetadataRoute.Sitemap = servizi.map((s) => ({
    url: `${baseUrl}/servizi/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
