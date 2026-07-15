import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { monthLabel } from "@/lib/months";
import { banner } from "@/lib/cld";
import { setHeroImage, clearHeroImage, setStoryAudio, clearStoryAudio } from "@/app/admin/actions";
import ImagePicker from "@/components/admin/ImagePicker";
import AudioPicker from "@/components/admin/AudioPicker";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [months, baby] = await Promise.all([
    prisma.month.findMany({
      orderBy: { monthNumber: "asc" },
      include: {
        _count: { select: { gallery: true, videos: true, memories: true, milestones: true } },
      },
    }),
    prisma.baby.findFirst(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Manasvi&apos;s Journey</h1>
      <p className="mt-2 text-ink-soft">
        Pick a month to add photos, videos, memories and milestones.
      </p>

      {/* Home hero background */}
      <section className="mt-6 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40">
        <h2 className="font-display text-xl font-semibold text-ink">Home hero background</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choose the big photo behind the homepage title. Tip: turn on “Crop before upload”
          and use a wide crop for the best fit. Leave it automatic to use your latest photo.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-24 w-40 shrink-0 overflow-hidden rounded-2xl bg-lavender/20 ring-1 ring-lavender/40">
            {baby?.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={banner(baby.coverImage)} alt="" className="h-full w-full object-cover object-[50%_15%]" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-ink-soft">
                Automatic
              </span>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <form action={setHeroImage} className="space-y-2">
              <ImagePicker />
              <button className="rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white">
                Set as hero image
              </button>
            </form>
            {baby?.coverImage && (
              <form action={clearHeroImage}>
                <button className="text-sm font-medium text-ink-soft underline hover:text-ink">
                  Use latest photo automatically
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Journey video music */}
      <section className="mt-6 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-lavender/40">
        <h2 className="font-display text-xl font-semibold text-ink">
          “Watch our Journey” music 🎵
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Upload a song to play during the story video. Anything you set here replaces the current
          track.
        </p>
        <form action={setStoryAudio} className="mt-4 max-w-md space-y-3">
          <AudioPicker current={baby?.storyAudio ?? undefined} />
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white">
              Set music
            </button>
          </div>
        </form>

        {/* Or paste an online audio link */}
        <div className="mt-5 max-w-md border-t border-lavender/40 pt-5">
          <p className="mb-2 text-sm font-medium text-ink">Or paste an online audio link</p>
          <form action={setStoryAudio} className="flex flex-col gap-2 sm:flex-row">
            <input
              name="audioUrl"
              type="url"
              placeholder="https://…/song.mp3"
              required
              className="flex-1 rounded-xl border border-lavender/60 bg-white px-3 py-2 text-sm outline-none focus:border-lavender-deep"
            />
            <button className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white">
              Set from link
            </button>
          </form>
          <p className="mt-1.5 text-xs text-ink-soft">
            Use a direct audio file link (ending in .mp3/.m4a). We re-host it for reliability.
            Please use music you have the rights to.
          </p>
        </div>

        {baby?.storyAudio && (
          <form action={clearStoryAudio} className="mt-4">
            <button className="text-sm font-medium text-ink-soft underline hover:text-ink">
              Remove music
            </button>
          </form>
        )}
      </section>

      {/* Section shortcuts */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { href: "/admin/family", label: "👪 Family" },
          { href: "/admin/places", label: "📍 Places & Villages" },
          { href: "/admin/events", label: "🎉 Events & Photoshoots" },
        ].map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-full bg-white/80 px-5 py-2 text-sm font-medium text-ink shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {s.label}
          </Link>
        ))}
      </div>

      {months.length === 0 && (
        <p className="mt-8 rounded-2xl bg-soft-pink/30 p-6 text-ink-soft">
          No months found. Run <code className="font-mono">npm run db:seed</code> to create them.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <Link
            key={m.id}
            href={`/admin/month/${m.monthNumber}`}
            className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <span className="font-hand text-xl text-ink-soft">{monthLabel(m.monthNumber)}</span>
            <h2 className="font-display text-xl font-semibold text-ink">{m.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-soft">
              <span className="rounded-full bg-baby-blue/30 px-2 py-0.5">📷 {m._count.gallery}</span>
              <span className="rounded-full bg-lavender/30 px-2 py-0.5">🎬 {m._count.videos}</span>
              <span className="rounded-full bg-soft-pink/30 px-2 py-0.5">💬 {m._count.memories}</span>
              <span className="rounded-full bg-cream-deep/60 px-2 py-0.5">🏆 {m._count.milestones}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
