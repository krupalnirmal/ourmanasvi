import Link from "next/link";
import type { Metadata } from "next";
import { getAllMilestones } from "@/lib/data";
import { monthLabel } from "@/lib/months";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Milestones — OurManasvi" };

export default async function MilestonesPage() {
  const milestones = await getAllMilestones();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">every little first</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Milestones
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            {milestones.length > 0
              ? "All the big little firsts of Manasvi's first year."
              : "Milestones are coming soon 🏆"}
          </p>
        </div>

        {milestones.length > 0 && (
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {milestones.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/month/${m.monthNumber}#milestones`}
                  className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    {m.icon ?? "✨"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{m.title}</p>
                    {m.description && <p className="text-sm text-ink-soft">{m.description}</p>}
                    <p className="mt-1 text-xs font-medium text-soft-pink-deep">
                      {monthLabel(m.monthNumber)} · {m.monthTitle}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
