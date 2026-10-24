import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://saturnushuset.se";
const TITLE = "Saturnushuset";
const TITLE_FULL = "Saturnushuset — en plats för kultur i Malmö";
const DESCRIPTION =
  "Saturnushuset i Malmö får nytt liv som en plats för kultur. I hörnet Lantmannagatan–Ystadsgatan väcker PLX Kulturförening huset till liv igen — med konst, musik, mat, design, scenkonst, dans och kultur i alla former, öppet för alla.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_FULL,
    template: `%s | ${TITLE}`,
  },
  description: DESCRIPTION,
  applicationName: TITLE,
  keywords: [
    "Saturnushuset",
    "Saturnus",
    "en plats för kultur",
    "kultur Malmö",
    "Malmö",
    "PLX",
    "PLX Kulturförening",
    "Kulturföreningen PLX",
    "kultur",
    "konst",
    "musik",
    "scenkonst",
    "dans",
    "design",
    "Lantmannagatan",
    "Ystadsgatan",
  ],
  authors: [{ name: "PLX Kulturförening" }],
  creator: "PLX Kulturförening",
  publisher: "PLX Kulturförening",
  category: "culture",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/",
    siteName: TITLE,
    title: TITLE_FULL,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_FULL,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#saturnushuset`,
    name: "Saturnushuset",
    alternateName: "Saturnushuset – en plats för kultur",
    url: SITE_URL,
    description: DESCRIPTION,
    email: "info@saturnuskultur.se",
    foundingLocation: "Malmö",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lantmannagatan / Ystadsgatan",
      addressLocality: "Malmö",
      addressCountry: "SE",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "PLX Kulturförening",
      alternateName: ["Kulturföreningen PLX", "PLX"],
      areaServed: ["Malmö", "Stockholm", "Blekinge"],
    },
    knowsAbout: [
      "konst",
      "musik",
      "mat",
      "design",
      "scenkonst",
      "dans",
      "kultur",
    ],
  };

  return (
    <html lang="sv">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
