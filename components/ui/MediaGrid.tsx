"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { thumb, large } from "@/lib/cld";
import type { MediaItem } from "@/lib/data";

/**
 * Mixed photo/video grid with a lightbox. Video tiles show a play badge;
 * in the lightbox they play with native controls.
 */
export default function MediaGrid({ media }: { media: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + media.length) % media.length)),
    [media.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  const item = open !== null ? media[open] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {media.map((m, i) => (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-lavender/20 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-soft-pink-deep/50"
            aria-label={m.kind === "video" ? "Play video" : "View photo"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb(m.kind === "video" ? m.thumbnail ?? m.url : m.url)}
              alt={m.caption ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {m.kind === "video" && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-lg text-white ring-1 ring-white/60 backdrop-blur-sm transition-transform group-hover:scale-110">
                  ▶
                </span>
              </span>
            )}
            <span className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-ink shadow ring-1 ring-white/60 backdrop-blur-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {item && open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
              aria-label="Close"
            >
              ✕
            </button>
            {media.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); go(-1); }}
                  className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 sm:left-6"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); go(1); }}
                  className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 sm:right-6"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}

            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full w-full max-w-4xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {item.kind === "video" ? (
                <video
                  key={item.url}
                  src={item.url}
                  poster={item.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[80vh] w-auto max-w-full rounded-2xl bg-black shadow-2xl"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={large(item.url)}
                  alt={item.caption ?? ""}
                  className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
                />
              )}
              <p className="mt-3 text-sm text-white/60">
                {open + 1} / {media.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
