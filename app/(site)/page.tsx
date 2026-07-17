import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/sections/Hero";
import QuickLinks from "@/components/sections/QuickLinks";
import RecentMoments from "@/components/sections/RecentMoments";
import ProfileCard from "@/components/sections/ProfileCard";
import StatsBand from "@/components/sections/StatsBand";
import FeaturedMoments from "@/components/sections/FeaturedMoments";
import JourneyCTA from "@/components/sections/JourneyCTA";
import {
  getTimeline,
  getFeaturedMoments,
  getRecentMoments,
  getStoryPhotos,
  getBaby,
  getStats,
} from "@/lib/data";

// Reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [timeline, featured, bannerPhotos, recent, story, baby, stats] = await Promise.all([
    getTimeline(),
    getFeaturedMoments(8),
    getFeaturedMoments(10),
    getRecentMoments(4),
    getStoryPhotos(),
    getBaby(),
    getStats(),
  ]);

  return (
    <>
      <LoadingScreen />
      <main className="flex-1 bg-cream pb-4">
        <Hero
          photos={bannerPhotos.map((f) => f.imageUrl)}
          baby={baby}
          story={story}
          audioUrl={baby?.storyAudio}
        />

        <QuickLinks />

        {/* Recent moments + profile */}
        <section className="px-3 pt-5 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2fr_1fr]">
            <RecentMoments moments={recent} />
            <ProfileCard baby={baby} avatar={bannerPhotos[0]?.imageUrl} />
          </div>
        </section>

        <StatsBand stats={stats} />
        <FeaturedMoments moments={featured} />
        <JourneyCTA items={timeline} />
      </main>
    </>
  );
}
