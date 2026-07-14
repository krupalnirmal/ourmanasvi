"use client";

import type { MonthVideo } from "@/lib/data";

export default function VideoPlayer({ video }: { video: MonthVideo }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-black/5 shadow-sm ring-1 ring-black/5">
      <video
        controls
        preload="metadata"
        poster={video.thumbnail}
        className="aspect-video w-full bg-black"
      >
        <source src={video.videoUrl} />
        Your browser does not support the video tag.
      </video>
      {video.caption && (
        <figcaption className="bg-white/70 px-3 py-2 text-center font-hand text-lg text-ink-soft">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}
