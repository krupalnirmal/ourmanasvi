import CountdownBanner from "@/components/sections/CountdownBanner";
import SiteHeader from "@/components/sections/SiteHeader";
import Footer from "@/components/sections/Footer";
import InstallButton from "@/components/InstallButton";
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
      <SiteHeader />
      <CountdownBanner firstBirthday={baby?.firstBirthday} />
      {children}
      <Footer />
      <InstallButton />
    </>
  );
}
