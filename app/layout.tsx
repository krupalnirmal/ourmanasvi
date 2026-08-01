import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Poppins, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import TopProgress from "@/components/TopProgress";
import { BABY_NAME, BABY_POSSESSIVE, SITE_DESCRIPTION, pageTitle } from "@/lib/site-config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: pageTitle(),
  description: SITE_DESCRIPTION,
  keywords: ["baby memory book", "first year", BABY_NAME, "milestones", "timeline"],
  openGraph: {
    title: pageTitle(),
    description: `${BABY_POSSESSIVE} first year, told month by month.`,
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BABY_NAME,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2a7b8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-ink">
        <Suspense fallback={null}>
          <TopProgress />
        </Suspense>
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
