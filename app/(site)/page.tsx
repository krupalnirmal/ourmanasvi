import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/sections/Hero";
import StatsBand from "@/components/sections/StatsBand";
import FeaturedMoments from "@/components/sections/FeaturedMoments";
import JourneyCTA from "@/components/sections/JourneyCTA";
import {
  getTimeline,
  getFeaturedMoments,
  getStoryPhotos,
  getBaby,
  getStats,
} from "@/lib/data";

// Reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [timeline, featured, bannerPhotos, story, baby, stats] = await Promise.all([
    getTimeline(),
    getFeaturedMoments(8),
    getFeaturedMoments(10),
    getStoryPhotos(),
    getBaby(),
    getStats(),
  ]);

  return (
    <>
      <LoadingScreen />
      <main className="flex-1">
        <Hero
          photos={bannerPhotos.map((f) => f.imageUrl)}
          baby={baby}
          story={story}
          audioUrl={baby?.storyAudio}
        />
        <StatsBand stats={stats} />
        <FeaturedMoments moments={featured} />
        <JourneyCTA items={timeline} />
      </main>
    </>
  );
}
