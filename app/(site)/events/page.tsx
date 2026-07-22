import Link from "next/link";
import type { Metadata } from "next";
import { getEvents } from "@/lib/data";
import { thumb } from "@/lib/cld";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events — OurManasvi" };

function fmt(d?: string) {
  return d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">celebrations &amp; photoshoots</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">Events</h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            Every festival, photoshoot and special day of her first year — tap one to see all its
            photos.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="mx-auto mt-14 max-w-md rounded-3xl bg-white/70 p-8 text-center text-ink-soft shadow-sm ring-1 ring-lavender/40">
            Event &amp; photoshoot memories are coming soon 🎊
          </p>
        ) : (
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="group overflow-hidden rounded-3xl bg-white/80 shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-lavender/20">
                  {ev.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={thumb(ev.imageUrl)}
                      alt={ev.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-4xl opacity-60">🎉</span>
                  )}
                  {typeof ev.mediaCount === "number" && ev.mediaCount > 0 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {ev.mediaCount} 📷
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-ink">{ev.name}</h3>
                  {ev.date && <p className="mt-0.5 text-sm text-rose-deep">{fmt(ev.date)}</p>}
                  {ev.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{ev.description}</p>
                  )}
                  <span className="mt-3 inline-block text-sm font-medium text-soft-pink-deep opacity-0 transition-opacity group-hover:opacity-100">
                    View gallery →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
