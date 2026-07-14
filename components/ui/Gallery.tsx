"use client";

import { motion } from "framer-motion";
import type { TimelineItem } from "@/types";
import { ACCENT_CLASSES } from "@/lib/months";

/**
 * Gallery grid. Each tile is a graceful placeholder for now; once Cloudinary
 * is wired, `imageUrl` slots straight into these tiles (replace the gradient).
 */
export default function Gallery({
  photos,
  accent,
}: {
  photos: { caption: string; imageUrl?: string }[];
  accent: TimelineItem["accent"];
}) {
  const a = ACCENT_CLASSES[accent];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {photos.map((photo, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="group overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
        >
          <div
            className={`relative flex aspect-square items-center justify-center ${a.bg}`}
          >
            {photo.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="text-3xl opacity-60" aria-hidden>
                📷
              </span>
            )}
          </div>
          <figcaption className="bg-white/70 px-3 py-2 text-center font-hand text-lg text-ink-soft">
            {photo.caption}
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
