import type { Metadata } from "next";
import { getFavouritePhotos } from "@/lib/data";
import Gallery from "@/components/ui/Gallery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Favorites — OurManasvi" };

export default async function FavoritesPage() {
  const photos = await getFavouritePhotos();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">the ones we love most</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            My Favorites
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            {photos.length > 0
              ? `${photos.length} specially picked moments.`
              : "No favourites picked yet — star photos in the admin to see them here 💕"}
          </p>
        </div>

        {photos.length > 0 && (
          <div className="mx-auto mt-12 max-w-5xl">
            <Gallery
              photos={photos.map((p) => ({
                caption: p.caption ?? "",
                imageUrl: p.imageUrl,
              }))}
              accent="pink"
            />
          </div>
        )}
      </section>
    </main>
  );
}
