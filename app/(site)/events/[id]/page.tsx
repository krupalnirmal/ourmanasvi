import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventDetail } from "@/lib/data";
import MediaGrid from "@/components/ui/MediaGrid";

export const dynamic = "force-dynamic";

function fmt(d?: string) {
  return d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ev = await getEventDetail(id);
  return { title: ev ? `${ev.name} — OurManasvi` : "Event — OurManasvi" };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ev = await getEventDetail(id);
  if (!ev) notFound();

  const photos = ev.media.filter((m) => m.kind === "image").length;
  const videos = ev.media.length - photos;

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/events" className="text-sm font-medium text-ink-soft hover:text-ink">
            ← All events
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold text-ink sm:text-5xl">
            {ev.name}
          </h1>
          {ev.date && (
            <p className="mt-2 font-hand text-2xl text-rose-deep">{fmt(ev.date)}</p>
          )}
          <p className="mt-2 text-sm text-ink-soft">
            {photos} photos{videos > 0 ? ` · ${videos} videos` : ""}
          </p>
          {ev.description && (
            <p className="mx-auto mt-4 max-w-lg text-ink-soft">{ev.description}</p>
          )}
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          {ev.media.length > 0 ? (
            <MediaGrid media={ev.media} />
          ) : (
            <p className="text-center text-ink-soft">Photos coming soon 💕</p>
          )}
        </div>
      </section>
    </main>
  );
}
