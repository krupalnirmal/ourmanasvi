"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Dreamy pastel background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-soft-pink/40 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-baby-blue/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/0 via-cream/20 to-cream" />
      </div>

      <div className="max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-hand text-3xl text-soft-pink-deep"
        >
          Birth to First Birthday
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-3 font-display text-5xl font-semibold leading-tight text-ink sm:text-7xl"
        >
          A Year of Firsts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-6 max-w-xl text-lg text-ink-soft"
        >
          Every giggle, every tiny milestone, every unforgettable moment of
          Manasvi&apos;s first year — gathered here, month by month.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#timeline"
            className="rounded-full bg-soft-pink-deep px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-soft-pink/50 transition-transform hover:scale-105"
          >
            Begin the Journey
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl text-ink-soft"
        aria-hidden
      >
        ↓
      </motion.div>
    </section>
  );
}
