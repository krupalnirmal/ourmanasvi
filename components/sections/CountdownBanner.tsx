"use client";

import { useEffect, useState } from "react";

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
  // Initialise synchronously so the day count shows on first paint (SSR too).
  const [days, setDays] = useState<number | null>(() => daysUntil(firstBirthday));

  useEffect(() => {
    setDays(daysUntil(firstBirthday));
  }, [firstBirthday]);

  let message = "Celebrating Manasvi's first year 🎉";
  if (days !== null) {
    if (days > 1) message = `🎂 Manasvi's 1st birthday in ${days} days!`;
    else if (days === 1) message = "🎂 Just 1 day to Manasvi's 1st birthday!";
    else if (days === 0) message = "🎉 Today is Manasvi's 1st birthday! 🎂";
    else message = "🎂 Manasvi is one year old! 🎉";
  }

  return (
    <div
      className="w-full px-4 py-2 text-center text-sm font-medium text-white"
      style={{
        background:
          "linear-gradient(90deg, var(--color-soft-pink-deep), var(--color-lavender-deep))",
      }}
    >
      {message}
    </div>
  );
}
