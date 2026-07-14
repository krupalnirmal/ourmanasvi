import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { monthLabel } from "@/lib/months";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search — OurManasvi" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let months: { monthNumber: number; title: string }[] = [];
  let memories: { title: string; monthNumber: number }[] = [];
  let places: { id: string; name: string }[] = [];
  let events: { id: string; name: string }[] = [];
  let family: { id: string; name: string; relation: string }[] = [];

  if (query) {
    try {
      const [m, mem, pl, ev, fam] = await Promise.all([
        prisma.month.findMany({
          where: { OR: [{ title: { contains: query } }, { subtitle: { contains: query } }, { description: { contains: query } }] },
          select: { monthNumber: true, title: true },
          orderBy: { monthNumber: "asc" },
        }),
        prisma.memory.findMany({
          where: { OR: [{ title: { contains: query } }, { content: { contains: query } }] },
          select: { title: true, month: { select: { monthNumber: true } } },
          take: 20,
        }),
        prisma.place.findMany({
          where: { OR: [{ name: { contains: query } }, { description: { contains: query } }] },
          select: { id: true, name: true },
        }),
        prisma.festival.findMany({
          where: { OR: [{ name: { contains: query } }, { description: { contains: query } }] },
          select: { id: true, name: true },
        }),
        prisma.family.findMany({
          where: { OR: [{ name: { contains: query } }, { relation: { contains: query } }] },
          select: { id: true, name: true, relation: true },
        }),
      ]);
      months = m;
      memories = mem.map((x) => ({ title: x.title, monthNumber: x.month.monthNumber }));
      places = pl;
      events = ev;
      family = fam;
    } catch {
      /* fall through to empty */
    }
  }

  const total = months.length + memories.length + places.length + events.length + family.length;

  return (
    <main className="flex-1">
      <section className="bg-cream px-6 pb-24 pt-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-ink">
            {query ? <>Results for “{query}”</> : "Search"}
          </h1>

          {!query && <p className="mt-3 text-ink-soft">Type something to search Manasvi&apos;s memories.</p>}
          {query && total === 0 && (
            <p className="mt-4 rounded-2xl bg-white/70 p-6 text-ink-soft ring-1 ring-lavender/40">
              Nothing found for “{query}”. Try another word.
            </p>
          )}

          <div className="mt-6 space-y-8">
            {months.length > 0 && (
              <Group title="Months">
                {months.map((m) => (
                  <Row key={m.monthNumber} href={`/month/${m.monthNumber}`} label={m.title} tag={monthLabel(m.monthNumber)} />
                ))}
              </Group>
            )}
            {memories.length > 0 && (
              <Group title="Memories">
                {memories.map((m, i) => (
                  <Row key={i} href={`/month/${m.monthNumber}#memories`} label={m.title} tag={monthLabel(m.monthNumber)} />
                ))}
              </Group>
            )}
            {family.length > 0 && (
              <Group title="Family">
                {family.map((f) => (
                  <Row key={f.id} href="/family" label={f.name} tag={f.relation} />
                ))}
              </Group>
            )}
            {places.length > 0 && (
              <Group title="Places">
                {places.map((p) => (
                  <Row key={p.id} href="/places" label={p.name} />
                ))}
              </Group>
            )}
            {events.length > 0 && (
              <Group title="Events">
                {events.map((e) => (
                  <Row key={e.id} href="/events" label={e.name} />
                ))}
              </Group>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 font-hand text-2xl text-soft-pink-deep">{title}</h2>
      <ul className="divide-y divide-lavender/30 overflow-hidden rounded-2xl bg-white/70 ring-1 ring-lavender/40">
        {children}
      </ul>
    </div>
  );
}

function Row({ href, label, tag }: { href: string; label: string; tag?: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between px-5 py-3 hover:bg-cream">
        <span className="font-medium text-ink">{label}</span>
        {tag && <span className="text-xs text-ink-soft">{tag}</span>}
      </Link>
    </li>
  );
}
