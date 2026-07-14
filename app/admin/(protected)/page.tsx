import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { monthLabel } from "@/lib/months";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const months = await prisma.month.findMany({
    orderBy: { monthNumber: "asc" },
    include: {
      _count: { select: { gallery: true, videos: true, memories: true, milestones: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Manasvi&apos;s Journey</h1>
      <p className="mt-2 text-ink-soft">
        Pick a month to add photos, videos, memories and milestones.
      </p>

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
