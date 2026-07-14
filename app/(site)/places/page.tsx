import type { Metadata } from "next";
import { getPlaces } from "@/lib/data";
import StoryGrid from "@/components/ui/StoryGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Places — OurManasvi" };

export default async function PlacesPage() {
  const places = await getPlaces();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">little adventures</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Places &amp; Villages
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            The places she visited in her first year — her mama&apos;s village, her own village, and
            every little trip in between.
          </p>
        </div>
        <StoryGrid
          items={places}
          emptyText="Places &amp; travel stories are coming soon 🧳"
          fallbackEmoji="📍"
        />
      </section>
    </main>
  );
}
