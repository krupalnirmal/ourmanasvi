"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { thumb } from "@/lib/cld";
import type { RecentMoment } from "@/lib/data";

export default function RecentMoments({ moments }: { moments: RecentMoment[] }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-lavender/30 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
          Recent Moments
          <span className="text-soft-pink-deep" aria-hidden>
            ♥
          </span>
        </h2>
        <Link
          href="/gallery"
          className="text-sm font-medium text-soft-pink-deep hover:underline"
        >
          View All →
        </Link>
      </div>

      {moments.length === 0 ? (
        <p className="py-8 text-center text-ink-soft">Photos coming soon 💕</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {moments.map((m, i) => (
            <motion.div
              key={m.monthNumber}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/month/${m.monthNumber}`}
                className="group block overflow-hidden rounded-2xl ring-1 ring-lavender/30 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden bg-lavender/20">
                  {m.coverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={thumb(m.coverImage)}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="bg-white px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-ink">{m.title}</p>
                  <p className="text-xs text-ink-soft">{m.photoCount} Photos</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
