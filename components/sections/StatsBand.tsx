"use client";

import { motion } from "framer-motion";
import type { Stats } from "@/lib/data";

export default function StatsBand({ stats }: { stats: Stats }) {
  const items = [
    { value: stats.months, label: "Months" },
    { value: stats.photos, label: "Moments" },
    { value: stats.videos, label: "Videos" },
    { value: "∞", label: "Love" },
  ];

  return (
    <section className="bg-cream px-6 pt-16">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <div className="font-display text-4xl font-semibold text-soft-pink-deep sm:text-5xl">
              {it.value}
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-wide text-ink-soft">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
