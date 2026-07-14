import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMonthView, getMonthNumbers } from "@/lib/data";
import { monthLabel, ACCENT_CLASSES } from "@/lib/months";
import { banner } from "@/lib/cld";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Gallery from "@/components/ui/Gallery";
import VideoPlayer from "@/components/ui/VideoPlayer";
import MemoryCard from "@/components/ui/MemoryCard";
import MilestoneCard from "@/components/ui/MilestoneCard";

// Reflect admin edits / new uploads immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ monthNumber: string }>;
}): Promise<Metadata> {
  const { monthNumber } = await params;
  const month = await getMonthView(Number(monthNumber));
  if (!month) return { title: "OurManasvi" };
  return { title: `${month.title} — OurManasvi`, description: month.intro };
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ monthNumber: string }>;
}) {
  const { monthNumber } = await params;
  const n = Number(monthNumber);
  if (Number.isNaN(n)) notFound();

  const month = await getMonthView(n);
  if (!month) notFound();

  const accent = ACCENT_CLASSES[month.accent];
  const cover = month.gallery.find((g) => g.imageUrl)?.imageUrl;
  const numbers = await getMonthNumbers();
  const idx = numbers.indexOf(n);
  const prevN = idx > 0 ? numbers[idx - 1] : undefined;
  const nextN = idx >= 0 && idx < numbers.length - 1 ? numbers[idx + 1] : undefined;
  const [prev, next] = await Promise.all([
    prevN !== undefined ? getMonthView(prevN) : Promise.resolve(undefined),
    nextN !== undefined ? getMonthView(nextN) : Promise.resolve(undefined),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero — real cover photo when available, else pastel */}
        <section
          className={`relative overflow-hidden px-6 pb-16 pt-32 ${cover ? "" : accent.bg}`}
        >
          {cover && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner(cover)}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />
            </>
          )}
          <div
            className={`relative mx-auto max-w-3xl text-center ${cover ? "text-white" : ""}`}
          >
            <Link
              href="/#timeline"
              className={`text-sm font-medium transition-colors ${
                cover ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              ← Back to the timeline
            </Link>
            <p
              className={`mt-6 font-hand text-3xl ${cover ? "text-white/90" : "text-ink-soft"}`}
            >
              {monthLabel(month.monthNumber)}
            </p>
            <h1
              className={`mt-2 font-display text-4xl font-semibold sm:text-6xl ${
                cover ? "text-white drop-shadow" : "text-ink"
              }`}
            >
              {month.title}
            </h1>
            {month.subtitle && (
              <p className={`mt-3 text-lg ${cover ? "text-white/85" : "text-ink-soft"}`}>
                {month.subtitle}
              </p>
            )}
            {month.intro && (
              <p className={`mx-auto mt-6 max-w-xl ${cover ? "text-white/85" : "text-ink-soft"}`}>
                {month.intro}
              </p>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="mb-8 text-center font-display text-3xl font-semibold text-ink">
            Moments
          </h2>
          <Gallery photos={month.gallery} accent={month.accent} />
        </section>

        {/* Videos */}
        {month.videos.length > 0 && (
          <section id="videos" className="bg-lavender/20 px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center font-display text-3xl font-semibold text-ink">
                Videos
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {month.videos.map((v, i) => (
                  <VideoPlayer key={i} video={v} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Memories */}
        {month.memories.length > 0 && (
          <section id="memories" className="bg-cream px-6 py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center font-display text-3xl font-semibold text-ink">
                Memories
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {month.memories.map((m, i) => (
                  <MemoryCard key={i} memory={m} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Milestones */}
        {month.milestones.length > 0 && (
          <section id="milestones" className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="mb-8 text-center font-display text-3xl font-semibold text-ink">
              Milestones
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {month.milestones.map((m, i) => (
                <MilestoneCard key={i} milestone={m} index={i} />
              ))}
            </ul>
          </section>
        )}

        {/* Prev / Next navigation */}
        <nav className="mx-auto flex max-w-4xl items-stretch justify-between gap-4 px-6 pb-20">
          {prev ? (
            <Link
              href={`/month/${prev.monthNumber}`}
              className="flex-1 rounded-2xl bg-white/70 p-5 text-left shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-sm text-ink-soft">← {monthLabel(prev.monthNumber)}</span>
              <p className="font-display text-lg font-semibold text-ink">{prev.title}</p>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/month/${next.monthNumber}`}
              className="flex-1 rounded-2xl bg-white/70 p-5 text-right shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-sm text-ink-soft">{monthLabel(next.monthNumber)} →</span>
              <p className="font-display text-lg font-semibold text-ink">{next.title}</p>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </main>
      <Footer />
    </>
  );
}
