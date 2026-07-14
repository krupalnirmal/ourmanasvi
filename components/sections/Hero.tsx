"use client";

import { motion } from "framer-motion";
import { cld, banner } from "@/lib/cld";
import type { BabyInfo } from "@/lib/data";

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Hero({
  photos = [],
  baby,
}: {
  photos?: string[];
  baby?: BabyInfo | null;
}) {
  // Admin-chosen cover wins; otherwise fall back to the latest photo.
  const bg = baby?.coverImage || photos[0];
  // Avoid repeating the background photo in the polaroid cluster.
  const cluster = baby?.coverImage ? photos.slice(0, 3) : photos.slice(1, 4);
  const dates =
    baby?.birthDate && baby?.firstBirthday
      ? `${fmt(baby.birthDate)}  —  ${fmt(baby.firstBirthday)}`
      : "Birth to First Birthday";

  return (
    <section className="relative flex min-h-[82vh] flex-col items-center justify-end overflow-hidden px-6 pb-12 pt-24 text-center sm:min-h-[86vh]">
      {/* Photo background — subject kept high so content sits below the face */}
      {bg && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner(bg)}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-[50%_15%]"
          />
          {/* Top stays clear (face visible); cream builds toward the bottom for legible text */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream/0 via-cream/70 to-cream" />
          {/* Extra cream glow right where the text sits */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 45% at 50% 68%, rgba(255,248,240,0.8), rgba(255,248,240,0) 72%)",
            }}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-soft-pink/30 opacity-60 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-baby-blue/30 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lavender/40 opacity-60 blur-3xl" />
      </div>

      <div className="max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textShadow: "0 2px 18px rgba(255,248,240,0.95)" }}
          className="font-display text-4xl font-semibold leading-tight text-ink sm:text-6xl"
        >
          A Year of Firsts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{ textShadow: "0 1px 10px rgba(255,248,240,1)" }}
          className="mt-4 font-hand text-2xl font-semibold text-rose-deep sm:text-3xl"
        >
          {dates}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ textShadow: "0 1px 12px rgba(255,248,240,0.95)" }}
          className="mx-auto mt-5 max-w-xl text-lg text-ink-soft"
        >
          {baby?.tagline ??
            "Every giggle, every tiny milestone, every unforgettable moment of Manasvi's first year — gathered here, month by month."}
        </motion.p>

        {cluster.length > 0 && (
          <div className="mt-6 flex items-end justify-center gap-3 sm:gap-5">
            {cluster.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 24 }}
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
          className="mt-7 flex items-center justify-center gap-4"
        >
          <a
            href="#timeline"
            className="rounded-full bg-soft-pink-deep px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-soft-pink/50 transition-transform hover:scale-105"
          >
            Begin the Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
