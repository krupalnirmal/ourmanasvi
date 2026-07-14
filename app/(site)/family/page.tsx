import type { Metadata } from "next";
import { getFamily } from "@/lib/data";
import { thumb } from "@/lib/cld";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Family — OurManasvi" };

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">the people who love her most</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Family
          </h1>
        </div>

        {family.length === 0 ? (
          <p className="mx-auto mt-14 max-w-md rounded-3xl bg-white/70 p-8 text-center text-ink-soft shadow-sm ring-1 ring-lavender/40">
            Family photos &amp; little notes are coming soon 💕
          </p>
        ) : (
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {family.map((m) => (
              <div
                key={m.id}
                className="flex flex-col items-center rounded-3xl bg-white/80 p-6 text-center shadow-sm ring-1 ring-lavender/40"
              >
                <div className="h-28 w-28 overflow-hidden rounded-full bg-lavender/30 ring-4 ring-white shadow">
                  {m.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={thumb(m.photoUrl)}
                      alt={m.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-4xl">
                      🌸
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{m.name}</h3>
                <p className="text-sm font-medium uppercase tracking-wide text-soft-pink-deep">
                  {m.relation}
                </p>
                {m.message && (
                  <p className="mt-3 font-hand text-xl text-ink-soft">“{m.message}”</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
