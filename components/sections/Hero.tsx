"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { banner } from "@/lib/cld";
import type { BabyInfo, StorySlide } from "@/lib/data";
import JourneyStory from "@/components/sections/JourneyStory";

const ROTATE_MS = 5000;

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
  story = [],
  audioUrl,
}: {
  photos?: string[];
  baby?: BabyInfo | null;
  story?: StorySlide[];
  audioUrl?: string;
}) {
  // Admin-chosen cover leads the rotation; then the rest of the photos.
  const banners = baby?.coverImage
    ? [baby.coverImage, ...photos.filter((p) => p !== baby.coverImage)]
    : photos;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [banners.length]);

  const dates =
    baby?.birthDate && baby?.firstBirthday
      ? `${fmt(baby.birthDate)}  —  ${fmt(baby.firstBirthday)}`
      : "Birth to First Birthday";

  return (
    <section className="relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* Rotating photo banner */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-cream">
        <AnimatePresence mode="sync">
          {banners.length > 0 && (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner(banners[idx])}
                alt=""
                aria-hidden
                className="animate-kenburns h-full w-full object-cover object-[50%_22%]"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Wash: photo stays visible up top, cream builds behind the text */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/25 via-cream/65 to-cream" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(255,248,240,0.8), rgba(255,248,240,0) 72%)",
          }}
        />
      </div>

      <div className="max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textShadow: "0 2px 18px rgba(255,248,240,0.95)" }}
          className="font-display text-5xl font-semibold leading-tight text-ink sm:text-7xl"
        >
          A Year of Firsts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ textShadow: "0 1px 10px rgba(255,248,240,1)" }}
          className="mt-4 font-hand text-2xl font-semibold text-rose-deep sm:text-3xl"
        >
          {dates}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ textShadow: "0 1px 12px rgba(255,248,240,0.95)" }}
          className="mx-auto mt-5 max-w-xl text-lg text-ink-soft"
        >
          {baby?.tagline ??
            "Every giggle, every tiny milestone, every unforgettable moment of Manasvi's first year — gathered here, month by month."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <JourneyStory slides={story} audioUrl={audioUrl} babyName={baby?.name} />
          <Link
            href="/journey"
            className="rounded-full bg-soft-pink-deep px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-soft-pink/50 transition-transform hover:scale-105"
          >
            Explore the Journey
          </Link>
        </motion.div>

        {/* Banner dots */}
        {banners.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {banners.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show banner photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-5 bg-soft-pink-deep" : "w-1.5 bg-ink-soft/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
