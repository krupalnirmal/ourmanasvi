"use client";

import { useEffect, useRef, useState } from "react";
import type { MonthVideo } from "@/lib/data";

export default function VideoPlayer({ video }: { video: MonthVideo }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [nat, setNat] = useState({ w: 16, h: 9 }); // coded dimensions
  const [rot, setRot] = useState(0); // 0 | 90 | 180 | 270
  const [box, setBox] = useState({ w: 0, h: 0 });

  const rotated = rot % 180 !== 0;
  // Aspect ratio of the displayed box (swaps when rotated a quarter turn).
  const dispAspect = rotated ? nat.h / nat.w : nat.w / nat.h;

  // Measure the box so a rotated video can be sized to fill it.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dispAspect]);

  const videoStyle: React.CSSProperties = rotated
    ? {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${box.h}px`,
        height: `${box.w}px`,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
      }
    : {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        transform: rot === 180 ? "rotate(180deg)" : "none",
      };

  return (
    <figure className="mx-auto w-full max-w-md">
      <div
        ref={wrapRef}
        style={{ aspectRatio: String(dispAspect) }}
        className="relative mx-auto max-h-[75vh] overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-black/10"
      >
        <video
          key={video.videoUrl}
          controls
          playsInline
          preload="metadata"
          poster={video.thumbnail}
          style={videoStyle}
          className="bg-black object-contain"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) setNat({ w: v.videoWidth, h: v.videoHeight });
          }}
        >
          <source src={video.videoUrl} />
        </video>

        {/* Rotate control */}
        <button
          type="button"
          onClick={() => setRot((r) => (r + 90) % 360)}
          aria-label="Rotate video"
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink shadow-md ring-1 ring-white/60 backdrop-blur-md transition-transform hover:scale-110 hover:bg-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      {video.caption && (
        <figcaption className="mt-2 text-center font-hand text-lg text-ink-soft">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}
