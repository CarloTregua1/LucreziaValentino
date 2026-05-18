import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lucrezia-shop.vercel.app";

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
