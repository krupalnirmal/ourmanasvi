"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TimelineItem } from "@/types";
import { ACCENT_CLASSES, monthLabel } from "@/lib/months";
import { thumb } from "@/lib/cld";

export default function MonthCard({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) {
  const accent = ACCENT_CLASSES[item.accent];
  const alignLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: alignLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`relative flex w-full md:w-1/2 ${
        alignLeft ? "md:self-start md:pr-12" : "md:self-end md:pl-12"
      }`}
    >
      <Link
        href={`/month/${item.monthNumber}`}
        className={`group w-full overflow-hidden rounded-3xl ${accent.bg} shadow-sm ring-1 ${accent.ring}/40 transition-all hover:-translate-y-1 hover:shadow-xl`}
      >
        {item.coverImage && (
          <div className="relative h-44 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb(item.coverImage)}
              alt=""
              aria-hidden
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <span className="font-hand text-2xl text-ink-soft">
            {monthLabel(item.monthNumber)}
          </span>
          <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
            {item.title}
          </h3>
          {item.subtitle && <p className="mt-2 text-ink-soft">{item.subtitle}</p>}
          <span
            className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${accent.text} opacity-0 transition-opacity group-hover:opacity-100`}
          >
            Open this month →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
