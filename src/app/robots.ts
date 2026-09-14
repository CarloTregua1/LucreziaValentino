import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = appUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
