"use client";

import { motion } from "framer-motion";
import type { TimelineItem } from "@/types";
import { ACCENT_CLASSES } from "@/lib/months";

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
      <div
        className={`group w-full rounded-3xl ${accent.bg} p-6 shadow-sm ring-1 ${accent.ring}/40 transition-all hover:-translate-y-1 hover:shadow-xl`}
      >
        <span className="font-hand text-2xl text-ink-soft">
          {item.monthNumber === 0
            ? "Day one"
            : item.monthNumber === 12
              ? "One year"
              : `Month ${item.monthNumber}`}
        </span>
        <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="mt-2 text-ink-soft">{item.subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
