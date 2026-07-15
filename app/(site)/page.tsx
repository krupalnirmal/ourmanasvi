import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/sections/Hero";
import StatsBand from "@/components/sections/StatsBand";
import FeaturedMoments from "@/components/sections/FeaturedMoments";
import Timeline from "@/components/sections/Timeline";
import {
  getTimeline,
  getFeaturedMoments,
  getStoryPhotos,
  getBaby,
  getStats,
} from "@/lib/data";

// Reflect admin edits immediately.
export const dynamic = "force-dynamic";

const STORY_AUDIO =
  "https://res.cloudinary.com/dt1zpdsy1/video/upload/v1784091868/ourmanasvi/story-audio.mp3";

export default async function Home() {
  const [timeline, featured, heroPhotos, story, baby, stats] = await Promise.all([
    getTimeline(),
    getFeaturedMoments(8),
    getFeaturedMoments(15),
    getStoryPhotos(),
    getBaby(),
    getStats(),
  ]);

  return (
    <>
      <LoadingScreen />
      <main className="flex-1">
        <Hero
          photos={heroPhotos.map((f) => f.imageUrl)}
          baby={baby}
          story={story}
          audioUrl={STORY_AUDIO}
        />
        <StatsBand stats={stats} />
        <FeaturedMoments moments={featured} />
        <Timeline items={timeline} />
      </main>
    </>
  );
}
