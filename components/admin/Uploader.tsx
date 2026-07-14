"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGalleryPhoto, saveVideo } from "@/app/admin/actions";
import { cloudinaryUpload } from "@/lib/upload-client";
import CropModal from "./CropModal";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function Uploader({
  monthId,
  monthNumber,
  kind,
}: {
  monthId: string;
  monthNumber: number;
  kind: "image" | "video";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [crop, setCrop] = useState(false);
  const [queue, setQueue] = useState<File[]>([]); // remaining; current = queue[0]
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [pct, setPct] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function persist(res: { secure_url: string; public_id: string }) {
    if (kind === "image") {
      await saveGalleryPhoto({
        monthId,
        monthNumber,
        imageUrl: res.secure_url,
        publicId: res.public_id,
        caption,
      });
    } else {
      const thumbnail = `https://res.cloudinary.com/${CLOUD}/video/upload/so_0/${res.public_id}.jpg`;
      await saveVideo({
        monthId,
        monthNumber,
        videoUrl: res.secure_url,
        publicId: res.public_id,
        thumbnail,
        caption,
      });
    }
  }

  function reset() {
    setBusy(false);
    setStatus("");
    setPct(0);
    setTotal(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  // Upload a list of files/blobs directly (no crop).
  async function uploadAll(files: File[]) {
    setBusy(true);
    setError(null);
    setTotal(files.length);
    try {
      for (let i = 0; i < files.length; i++) {
        setStatus(`Uploading ${i + 1}/${files.length}`);
        setPct(0);
        const res = await cloudinaryUpload(files[i], kind, setPct, files[i].name);
        await persist(res);
      }
      reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload error");
      setBusy(false);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (kind === "image" && crop) {
      setTotal(files.length);
      setQueue(files);
      setActiveSrc(URL.createObjectURL(files[0]));
    } else {
      uploadAll(files);
    }
  }

  // Called from the crop modal: blob = cropped, or null = use original.
  async function handleCrop(blob: Blob | null) {
    const files = queue;
    const current = files[0];
    const idx = total - files.length + 1;
    if (activeSrc) URL.revokeObjectURL(activeSrc);
    setActiveSrc(null);
    setBusy(true);
    setError(null);
    setStatus(`Uploading ${idx}/${total}`);
    setPct(0);
    try {
      const res = await cloudinaryUpload(blob ?? current, "image", setPct, current.name);
      await persist(res);
      const rest = files.slice(1);
      if (rest.length) {
        setQueue(rest);
        setBusy(false);
        setStatus("");
        setActiveSrc(URL.createObjectURL(rest[0]));
      } else {
        setQueue([]);
        reset();
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload error");
      setBusy(false);
    }
  }

  function cancelQueue() {
    if (activeSrc) URL.revokeObjectURL(activeSrc);
    setActiveSrc(null);
    setQueue([]);
    reset();
  }

  return (
    <div className="rounded-2xl border border-dashed border-lavender-deep/50 bg-white/60 p-4">
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption (optional — applies to all in this batch)"
        disabled={busy}
        className="mb-3 w-full rounded-xl border border-lavender/60 bg-white px-3 py-2 text-sm outline-none focus:border-lavender-deep"
      />

      {kind === "image" && (
        <label className="mb-3 flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={crop}
            onChange={(e) => setCrop(e.target.checked)}
            disabled={busy}
            className="h-4 w-4 accent-soft-pink-deep"
          />
          Crop each photo before upload
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={kind === "image" ? "image/*" : "video/*"}
        multiple
        disabled={busy}
        onChange={onSelect}
        className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-soft-pink-deep file:px-4 file:py-2 file:font-medium file:text-white hover:file:opacity-90"
      />
      <p className="mt-1 text-xs text-ink-soft/80">
        You can select multiple {kind === "image" ? "photos" : "videos"} at once.
      </p>

      {busy && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-lavender/40">
            <div className="h-full bg-soft-pink-deep transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            {status} · {pct}%
          </p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {activeSrc && (
        <CropModal
          src={activeSrc}
          title={`Crop photo ${total - queue.length + 1} of ${total}`}
          onDone={(blob) => handleCrop(blob)}
          onSkip={() => handleCrop(null)}
          onCancel={cancelQueue}
        />
      )}
    </div>
  );
}
