"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

type Area = { x: number; y: number; width: number; height: number };

const ASPECTS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "Square", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function cropToBlob(src: string, area: Area): Promise<Blob> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("crop failed"))), "image/jpeg", 0.9)
  );
}

export default function CropModal({
  src,
  title,
  onDone,
  onSkip,
  onCancel,
}: {
  src: string;
  title?: string;
  onDone: (blob: Blob) => void;
  onSkip: () => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  async function apply() {
    if (!area) return;
    setBusy(true);
    try {
      const blob = await cropToBlob(src, area);
      onDone(blob);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="font-display text-lg font-semibold text-ink">
            {title ?? "Crop photo"}
          </h3>
          <button onClick={onCancel} className="text-xl text-ink-soft hover:text-ink" aria-label="Cancel">
            ✕
          </button>
        </div>

        <div className="relative h-72 w-full bg-black sm:h-80">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onComplete}
          />
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((a) => (
              <button
                key={a.label}
                onClick={() => setAspect(a.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors ${
                  aspect === a.value
                    ? "bg-soft-pink-deep text-white ring-soft-pink-deep"
                    : "bg-white text-ink-soft ring-lavender/50 hover:bg-cream"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-soft">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-soft-pink-deep"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onSkip}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:bg-cream"
            >
              Use original
            </button>
            <button
              onClick={apply}
              disabled={busy || !area}
              className="rounded-full bg-soft-pink-deep px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "…" : "Crop & use"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
