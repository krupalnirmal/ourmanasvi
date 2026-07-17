"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { heroBanner } from "@/lib/cld";
import type { BabyInfo, StorySlide } from "@/lib/data";
import JourneyStory from "@/components/sections/JourneyStory";

const ROTATE_MS = 5000;

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
  const banners = baby?.coverImage
    ? [baby.coverImage, ...photos.filter((p) => p !== baby.coverImage)]
    : photos;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [banners.length]);

  return (
    <section className="px-3 pt-4 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-cream-deep via-cream to-soft-pink/20 shadow-sm ring-1 ring-lavender/30">
        {/* Decorations */}
        <span className="pointer-events-none absolute left-6 top-4 text-2xl opacity-70" aria-hidden>
          🎊
        </span>
        <span className="pointer-events-none absolute left-1/3 top-8 text-sm text-soft-pink-deep/60" aria-hidden>
          ✦
        </span>
        <span className="pointer-events-none absolute bottom-8 left-10 text-xs text-lavender-deep/60" aria-hidden>
          ✦
        </span>

        <div className="grid items-center gap-6 md:grid-cols-2">
          {/* Left: copy */}
          <div className="relative z-10 px-7 pb-8 pt-12 text-center md:pl-12 md:text-left">
            <p className="text-lg font-medium text-ink-soft">Welcome to</p>
            <h1 className="mt-1 font-hand text-5xl font-bold leading-tight text-soft-pink-deep sm:text-6xl">
              My Little World
              <span className="ml-2 inline-block align-middle text-2xl" aria-hidden>
                ♥
              </span>
            </h1>

            <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
              <span className="h-px w-10 bg-lavender-deep/50" />
              <span className="text-sm text-soft-pink-deep" aria-hidden>
                ♥
              </span>
              <span className="h-px w-10 bg-lavender-deep/50" />
            </div>

            <p className="mx-auto mt-4 max-w-sm text-ink-soft md:mx-0">
              {baby?.tagline ??
                "Every smile, every giggle, every tiny step… these are the moments we live for."}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-soft-pink-deep px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-soft-pink/40 transition-transform hover:scale-105"
              >
                <span aria-hidden>🖼️</span> Explore Memories
              </Link>
              <JourneyStory slides={story} audioUrl={audioUrl} babyName={baby?.name} />
            </div>
          </div>

          {/* Right: rotating photo */}
          <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-[26rem]">
            <AnimatePresence mode="sync">
              {banners.length > 0 && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroBanner(banners[idx])}
                    alt=""
                    aria-hidden
                    className="animate-kenburns-soft h-full w-full object-cover object-center"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Blend the photo into the card on the left edge */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream via-cream/25 to-transparent md:from-cream md:via-cream/40" />
            {/* Cloud + stars */}
            <span className="pointer-events-none absolute right-5 top-5 text-3xl opacity-80" aria-hidden>
              ☁️
            </span>
            <span className="pointer-events-none absolute right-16 top-16 text-xs text-soft-pink-deep/70" aria-hidden>
              ✦
            </span>
          </div>
        </div>

        {/* Banner dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
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
