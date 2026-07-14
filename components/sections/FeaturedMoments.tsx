"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { FeaturedMoment } from "@/lib/data";
import { thumb } from "@/lib/cld";
import { monthLabel } from "@/lib/months";

export default function FeaturedMoments({ moments }: { moments: FeaturedMoment[] }) {
  if (moments.length === 0) return null;

  return (
    <section className="bg-cream px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-hand text-3xl text-soft-pink-deep">little glimpses</p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Featured Moments
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {moments.map((m, i) => (
            <motion.div
              key={m.imageUrl}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              className={i % 5 === 0 ? "sm:row-span-2" : ""}
            >
              <Link
                href={`/month/${m.monthNumber}`}
                className="group relative block h-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb(m.imageUrl)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    i % 5 === 0 ? "aspect-square sm:h-full" : "aspect-square"
                  }`}
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-black/0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">
                    {monthLabel(m.monthNumber)} →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
