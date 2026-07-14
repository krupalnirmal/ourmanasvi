"use client";

import { motion } from "framer-motion";
import type { TimelineItem } from "@/types";
import MonthCard from "@/components/ui/MonthCard";

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section id="timeline" className="relative bg-cream py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-semibold text-ink sm:text-5xl"
        >
          The Journey, Month by Month
        </motion.h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Scroll through a whole year of little firsts and big feelings.
        </p>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-5xl flex-col gap-10">
        {/* Center spine (desktop) */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-lavender-deep/40 md:block" />
        {items.map((item, i) => (
          <MonthCard key={item.monthNumber} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
