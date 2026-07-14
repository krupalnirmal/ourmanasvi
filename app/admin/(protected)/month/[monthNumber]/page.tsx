import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { monthLabel } from "@/lib/months";
import {
  updateMonth,
  addMemory,
  deleteMemory,
  addMilestone,
  deleteMilestone,
  deleteGalleryPhoto,
  deleteVideo,
} from "@/app/admin/actions";
import Uploader from "@/components/admin/Uploader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const fieldCls =
  "w-full rounded-xl border border-lavender/60 bg-white px-3 py-2 text-ink outline-none focus:border-lavender-deep";
const cardCls = "rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40";
const saveBtn =
  "rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]";

export default async function MonthEditor({
  params,
}: {
  params: Promise<{ monthNumber: string }>;
}) {
  const { monthNumber } = await params;
  const n = Number(monthNumber);
  if (Number.isNaN(n)) notFound();

  const month = await prisma.month.findFirst({
    where: { monthNumber: n },
    include: {
      gallery: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { createdAt: "asc" } },
      memories: { orderBy: { createdAt: "asc" } },
      milestones: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!month) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
            ← All months
          </Link>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            {monthLabel(month.monthNumber)} — {month.title}
          </h1>
        </div>
        <Link
          href={`/month/${month.monthNumber}`}
          target="_blank"
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          Preview ↗
        </Link>
      </div>

      {/* Month text */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Month details</h2>
        <form action={updateMonth.bind(null, month.id, month.monthNumber)} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Title</label>
            <input name="title" defaultValue={month.title} className={fieldCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Subtitle</label>
            <input name="subtitle" defaultValue={month.subtitle ?? ""} className={fieldCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Intro / description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={month.description ?? ""}
              className={fieldCls}
            />
          </div>
          <button type="submit" className={saveBtn}>
            Save details
          </button>
        </form>
      </section>

      {/* Photos */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Photos <span className="text-ink-soft">({month.gallery.length})</span>
        </h2>
        <Uploader monthId={month.id} monthNumber={month.monthNumber} kind="image" />
        {month.gallery.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {month.gallery.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-xl ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.imageUrl} alt={g.caption ?? ""} className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between gap-1 bg-white/80 px-2 py-1.5">
                  <span className="truncate text-xs text-ink-soft">{g.caption || "—"}</span>
                  <DeleteButton
                    action={deleteGalleryPhoto.bind(null, g.id, g.publicId, month.monthNumber)}
                    label="✕"
                    confirmText="Delete this photo?"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Videos */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Videos <span className="text-ink-soft">({month.videos.length})</span>
        </h2>
        <Uploader monthId={month.id} monthNumber={month.monthNumber} kind="video" />
        {month.videos.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {month.videos.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-xl ring-1 ring-black/5">
                <video src={v.videoUrl} poster={v.thumbnail ?? undefined} className="aspect-video w-full bg-black" controls preload="none" />
                <div className="flex items-center justify-between gap-1 bg-white/80 px-2 py-1.5">
                  <span className="truncate text-xs text-ink-soft">{v.caption || "—"}</span>
                  <DeleteButton
                    action={deleteVideo.bind(null, v.id, v.publicId, month.monthNumber)}
                    label="✕"
                    confirmText="Delete this video?"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Memories */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Memories <span className="text-ink-soft">({month.memories.length})</span>
        </h2>
        <form
          action={addMemory.bind(null, month.id, month.monthNumber)}
          className="grid gap-3 sm:grid-cols-[1fr_auto]"
        >
          <div className="space-y-3">
            <input name="title" placeholder="Memory title" required className={fieldCls} />
            <textarea name="content" placeholder="What happened?" rows={2} required className={fieldCls} />
            <input name="mood" placeholder="Mood emoji (optional) e.g. 🥰" className={fieldCls} />
          </div>
          <button type="submit" className={`${saveBtn} self-start`}>
            Add
          </button>
        </form>
        {month.memories.length > 0 && (
          <ul className="mt-5 space-y-2">
            {month.memories.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-3 rounded-xl bg-cream px-4 py-3">
                <div>
                  <p className="font-medium text-ink">
                    {m.mood} {m.title}
                  </p>
                  <p className="text-sm text-ink-soft">{m.content}</p>
                </div>
                <DeleteButton action={deleteMemory.bind(null, m.id, month.monthNumber)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Milestones */}
      <section className={cardCls}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Milestones <span className="text-ink-soft">({month.milestones.length})</span>
        </h2>
        <form
          action={addMilestone.bind(null, month.id, month.monthNumber)}
          className="grid gap-3 sm:grid-cols-[auto_1fr_1fr_auto]"
        >
          <input name="icon" placeholder="🏆" className={`${fieldCls} sm:w-20`} />
          <input name="title" placeholder="Milestone" required className={fieldCls} />
          <input name="description" placeholder="Details (optional)" className={fieldCls} />
          <button type="submit" className={`${saveBtn} self-start`}>
            Add
          </button>
        </form>
        {month.milestones.length > 0 && (
          <ul className="mt-5 space-y-2">
            {month.milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl bg-baby-blue/20 px-4 py-2.5">
                <span className="text-ink">
                  {m.icon} <span className="font-medium">{m.title}</span>
                  {m.description && <span className="text-ink-soft"> — {m.description}</span>}
                </span>
                <DeleteButton action={deleteMilestone.bind(null, m.id, month.monthNumber)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
