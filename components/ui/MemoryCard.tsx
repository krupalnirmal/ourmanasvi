"use client";

import { motion } from "framer-motion";
import type { MonthMemory } from "@/lib/journey-data";

export default function MemoryCard({
  memory,
  index,
}: {
  memory: MonthMemory;
  index: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-lavender/40 backdrop-blur"
    >
      <div className="mb-2 flex items-center gap-2">
        {memory.mood && <span className="text-2xl">{memory.mood}</span>}
        <h4 className="font-display text-xl font-semibold text-ink">
          {memory.title}
        </h4>
      </div>
      <blockquote className="font-hand text-xl leading-relaxed text-ink-soft">
        “{memory.content}”
      </blockquote>
    </motion.figure>
  );
}
