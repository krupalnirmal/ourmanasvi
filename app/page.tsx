import LoadingScreen from "@/components/ui/LoadingScreen";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Footer from "@/components/sections/Footer";
import { getTimeline } from "@/lib/data";

// Reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const timeline = await getTimeline();
  return (
    <>
      <LoadingScreen />
      <Header />
      <main className="flex-1">
        <Hero />
        <Timeline items={timeline} />
      </main>
      <Footer />
    </>
  );
}
