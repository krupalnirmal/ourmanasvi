"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimelineItem } from "@/types";
import { ACCENT_CLASSES } from "@/lib/months";
import { thumb, large } from "@/lib/cld";

type Photo = { caption: string; imageUrl?: string };

/**
 * Responsive gallery with a full-screen lightbox. Click any real photo to
 * view it large; navigate with arrows / keyboard, close with Esc or a tap.
 */
export default function Gallery({
  photos,
  accent,
}: {
  photos: Photo[];
  accent: TimelineItem["accent"];
}) {
  const a = ACCENT_CLASSES[accent];
  const viewable = photos.filter((p) => !!p.imageUrl);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) =>
      setOpen((i) =>
        i === null ? i : (i + dir + viewable.length) % viewable.length
      ),
    [viewable.length]
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

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo, i) => {
          const viewIndex = viewable.findIndex((v) => v === photo);
          const clickable = !!photo.imageUrl;
          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
            >
              <button
                type="button"
                onClick={() => clickable && setOpen(viewIndex)}
                className={`relative flex aspect-square w-full items-center justify-center ${a.bg} ${
                  clickable ? "cursor-zoom-in" : "cursor-default"
                }`}
                aria-label={clickable ? `View ${photo.caption || "photo"}` : undefined}
              >
                {photo.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb(photo.imageUrl)}
                      alt={photo.caption}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-white/0 transition-all group-hover:bg-black/25 group-hover:text-white/90">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
                        View
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="text-3xl opacity-60" aria-hidden>
                    📷
                  </span>
                )}
              </button>
              {photo.caption && (
                <figcaption className="bg-white/70 px-3 py-2 text-center font-hand text-lg text-ink-soft">
                  {photo.caption}
                </figcaption>
              )}
            </motion.figure>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && viewable[open] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
              aria-label="Close"
            >
              ✕
            </button>

            {viewable.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 sm:left-6"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25 sm:right-6"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}

            <motion.figure
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full max-w-4xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={large(viewable[open].imageUrl)}
                alt={viewable[open].caption}
                className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
              {viewable[open].caption && (
                <figcaption className="mt-4 font-hand text-2xl text-white/90">
                  {viewable[open].caption}
                </figcaption>
              )}
              {viewable.length > 1 && (
                <p className="mt-1 text-sm text-white/50">
                  {open + 1} / {viewable.length}
                </p>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
