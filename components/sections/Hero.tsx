"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { heroBanner } from "@/lib/cld";
import { claimAudio, releaseAudio } from "@/lib/audio-bus";
import type { BabyInfo, StorySlide } from "@/lib/data";
import JourneyStory from "@/components/sections/JourneyStory";

const ROTATE_MS = 5000;

export default function Hero({
  photos = [],
  baby,
  story = [],
  audioUrl,
  bannerAudio,
}: {
  photos?: string[];
  baby?: BabyInfo | null;
  story?: StorySlide[];
  audioUrl?: string;
  bannerAudio?: string;
}) {
  const banners = baby?.coverImage
    ? [baby.coverImage, ...photos.filter((p) => p !== baby.coverImage)]
    : photos;
  const [idx, setIdx] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stoppedByUser = useRef(false); // respect a manual stop
  const inView = useRef(true);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [banners.length]);

  /**
   * Music: browsers block autoplay with sound until the visitor has interacted
   * with the page, so we try immediately and otherwise start on their first
   * tap. It plays only while the banner is on screen, and a manual stop sticks.
   */
  useEffect(() => {
    if (!bannerAudio) return;

    const tryPlay = () => {
      const a = audioRef.current;
      if (!a || stoppedByUser.current || !inView.current) return;
      a.play()
        .then(() => {
          setMusicOn(true);
          // Anything else playing (e.g. the story player) stops.
          claimAudio("banner", () => {
            a.pause();
            setMusicOn(false);
          });
        })
        .catch(() => {});
    };

    tryPlay(); // works if the browser already trusts this site

    const onFirstGesture = () => tryPlay();
    document.addEventListener("pointerdown", onFirstGesture, { once: true });
    document.addEventListener("keydown", onFirstGesture, { once: true });

    // Pause when the banner scrolls out of view, resume when it's back.
    const el = sectionRef.current;
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(
        ([entry]) => {
          inView.current = entry.isIntersecting;
          const a = audioRef.current;
          if (!a) return;
          if (!entry.isIntersecting) {
            a.pause();
            releaseAudio("banner");
            setMusicOn(false);
          } else {
            tryPlay();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(el);
    }

    return () => {
      document.removeEventListener("pointerdown", onFirstGesture);
      document.removeEventListener("keydown", onFirstGesture);
      io?.disconnect();
    };
  }, [bannerAudio]);

  function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) {
      a.pause();
      releaseAudio("banner");
      stoppedByUser.current = true; // don't auto-resume after a manual stop
      setMusicOn(false);
    } else {
      stoppedByUser.current = false;
      a.play()
        .then(() => {
          setMusicOn(true);
          claimAudio("banner", () => {
            a.pause();
            setMusicOn(false);
          });
        })
        .catch(() => {});
    }
  }

  return (
    <section ref={sectionRef} className="px-3 pt-4 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-b from-cream-deep via-cream to-soft-pink/15 shadow-sm ring-1 ring-lavender/30 md:bg-gradient-to-br">
        <div className="grid md:grid-cols-2 md:items-center">
          {/* Photo — first on mobile, right on desktop */}
          <div className="relative order-1 h-72 w-full overflow-hidden sm:h-96 md:order-2 md:h-[27rem]">
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
            {/* Blend into the card: bottom on mobile, left on desktop */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream via-cream/15 to-transparent md:hidden" />
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-cream via-cream/35 to-transparent md:block" />

            {/* Decorations */}
            <span className="pointer-events-none absolute left-4 top-4 text-3xl opacity-90 md:right-6 md:left-auto" aria-hidden>
              ☁️
            </span>
            <span className="pointer-events-none absolute left-12 top-20 text-sm text-amber-300" aria-hidden>
              ★
            </span>
            <span className="pointer-events-none absolute right-8 top-24 text-sm text-amber-300" aria-hidden>
              ★
            </span>
            <span className="pointer-events-none absolute right-6 top-1/2 text-4xl text-soft-pink-deep/70 md:hidden" aria-hidden>
              ♡
            </span>

            {/* Slide with music */}
            {bannerAudio && (
              <>
                <audio ref={audioRef} src={bannerAudio} loop preload="auto" />
                <button
                  onClick={toggleMusic}
                  aria-pressed={musicOn}
                  className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold shadow-md ring-1 ring-white/60 backdrop-blur-md transition-transform hover:scale-105 ${
                    musicOn ? "bg-soft-pink-deep text-white" : "bg-white/85 text-ink"
                  }`}
                >
                  <span aria-hidden>{musicOn ? "❚❚" : "♪"}</span>
                  {musicOn ? "Music on" : "Slide with music"}
                </button>
              </>
            )}
          </div>

          {/* Copy — below photo on mobile, left on desktop */}
          <div className="relative z-10 order-2 px-7 pb-9 pt-2 text-center md:order-1 md:pb-12 md:pl-12 md:pt-12 md:text-left">
            <p className="text-lg font-medium text-ink">Welcome to</p>
            <h1 className="mt-1 font-hand text-5xl font-bold leading-tight text-soft-pink-deep sm:text-6xl">
              My Little World
            </h1>

            <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
              <span className="h-px w-9 bg-lavender-deep/40" />
              <span className="text-sm text-soft-pink-deep" aria-hidden>
                ♥
              </span>
              <span className="h-px w-9 bg-lavender-deep/40" />
            </div>

            <p className="mx-auto mt-4 max-w-xs text-ink-soft md:mx-0 md:max-w-sm">
              {baby?.tagline ??
                "Every smile, every giggle, every tiny step… these are the moments we live for."}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-soft-pink-deep px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-soft-pink/40 transition-transform hover:scale-105"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                Explore Memories
              </Link>
              <JourneyStory slides={story} audioUrl={audioUrl} babyName={baby?.name} />
            </div>
          </div>
        </div>

        {/* Banner dots (only while the row stays tidy) */}
        {banners.length > 1 && banners.length <= 10 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:bottom-4">
            {banners.map((_, i) => (
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
