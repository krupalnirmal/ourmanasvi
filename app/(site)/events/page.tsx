import type { Metadata } from "next";
import { getEvents } from "@/lib/data";
import StoryGrid from "@/components/ui/StoryGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events — OurManasvi" };

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">celebrations &amp; photoshoots</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Events
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            Every festival, photoshoot and special day we celebrated together.
          </p>
        </div>
        <StoryGrid
          items={events}
          emptyText="Event &amp; photoshoot memories are coming soon 🎊"
          fallbackEmoji="🎉"
        />
      </section>
    </main>
  );
}
