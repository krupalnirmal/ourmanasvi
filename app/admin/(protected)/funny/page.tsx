import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteFunMedia, updateFunMediaCaption, moveFunMedia } from "@/app/admin/actions";
import FunUploader from "@/components/admin/FunUploader";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const card = "rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40";
const moveBtn =
  "flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-xs text-ink-soft ring-1 ring-lavender/50 hover:bg-white disabled:opacity-30";

export default async function AdminFunny() {
  const media = await prisma.funMedia.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const photos = media.filter((m) => m.kind === "image");
  const videos = media.filter((m) => m.kind === "video");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
            ← Dashboard
          </Link>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Funny Moments 😄</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {photos.length} photos · {videos.length} videos on the Funny page.
          </p>
        </div>
        <Link
          href="/funny"
          target="_blank"
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          Preview ↗
        </Link>
      </div>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Add photos</h2>
        <FunUploader kind="image" />
      </section>

      <section className={card}>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Add videos</h2>
        <FunUploader kind="video" />
      </section>

      <section className={card}>
        <h2 className="mb-1 font-display text-xl font-semibold text-ink">
          Everything on the page <span className="text-ink-soft">({media.length})</span>
        </h2>
        <p className="mb-4 text-sm text-ink-soft">
          Use ✕ to remove an item — it is deleted from Cloudinary too, so it frees up free-tier
          storage. Arrows change the order it appears in.
        </p>

        {media.length === 0 ? (
          <p className="text-ink-soft">Nothing here yet. Add a photo or video above.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {media.map((m, i) => (
              <div key={m.id} className="overflow-hidden rounded-xl ring-1 ring-black/5">
                <div className="relative">
                  {m.kind === "video" ? (
                    <video
                      src={m.url}
                      poster={m.thumbnail ?? undefined}
                      controls
                      preload="none"
                      className="aspect-square w-full bg-black object-cover"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.url}
                      alt={m.caption ?? ""}
                      className="aspect-square w-full object-cover"
                    />
                  )}
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                    {m.kind === "video" ? "🎬 Video" : "📷 Photo"}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white/80 px-2 py-1.5">
                  <form action={moveFunMedia.bind(null, m.id, "up")}>
                    <button className={moveBtn} disabled={i === 0} aria-label="Move earlier">
                      ↑
                    </button>
                  </form>
                  <form action={moveFunMedia.bind(null, m.id, "down")}>
                    <button
                      className={moveBtn}
                      disabled={i === media.length - 1}
                      aria-label="Move later"
                    >
                      ↓
                    </button>
                  </form>
                  <span className="flex-1" />
                  <DeleteButton
                    action={deleteFunMedia.bind(null, m.id, m.publicId, m.kind)}
                    label="✕"
                    confirmText={`Delete this ${m.kind === "video" ? "video" : "photo"}? This also removes it from Cloudinary and cannot be undone.`}
                  />
                </div>

                <form
                  action={updateFunMediaCaption.bind(null, m.id)}
                  className="flex gap-1 border-t border-lavender/30 bg-white/60 px-2 py-1.5"
                >
                  <input
                    name="caption"
                    defaultValue={m.caption ?? ""}
                    placeholder="Caption…"
                    className="min-w-0 flex-1 rounded-lg border border-lavender/50 bg-white px-2 py-1 text-xs outline-none focus:border-lavender-deep"
                  />
                  <button className="rounded-lg bg-lavender/40 px-2 py-1 text-xs font-medium text-ink hover:bg-lavender/60">
                    Save
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
