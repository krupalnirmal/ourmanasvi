import type { Metadata } from "next";
import { getBaby, getFeaturedMoments } from "@/lib/data";
import { banner } from "@/lib/cld";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "About — OurManasvi" };

function fmt(d?: string) {
  return d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

export default async function AboutPage() {
  const [baby, featured] = await Promise.all([getBaby(), getFeaturedMoments(1)]);
  const photo = featured[0]?.imageUrl;

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">our little world</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            About {baby?.name ?? "Manasvi"}
          </h1>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl items-center gap-10 md:grid-cols-2">
          {photo && (
            <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-lavender/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner(photo)}
                alt={baby?.name ?? "Manasvi"}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          )}
          <div className={photo ? "" : "md:col-span-2 md:text-center"}>
            <p className="font-hand text-2xl text-ink-soft">
              {baby?.tagline ?? "A year of firsts, from birth to first birthday."}
            </p>
            <p className="mt-5 leading-relaxed text-ink-soft">
              This is a little book of love for{" "}
              <span className="font-semibold text-ink">{baby?.name ?? "Manasvi"}</span> — a keepsake
              of the very first year, gathered month by month. Every giggle, first step, and tiny
              milestone lives here, so we can revisit these fleeting days forever.
            </p>
            {baby?.birthDate && (
              <div className="mt-6 inline-flex flex-col gap-1 rounded-2xl bg-white/70 px-6 py-4 text-left shadow-sm ring-1 ring-lavender/40">
                <span className="text-sm text-ink-soft">Born</span>
                <span className="font-display text-xl font-semibold text-ink">
                  {fmt(baby.birthDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center font-hand text-2xl text-soft-pink-deep">
          Made with endless love, for our Manasvi 💕
        </p>
      </section>
    </main>
  );
}
