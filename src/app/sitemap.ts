import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lucrezia-shop.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/servizi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/chi-siamo`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic service routes will be added here in Phase 3 when
  // products are fetched from Firestore via the Admin SDK.

  return staticRoutes;
}
