"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TimelineItem } from "@/types";
import { thumb } from "@/lib/cld";
import { monthLabel } from "@/lib/months";

/** Homepage teaser that opens the full month-by-month journey. */
export default function JourneyCTA({ items }: { items: TimelineItem[] }) {
  const preview = items.filter((i) => i.coverImage).slice(0, 5);

  return (
    <section className="bg-cream px-6 pb-24 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-soft-pink/25 via-lavender/20 to-baby-blue/25 p-8 shadow-sm ring-1 ring-lavender/40 sm:p-12"
      >
        <div className="text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">a whole year of firsts</p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
            The Journey, Month by Month
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            From her very first day to her first birthday — every month has its own little story.
          </p>
        </div>

        {/* Month peek strip */}
        {preview.length > 0 && (
          <div className="mt-9 flex items-end justify-center gap-2 sm:gap-4">
            {preview.map((m, i) => (
              <Link
                key={m.monthNumber}
                href={`/month/${m.monthNumber}`}
                className={`group relative overflow-hidden rounded-2xl shadow-lg ring-4 ring-white transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                  i === 2 ? "h-32 w-24 sm:h-44 sm:w-36" : "h-24 w-20 sm:h-36 sm:w-28"
                } ${i > 2 ? "hidden sm:block" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb(m.coverImage)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-[10px] font-medium text-white sm:text-xs">
                  {monthLabel(m.monthNumber)}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/journey"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            Open the full journey <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
