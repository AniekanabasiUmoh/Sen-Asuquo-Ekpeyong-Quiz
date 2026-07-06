import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/RoleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sen. Asuquo Ekpenyong Quiz Competition — Cross River State",
  description: "A fair, transparent and inclusive platform for state-level quiz competitions in Cross River State, championed by Senator Asuquo Ekpenyong.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
