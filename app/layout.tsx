import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

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
  title: "OurManasvi — A Year of Firsts",
  description:
    "A premium digital memory book celebrating Manasvi's first year, from birth to first birthday.",
  keywords: ["baby memory book", "first year", "Manasvi", "milestones", "timeline"],
  openGraph: {
    title: "OurManasvi — A Year of Firsts",
    description: "Manasvi's first year, told month by month.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Manasvi",
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
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
