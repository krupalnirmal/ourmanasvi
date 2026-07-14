"use client";

import { motion } from "framer-motion";
import { cld, banner } from "@/lib/cld";
import type { BabyInfo } from "@/lib/data";

const LOGO =
  "https://res.cloudinary.com/dt1zpdsy1/image/upload/v1784023832/ourmanasvi/logo.png";

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
  const bg = photos[0];
  const cluster = photos.slice(1, 4);
  const dates =
    baby?.birthDate && baby?.firstBirthday
      ? `${fmt(baby.birthDate)}  —  ${fmt(baby.firstBirthday)}`
      : "Birth to First Birthday";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      {/* Photo background */}
      {bg && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner(bg)} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/25 to-cream" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 40%, rgba(255,248,240,0.88), rgba(255,248,240,0) 70%)",
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
        {/* Big logo as the centrepiece */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cld(LOGO, "h_520,c_limit,q_auto,f_auto")}
            alt="OurManasvi — A Year of Firsts"
            className="h-40 w-auto drop-shadow-sm sm:h-56"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{ textShadow: "0 1px 12px rgba(255,248,240,0.95)" }}
          className="mt-4 font-hand text-2xl text-soft-pink-deep sm:text-3xl"
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
          <div className="mt-9 flex items-end justify-center gap-3 sm:gap-5">
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
          className="mt-9 flex items-center justify-center gap-4"
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
