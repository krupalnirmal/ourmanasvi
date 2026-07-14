import LoadingScreen from "@/components/ui/LoadingScreen";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/Timeline";
import Footer from "@/components/sections/Footer";
import { getTimeline, getFeaturedPhotos } from "@/lib/data";

// Reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [timeline, featured] = await Promise.all([
    getTimeline(),
    getFeaturedPhotos(5),
  ]);
  return (
    <>
      <LoadingScreen />
      <Header />
      <main className="flex-1">
        <Hero photos={featured} />
        <Timeline items={timeline} />
      </main>
      <Footer />
    </>
  );
}
