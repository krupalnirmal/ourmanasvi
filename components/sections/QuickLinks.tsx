"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = [
  { href: "/journey", label: "Timeline", sub: "Journey by months", icon: "📅", bg: "bg-soft-pink/40", fg: "text-rose-deep" },
  { href: "/gallery", label: "Gallery", sub: "Photos & Videos", icon: "🖼️", bg: "bg-baby-blue/40", fg: "text-baby-blue-deep" },
  { href: "/events", label: "Events", sub: "Birthdays & more", icon: "🎂", bg: "bg-cream-deep", fg: "text-ink-soft" },
  { href: "/milestones", label: "Milestones", sub: "Special Moments", icon: "⭐", bg: "bg-lavender/50", fg: "text-lavender-deep" },
  { href: "/places", label: "Trips", sub: "Our Adventures", icon: "✈️", bg: "bg-baby-blue/40", fg: "text-baby-blue-deep" },
  { href: "/family", label: "Family", sub: "Our Loved Ones", icon: "👪", bg: "bg-soft-pink/40", fg: "text-rose-deep" },
];

export default function QuickLinks() {
  return (
    <section className="px-3 pt-5 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {LINKS.map((l, i) => (
          <motion.div
            key={l.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={l.href}
              className="group flex h-full items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-lavender/30 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${l.bg}`}
                aria-hidden
              >
                {l.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{l.label}</span>
                <span className="block truncate text-xs text-ink-soft">{l.sub}</span>
              </span>
              <span className="text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
