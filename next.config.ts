import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // 90 is used by the brochure plates: they are dense infographics and the
    // default 75 smudges their small text.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    // Keep the opener→popup reference valid for Firebase signInWithPopup
    // (Google sign-in) so the COOP "window.closed" warning doesn't fire.
    return [
      {
        source: "/:path(login|registrati)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
