"use client";

import { motion } from "framer-motion";
import { cld, banner } from "@/lib/cld";

export default function Hero({ photos = [] }: { photos?: string[] }) {
  const bg = photos[0];
  const cluster = photos.slice(1, 4);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Photo background — kept clearly visible, with just enough wash for text */}
      {bg && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner(bg)} alt="" aria-hidden className="h-full w-full object-cover" />
          {/* Light top-to-bottom wash: photo shows through, bottom anchors to cream */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/25 to-cream" />
          {/* Soft glow behind the headline so dark text stays legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(255,248,240,0.85), rgba(255,248,240,0) 70%)",
            }}
          />
        </div>
      )}

      {/* Dreamy pastel blobs (subtler over a photo) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute -left-24 top-10 h-80 w-80 rounded-full bg-soft-pink/30 blur-3xl ${bg ? "opacity-60" : ""}`} />
        <div className={`absolute right-0 top-1/3 h-96 w-96 rounded-full bg-baby-blue/30 blur-3xl ${bg ? "opacity-60" : ""}`} />
        <div className={`absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lavender/40 blur-3xl ${bg ? "opacity-60" : ""}`} />
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
          style={{ textShadow: "0 2px 18px rgba(255,248,240,0.95)" }}
          className="mt-3 font-display text-5xl font-semibold leading-tight text-ink sm:text-7xl"
        >
          A Year of Firsts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ textShadow: "0 1px 12px rgba(255,248,240,0.95)" }}
          className="mx-auto mt-6 max-w-xl text-lg text-ink-soft"
        >
          Every giggle, every tiny milestone, every unforgettable moment of
          Manasvi&apos;s first year — gathered here, month by month.
        </motion.p>

        {/* Polaroid cluster of real photos */}
        {cluster.length > 0 && (
          <div className="mt-10 flex items-end justify-center gap-3 sm:gap-5">
            {cluster.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 24, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: [-6, 3, -4][i % 3] }}
                transition={{ duration: 0.7, delay: 0.7 + i * 0.12 }}
                className={`overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl ${
                  i === 1 ? "h-36 w-28 sm:h-48 sm:w-40" : "h-28 w-24 sm:h-40 sm:w-32"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cld(url, "w_320,h_400,c_fill,g_auto,q_auto,f_auto")}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

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
