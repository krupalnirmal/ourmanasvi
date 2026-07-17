"use client";

import type { TimelineItem } from "@/types";
import MonthCard from "@/components/ui/MonthCard";

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <section id="timeline" className="relative bg-cream px-6 pb-24 pt-12">
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10">
        {/* Center spine (desktop) */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-lavender-deep/40 md:block" />
        {items.map((item, i) => (
          <MonthCard key={item.monthNumber} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
