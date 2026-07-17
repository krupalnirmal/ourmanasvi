"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const LINKS = [
  {
    href: "/journey",
    label: "Timeline",
    sub: "Journey by months",
    bg: "#F98A80",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...S}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/gallery",
    label: "Gallery",
    sub: "Photos & Videos",
    bg: "#6FCDA8",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...S}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
  },
  {
    href: "/events",
    label: "Events",
    sub: "Birthdays & more",
    bg: "#F9C255",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...S}>
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M2 21h20M7 11V7M12 11V7M17 11V7M12 4h.01M7 4h.01M17 4h.01" />
      </svg>
    ),
  },
  {
    href: "/milestones",
    label: "Milestones",
    sub: "Special Moments",
    bg: "#B9A3E3",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...S}>
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9z" />
      </svg>
    ),
  },
  {
    href: "/places",
    label: "Trips",
    sub: "Our Adventures",
    bg: "#74BFE8",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...S}>
        <path d="M17.8 19.8 16 14l-4 1 1-4-5.8-1.8a1 1 0 0 1-.4-1.7l1.3-1.2a1 1 0 0 1 1-.2L14 8l4.6-4.6a2 2 0 1 1 2.8 2.8L17 10.8l1.9 6.9a1 1 0 0 1-.2 1l-1.2 1.3a1 1 0 0 1-1.7-.2z" />
      </svg>
    ),
  },
  {
    href: "/family",
    label: "Family",
    sub: "Our Loved Ones",
    bg: "#F79EB6",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...S}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.2" />
        <path d="M3 20a6 6 0 0 1 12 0M15.5 20a5 5 0 0 1 5.5-4.6" />
      </svg>
    ),
  },
];

export default function QuickLinks() {
  return (
    <section className="px-3 pt-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 lg:grid-cols-6">
        {LINKS.map((l, i) => (
          <motion.div
            key={l.href}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={l.href}
              className="group flex h-full flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-lavender/25 transition-all hover:-translate-y-1 hover:shadow-md lg:flex-row lg:gap-3 lg:p-3.5 lg:text-left"
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-105 lg:h-11 lg:w-11"
                style={{ backgroundColor: l.bg }}
                aria-hidden
              >
                {l.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{l.label}</span>
                <span className="block truncate text-[11px] text-ink-soft lg:text-xs">{l.sub}</span>
              </span>
              <span className="hidden text-ink-soft transition-transform group-hover:translate-x-0.5 lg:block" aria-hidden>
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
