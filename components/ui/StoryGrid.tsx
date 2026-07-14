import { thumb } from "@/lib/cld";

export interface StoryItem {
  id: string;
  name: string;
  description?: string;
  date?: string;
  imageUrl?: string;
}

function fmt(d?: string) {
  return d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
}

export default function StoryGrid({
  items,
  emptyText,
  fallbackEmoji = "📍",
}: {
  items: StoryItem[];
  emptyText: string;
  fallbackEmoji?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="mx-auto mt-14 max-w-md rounded-3xl bg-white/70 p-8 text-center text-ink-soft shadow-sm ring-1 ring-lavender/40">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <article
          key={it.id}
          className="overflow-hidden rounded-3xl bg-white/80 shadow-sm ring-1 ring-lavender/40 transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative flex aspect-[4/3] items-center justify-center bg-lavender/20">
            {it.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={thumb(it.imageUrl)} alt={it.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl opacity-60">{fallbackEmoji}</span>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-semibold text-ink">{it.name}</h3>
            {it.date && <p className="mt-0.5 text-sm text-soft-pink-deep">{fmt(it.date)}</p>}
            {it.description && <p className="mt-2 text-sm text-ink-soft">{it.description}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
