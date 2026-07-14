import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addPlace, deletePlace } from "@/app/admin/actions";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-xl border border-lavender/60 bg-white px-3 py-2 text-ink outline-none focus:border-lavender-deep";
const card = "rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40";

export default async function AdminPlaces() {
  const places = await prisma.place.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
          ← Dashboard
        </Link>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Places &amp; Villages</h1>
      </div>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Add a place</h2>
        <form action={addPlace} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Place (e.g. Mama's village)" required className={field} />
            <input name="date" type="date" className={field} />
          </div>
          <textarea name="description" placeholder="A little about this place (optional)" rows={2} className={field} />
          <ImagePicker />
          <button className="rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white">
            Add place
          </button>
        </form>
      </section>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Places <span className="text-ink-soft">({places.length})</span>
        </h2>
        {places.length === 0 ? (
          <p className="text-ink-soft">No places yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {places.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-lavender/30">
                  {p.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  {p.description && <p className="truncate text-xs text-ink-soft">{p.description}</p>}
                </div>
                <DeleteButton action={deletePlace.bind(null, p.id, p.publicId ?? undefined)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
