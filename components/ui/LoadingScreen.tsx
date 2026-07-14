"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/** Gentle intro veil that fades away once the page is ready. */
export default function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl"
            aria-hidden
          >
            🍼
          </motion.div>
          <p className="mt-4 font-hand text-2xl text-ink-soft">
            Opening the memory book…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
