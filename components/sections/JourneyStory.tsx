"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cld } from "@/lib/cld";
import { monthLabel } from "@/lib/months";
import type { StorySlide } from "@/lib/data";

const SLIDE_MS = 3800;

export default function JourneyStory({
  slides,
  audioUrl,
  babyName = "Manasvi",
}: {
  slides: StorySlide[];
  audioUrl?: string;
  babyName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const total = slides.length;

  function playAudio() {
    audioRef.current?.play?.().catch(() => {});
  }

  function start() {
    setOpen(true);
    setI(0);
    setEnded(false);
    setPlaying(true);
    playAudio(); // synchronous within the click → allowed to autoplay
  }

  function close() {
    setOpen(false);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  function togglePlay() {
    setPlaying((p) => {
      const next = !p;
      if (audioRef.current) next ? playAudio() : audioRef.current.pause();
      return next;
    });
  }

  function replay() {
    setI(0);
    setEnded(false);
    setPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      playAudio();
    }
  }

  // Auto-advance slides.
  useEffect(() => {
    if (!open || !playing || ended || total === 0) return;
    const t = setTimeout(() => {
      setI((prev) => {
        if (prev + 1 >= total) {
          setEnded(true);
          return prev;
        }
        return prev + 1;
      });
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [open, playing, i, ended, total]);

  useEffect(() => {
    if (ended && audioRef.current) audioRef.current.pause();
  }, [ended]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (total === 0) return null;
  const slide = slides[Math.min(i, total - 1)];

  return (
    <>
      <button
        onClick={start}
        className="inline-flex items-center gap-2 rounded-full border-2 border-soft-pink-deep bg-white/80 px-7 py-3 text-sm font-semibold text-soft-pink-deep shadow-md backdrop-blur transition-transform hover:scale-105"
      >
        <span aria-hidden>▶</span> Watch our Journey
      </button>

      {/* Audio kept mounted so it can start on the click gesture */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop preload="auto" />}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black"
          >
            {!ended ? (
              <AnimatePresence mode="sync">
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  {/* Blurred backdrop fills the screen (crop is fine when blurred) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cld(slide.imageUrl, "w_1280,h_720,c_fill,q_auto,f_auto,e_blur:1500")}
                    alt=""
                    aria-hidden
                    className="animate-kenburns absolute inset-0 h-full w-full scale-110 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  {/* Full image, never cropped */}
                  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cld(slide.imageUrl, "w_1600,h_1600,c_limit,q_auto,f_auto")}
                      alt=""
                      aria-hidden
                      className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-20 text-center">
                    <p className="font-hand text-2xl text-white/90 sm:text-3xl">
                      {monthLabel(slide.monthNumber)}
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold text-white drop-shadow sm:text-4xl">
                      {slide.label}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-soft-pink-deep via-rose-deep to-lavender-deep px-6 text-center text-white"
              >
                <p className="font-hand text-4xl sm:text-5xl">Happy 1st Birthday</p>
                <p className="mt-2 font-display text-5xl font-semibold sm:text-6xl">
                  {babyName} 🎂
                </p>
                <p className="mt-4 max-w-sm text-white/85">
                  A whole year of firsts, love and little miracles.
                </p>
                <button
                  onClick={replay}
                  className="mt-8 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-lg transition-transform hover:scale-105"
                >
                  ↺ Replay
                </button>
              </motion.div>
            )}

            {/* Progress segments */}
            <div className="absolute inset-x-4 top-4 z-10 flex gap-1">
              {slides.map((_, idx) => (
                <span key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                  <span
                    className={`block h-full bg-white ${
                      idx < i || ended
                        ? "w-full"
                        : idx === i
                          ? "w-full transition-[width] duration-[3800ms] ease-linear"
                          : "w-0"
                    }`}
                  />
                </span>
              ))}
            </div>

            {/* Controls */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25"
            >
              ✕
            </button>
            {!ended && (
              <button
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="absolute bottom-5 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              >
                {playing ? "❚❚" : "▶"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
