import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { addFamily, deleteFamily } from "@/app/admin/actions";
import ImagePicker from "@/components/admin/ImagePicker";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-xl border border-lavender/60 bg-white px-3 py-2 text-ink outline-none focus:border-lavender-deep";
const card = "rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40";

export default async function AdminFamily() {
  const members = await prisma.family.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
          ← Dashboard
        </Link>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Family</h1>
      </div>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Add a family member</h2>
        <form action={addFamily} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" placeholder="Name" required className={field} />
            <input name="relation" placeholder="Relation (e.g. Mother, Mama)" required className={field} />
          </div>
          <textarea name="message" placeholder="A short message (optional)" rows={2} className={field} />
          <ImagePicker />
          <button className="rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white">
            Add member
          </button>
        </form>
      </section>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Members <span className="text-ink-soft">({members.length})</span>
        </h2>
        {members.length === 0 ? (
          <p className="text-ink-soft">No family members yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-lavender/30">
                  {m.photoUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={m.photoUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{m.name}</p>
                  <p className="truncate text-xs text-soft-pink-deep">{m.relation}</p>
                </div>
                <DeleteButton action={deleteFamily.bind(null, m.id, m.publicId ?? undefined)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
