import SiteHeader from "@/components/sections/SiteHeader";
import Footer from "@/components/sections/Footer";
import InstallButton from "@/components/InstallButton";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <Footer />
      <InstallButton />
    </>
  );
}
