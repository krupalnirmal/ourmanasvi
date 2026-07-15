"use client";

import { useRef, useState } from "react";
import { cloudinaryUpload } from "@/lib/upload-client";

/**
 * Uploads an audio file to Cloudinary (as a video resource) and stores the URL
 * in a hidden input for a plain <form> server action.
 */
export default function AudioPicker({ current }: { current?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const res = await cloudinaryUpload(file, "video", setProgress, file.name);
      setUrl(res.secure_url);
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload error");
      setProgress(null);
    }
  }

  const busy = progress !== null;
  const preview = url || current;

  return (
    <div>
      <input type="hidden" name="audioUrl" value={url} />

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        disabled={busy}
        onChange={onSelect}
        className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-soft-pink-deep file:px-4 file:py-2 file:font-medium file:text-white hover:file:opacity-90"
      />
      {busy && <p className="mt-1 text-xs text-ink-soft">Uploading… {progress}%</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {preview && (
        <audio controls src={preview} className="mt-3 w-full">
          Your browser does not support audio.
        </audio>
      )}
      {url && <p className="mt-1 text-xs text-green-600">New track ready — click “Set music”.</p>}
    </div>
  );
}
