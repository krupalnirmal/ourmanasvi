import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addEvent, deleteEvent } from "@/app/admin/actions";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-xl border border-lavender/60 bg-white px-3 py-2 text-ink outline-none focus:border-lavender-deep";
const card = "rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40";

export default async function AdminEvents() {
  const events = await prisma.festival.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
          ← Dashboard
        </Link>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Events &amp; Photoshoots</h1>
      </div>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Add an event</h2>
        <form action={addEvent} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Event (e.g. Naming ceremony)" required className={field} />
            <input name="date" type="date" className={field} />
          </div>
          <textarea name="description" placeholder="A little about it (optional)" rows={2} className={field} />
          <ImagePicker />
          <button className="rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white">
            Add event
          </button>
        </form>
      </section>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Events <span className="text-ink-soft">({events.length})</span>
        </h2>
        {events.length === 0 ? (
          <p className="text-ink-soft">No events yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-lavender/30">
                  {e.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{e.name}</p>
                  {e.description && <p className="truncate text-xs text-ink-soft">{e.description}</p>}
                </div>
                <DeleteButton action={deleteEvent.bind(null, e.id, e.publicId ?? undefined)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
