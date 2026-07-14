"use client";

import { motion } from "framer-motion";
import type { MonthMilestone } from "@/lib/journey-data";

export default function MilestoneCard({
  milestone,
  index,
}: {
  milestone: MonthMilestone;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="flex items-start gap-3 rounded-2xl bg-baby-blue/25 p-4 ring-1 ring-baby-blue/40"
    >
      <span className="text-2xl leading-none" aria-hidden>
        {milestone.icon ?? "✨"}
      </span>
      <div>
        <p className="font-semibold text-ink">{milestone.title}</p>
        {milestone.description && (
          <p className="text-sm text-ink-soft">{milestone.description}</p>
        )}
      </div>
    </motion.li>
  );
}
