import LoadingScreen from "@/components/ui/LoadingScreen";
import Hero from "@/components/sections/Hero";
import QuickLinks from "@/components/sections/QuickLinks";
import RecentMoments from "@/components/sections/RecentMoments";
import ProfileCard from "@/components/sections/ProfileCard";
import { getFeaturedMoments, getRecentMoments, getStoryPhotos, getBaby } from "@/lib/data";

// Reflect admin edits immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [bannerPhotos, recent, story, baby] = await Promise.all([
    getFeaturedMoments(30),
    getRecentMoments(4),
    getStoryPhotos(),
    getBaby(),
  ]);

  return (
    <>
      <LoadingScreen />
      <main className="flex-1 bg-cream pb-6">
        <Hero
          photos={bannerPhotos.map((f) => f.imageUrl)}
          baby={baby}
          story={story}
          audioUrl={baby?.storyAudio}
          bannerAudio={baby?.bannerAudio}
        />

        <QuickLinks />

        {/* Recent moments + profile */}
        <section className="px-3 pt-4 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2fr_1fr]">
            <RecentMoments moments={recent} />
            <ProfileCard baby={baby} avatar={bannerPhotos[0]?.imageUrl} />
          </div>
        </section>
      </main>
    </>
  );
}
