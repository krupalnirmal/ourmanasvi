"use client";

import { useRef, useState } from "react";
import { cloudinaryUpload } from "@/lib/upload-client";
import CropModal from "./CropModal";

/**
 * Single-image picker (with optional crop) that stores the uploaded result in
 * hidden inputs (imageUrl / publicId) for a plain <form> server action.
 */
export default function ImagePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [crop, setCrop] = useState(false);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(blob: Blob, name: string) {
    setError(null);
    setProgress(0);
    try {
      const res = await cloudinaryUpload(blob, "image", setProgress, name);
      setUrl(res.secure_url);
      setPublicId(res.public_id);
      setProgress(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload error");
      setProgress(null);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (crop) {
      setPendingFile(file);
      setActiveSrc(URL.createObjectURL(file));
    } else {
      upload(file, file.name);
    }
  }

  function finishCrop(blob: Blob | null) {
    if (activeSrc) URL.revokeObjectURL(activeSrc);
    setActiveSrc(null);
    const file = pendingFile;
    setPendingFile(null);
    if (file) upload(blob ?? file, file.name);
  }

  const busy = progress !== null;

  return (
    <div>
      <input type="hidden" name="imageUrl" value={url} />
      <input type="hidden" name="publicId" value={publicId} />

      <div className="flex items-center gap-3">
        {url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={url} alt="" className="h-16 w-16 rounded-xl object-cover ring-1 ring-lavender/40" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-lavender/20 text-2xl">
            🖼️
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={onSelect}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-soft-pink-deep file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:opacity-90"
          />
          <label className="mt-1.5 flex items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={crop}
              onChange={(e) => setCrop(e.target.checked)}
              disabled={busy}
              className="h-3.5 w-3.5 accent-soft-pink-deep"
            />
            Crop before upload
          </label>
          {busy && <p className="mt-1 text-xs text-ink-soft">Uploading… {progress}%</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {activeSrc && (
        <CropModal
          src={activeSrc}
          onDone={(blob) => finishCrop(blob)}
          onSkip={() => finishCrop(null)}
          onCancel={() => {
            if (activeSrc) URL.revokeObjectURL(activeSrc);
            setActiveSrc(null);
            setPendingFile(null);
          }}
        />
      )}
    </div>
  );
}
