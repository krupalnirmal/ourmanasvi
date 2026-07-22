import type { Metadata } from "next";
import { getFunMedia } from "@/lib/data";
import MediaGrid from "@/components/ui/MediaGrid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Funny — OurManasvi" };

export default async function FunnyPage() {
  const media = await getFunMedia();
  const photos = media.filter((m) => m.kind === "image").length;
  const videos = media.length - photos;

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">giggles guaranteed</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Funny Moments 😄
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            {media.length > 0
              ? `${photos} photos${videos > 0 ? ` and ${videos} videos` : ""} of pure mischief.`
              : "Funny clips are coming soon 🤭"}
          </p>
        </div>

        {media.length > 0 && (
          <div className="mx-auto mt-12 max-w-5xl">
            <MediaGrid media={media} />
          </div>
        )}
      </section>
    </main>
  );
}
