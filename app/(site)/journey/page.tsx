import type { Metadata } from "next";
import Timeline from "@/components/sections/Timeline";
import { getTimeline } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "The Journey — OurManasvi",
  description: "Manasvi's first year, month by month.",
};

export default async function JourneyPage() {
  const timeline = await getTimeline();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pt-16 text-center">
        <p className="font-hand text-3xl text-soft-pink-deep">a whole year of firsts</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
          The Journey, Month by Month
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          Tap any month to see its photos, videos, memories and milestones.
        </p>
      </section>
      <Timeline items={timeline} />
    </main>
  );
}
