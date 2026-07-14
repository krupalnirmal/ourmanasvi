import CountdownBanner from "@/components/sections/CountdownBanner";
import SiteHeader from "@/components/sections/SiteHeader";
import Footer from "@/components/sections/Footer";
import { getBaby } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baby = await getBaby();
  return (
    <>
      <CountdownBanner firstBirthday={baby?.firstBirthday} />
      <SiteHeader />
      {children}
      <Footer />
    </>
  );
}
