import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { FirebaseProvider } from "@/components/providers/firebase-provider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Lucrezia Valentino",
    default: "Lucrezia Valentino — Educatrice finanziaria e formatrice",
  },
  description:
    "Educazione e consulenza finanziaria, credito, CAF e Patronato, formazione, orientamento e microcredito. Competenza, etica e ascolto al servizio delle tue scelte.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://lucrezia-shop.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Lucrezia Valentino",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {/* Mark JS as available before paint so scroll-reveal can hide content
            up front without a flash (and without hiding it for no-JS users). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js-reveal')",
          }}
        />
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
