"use client";

import Link from "next/link";
import { thumb } from "@/lib/cld";
import type { BabyInfo } from "@/lib/data";

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfileCard({
  baby,
  avatar,
}: {
  baby?: BabyInfo | null;
  avatar?: string;
}) {
  const photo = baby?.profilePhoto || baby?.coverImage || avatar;

  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-cream-deep via-cream to-lavender/25 p-6 shadow-sm ring-1 ring-lavender/30">
      {/* decorations */}
      <span className="pointer-events-none absolute right-5 top-4 text-2xl opacity-80" aria-hidden>
        ☁️
      </span>
      <span className="pointer-events-none absolute right-24 top-10 text-xs text-soft-pink-deep/60" aria-hidden>
        ✦
      </span>
      <span className="pointer-events-none absolute bottom-4 right-5 text-4xl opacity-90" aria-hidden>
        🦒
      </span>

      <div className="relative flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white ring-4 ring-white shadow-md">
          {photo && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={thumb(photo)} alt="" aria-hidden className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          <p className="text-sm text-ink-soft">Hello, I&apos;m</p>
          <p className="font-hand text-4xl font-bold leading-tight text-soft-pink-deep">
            {baby?.name ?? "Manasvi"}
            <span className="ml-1 align-middle text-lg" aria-hidden>
              ♥
            </span>
          </p>
        </div>
      </div>

      <ul className="relative mt-6 space-y-2.5 text-sm text-ink-soft">
        {baby?.birthDate && (
          <li className="flex items-center gap-2">
            <span aria-hidden>📅</span> Born on {fmt(baby.birthDate)}
          </li>
        )}
        <li className="flex items-center gap-2">
          <span aria-hidden>📍</span> Nashik, Maharashtra
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden>♥</span> I love music and cuddles
        </li>
      </ul>

      <Link
        href="/about"
        className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-soft-pink-deep px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
      >
        <span aria-hidden>📖</span> My Story
      </Link>
    </div>
  );
}
