"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function daysUntil(dateISO?: string): number | null {
  if (!dateISO) return null;
  const target = new Date(dateISO);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((t.getTime() - n.getTime()) / 86400000);
}

export default function CountdownBanner({ firstBirthday }: { firstBirthday?: string }) {
  const [days, setDays] = useState<number | null>(() => daysUntil(firstBirthday));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDays(daysUntil(firstBirthday));
    if (typeof window !== "undefined" && sessionStorage.getItem("ob_banner") === "off") {
      setDismissed(true);
    }
  }, [firstBirthday]);

  if (dismissed) return null;

  let message = "Celebrating Manasvi's first year";
  if (days !== null) {
    if (days > 1) message = `Manasvi's 1st birthday is just ${days} days away!`;
    else if (days === 1) message = "Just 1 day to Manasvi's 1st birthday!";
    else if (days === 0) message = "Today is Manasvi's 1st birthday!";
    else message = "Manasvi is one year old!";
  }

  return (
    <div className="px-3 pt-3 sm:px-6">
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl bg-gradient-to-r from-soft-pink/30 via-lavender/25 to-baby-blue/30 px-5 py-2.5 pr-12 ring-1 ring-white/50">
        <span className="text-lg" aria-hidden>🎂</span>
        <span className="text-sm font-medium text-ink">{message} 🎉</span>
        <Link
          href="/#timeline"
          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm ring-1 ring-lavender/40 transition-transform hover:scale-105"
        >
          See the journey
        </Link>
        <button
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem("ob_banner", "off");
            } catch {}
          }}
          aria-label="Dismiss"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-white/60"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
