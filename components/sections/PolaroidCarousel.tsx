"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cld } from "@/lib/cld";

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const ROTATE = [-7, 3, -4];
const SIZE = (i: number) =>
  i === 1 ? "h-36 w-28 sm:h-48 sm:w-40" : "h-28 w-24 sm:h-40 sm:w-32";

/** Auto-sliding polaroid trio; cycles through all photos in groups of 3. */
export default function PolaroidCarousel({ photos }: { photos: string[] }) {
  const groups = chunk(photos, 3).filter((g) => g.length > 0);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (groups.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % groups.length), 3600);
    return () => clearInterval(t);
  }, [groups.length]);

  if (groups.length === 0) return null;
  const group = groups[idx % groups.length];

  return (
    <div className="mt-6">
      <div className="relative mx-auto flex h-40 max-w-md items-end justify-center sm:h-52">
        <AnimatePresence mode="sync">
          <motion.div
            key={idx}
            className="absolute inset-0 flex items-end justify-center gap-3 sm:gap-5"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {group.map((url, i) => (
              <motion.div
                key={url}
                initial={{ y: 26, rotate: 0, opacity: 0 }}
                animate={{ y: 0, rotate: ROTATE[i % 3], opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.08 * i, ease: "easeOut" }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
                className={`overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl ${SIZE(i)}`}
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Group dots */}
      {groups.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {groups.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show photo group ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx % groups.length ? "w-5 bg-soft-pink-deep" : "w-1.5 bg-lavender-deep/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
