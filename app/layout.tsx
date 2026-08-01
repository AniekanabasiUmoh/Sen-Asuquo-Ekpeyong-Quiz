import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SÆAC — Senator Asuquo Ekpenyong Academic Championship",
    template: "%s · SÆAC",
  },
  description:
    "A district-wide academic championship for secondary schools across the seven Local Government Areas of the Cross River South Senatorial District.",
  metadataBase: new URL("https://www.saeac.org"),
  openGraph: {
    title: "SÆAC — Senator Asuquo Ekpenyong Academic Championship",
    description:
      "Igniting Minds. Inspiring Excellence. Building Leaders. The maiden edition of the Cross River South academic championship.",
    type: "website",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
