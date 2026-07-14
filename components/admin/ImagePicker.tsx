"use client";

import { useRef, useState } from "react";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads an image directly to Cloudinary and stores the result in hidden
 * inputs (imageUrl / publicId) so a plain <form> server action receives them
 * alongside the text fields.
 */
export default function ImagePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setProgress(0);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET as string);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        if (xhr.status < 200 || xhr.status >= 300) throw new Error(`Upload failed (${xhr.status})`);
        const res = JSON.parse(xhr.responseText);
        setUrl(res.secure_url);
        setPublicId(res.public_id);
        setProgress(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload error");
        setProgress(null);
      }
    };
    xhr.onerror = () => {
      setError("Network error");
      setProgress(null);
    };
    xhr.send(form);
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
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-soft-pink-deep file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:opacity-90"
          />
          {busy && <p className="mt-1 text-xs text-ink-soft">Uploading… {progress}%</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
