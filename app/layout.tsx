import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: {
    default: "SÆAC · Senator Asuquo Ekpenyong Academic Championship",
    template: "%s · SÆAC",
  },
  description:
    "A district-wide academic championship for secondary schools across the seven Local Government Areas of the Cross River South Senatorial District.",
  metadataBase: new URL("https://www.saeac.org"),
  // The card image itself is app/opengraph-image.tsx — Next discovers it by
  // file convention and fills in the url/width/height, so it is deliberately
  // not repeated here.
  openGraph: {
    title: "SÆAC · Senator Asuquo Ekpenyong Academic Championship",
    description:
      "Igniting Minds. Inspiring Excellence. Building Leaders. The maiden edition of the Cross River South academic championship.",
    type: "website",
    siteName: "SÆAC",
    locale: "en_NG",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "SÆAC · Senator Asuquo Ekpenyong Academic Championship",
    description:
      "Igniting Minds. Inspiring Excellence. Building Leaders. The maiden edition of the Cross River South academic championship.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#14339f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NG" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-cream text-primary">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
