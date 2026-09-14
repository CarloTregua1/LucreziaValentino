import type { MetadataRoute } from "next";
import { getServizi } from "@/lib/actions/servizi";
import { getAllPosts } from "@/lib/content/blog";
import { appUrl } from "@/lib/app-url";
import { LEGAL_UPDATED_AT_ISO } from "@/lib/legal/dates";

export const dynamic = "force-dynamic";

/**
 * When each hand-written page last changed, from its git history. These used to
 * pass `new Date()`, which meant every static route claimed to have been
 * modified at the instant the crawler asked — two fetches seconds apart
 * returned different timestamps. Google discounts lastmod it can see is
 * unreliable, so the field was worse than useless.
 *
 * Bump the entry when you materially change that page's content. The listing
 * and detail routes below don't appear here: their dates come from the data
 * they render, which is already accurate and maintains itself.
 */
const PAGE_MODIFIED: Record<string, string> = {
  "": "2026-09-08",
  "/chi-siamo": "2026-07-02",
  "/convenzioni": "2026-09-08",
  "/privacy": LEGAL_UPDATED_AT_ISO,
  "/cookie-policy": LEGAL_UPDATED_AT_ISO,
  "/termini": LEGAL_UPDATED_AT_ISO,
};

function modified(path: string): Date {
  return new Date(`${PAGE_MODIFIED[path]}T00:00:00Z`);
}

/** Newest of a set of dates, ignoring anything unparseable. */
function newest(dates: Array<Date | undefined>, fallback: Date): Date {
  const times = dates
    .filter((d): d is Date => d instanceof Date && !Number.isNaN(d.getTime()))
    .map((d) => d.getTime());
  return times.length ? new Date(Math.max(...times)) : fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = appUrl();

  const servizi = await getServizi("published");
  const posts = getAllPosts();

  const servizioDates = servizi.map((s) =>
    s.updatedAt ? new Date(s.updatedAt) : undefined
  );
  const postDates = posts.map((p) => new Date(p.date));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: modified(""),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // Listing pages turn over whenever their contents do.
      url: `${baseUrl}/servizi`,
      lastModified: newest(servizioDates, modified("")),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: newest(postDates, modified("")),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chi-siamo`,
      lastModified: modified("/chi-siamo"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/convenzioni`,
      lastModified: modified("/convenzioni"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: modified("/privacy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: modified("/cookie-policy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termini`,
      lastModified: modified("/termini"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = servizi.map((s, i) => ({
    url: `${baseUrl}/servizi/${s.slug}`,
    lastModified: servizioDates[i] ?? modified(""),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p, i) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: postDates[i],
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
