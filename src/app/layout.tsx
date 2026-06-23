import type { Metadata } from "next";
import { Arimo, Carlito, Archivo_Black } from "next/font/google";
import { FirebaseProvider } from "@/components/providers/firebase-provider";
import "./globals.css";

// Metric-compatible web equivalents so the Arial / Arial Black / Calibri look
// renders identically on every OS (self-hosted by next/font, no Google calls).
// Arimo → Arial (body), Carlito → Calibri (subtitles), Archivo Black → Arial Black (titles).
const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const carlito = Carlito({
  variable: "--font-carlito",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
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
      className={`${arimo.variable} ${carlito.variable} ${archivoBlack.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
