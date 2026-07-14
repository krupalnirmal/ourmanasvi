"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveGalleryPhoto, saveVideo } from "@/app/admin/actions";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a file DIRECTLY from the browser to Cloudinary (unsigned preset),
 * bypassing our server so large videos aren't limited by serverless body
 * caps. On success, saves a DB row via a server action.
 */
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
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setProgress(0);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD}/${kind}/upload`;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET as string);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = async () => {
      try {
        if (xhr.status < 200 || xhr.status >= 300) throw new Error(`Upload failed (${xhr.status})`);
        const res = JSON.parse(xhr.responseText);
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
        setCaption("");
        if (inputRef.current) inputRef.current.value = "";
        setProgress(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setProgress(null);
      }
    };
    xhr.onerror = () => {
      setError("Network error while uploading");
      setProgress(null);
    };
    xhr.send(form);
  }

  const busy = progress !== null;

  return (
    <div className="rounded-2xl border border-dashed border-lavender-deep/50 bg-white/60 p-4">
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption (optional)"
        disabled={busy}
        className="mb-3 w-full rounded-xl border border-lavender/60 bg-white px-3 py-2 text-sm outline-none focus:border-lavender-deep"
      />
      <input
        ref={inputRef}
        type="file"
        accept={kind === "image" ? "image/*" : "video/*"}
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
        className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-soft-pink-deep file:px-4 file:py-2 file:font-medium file:text-white hover:file:opacity-90"
      />
      {busy && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-lavender/40">
            <div
              className="h-full bg-soft-pink-deep transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-ink-soft">Uploading… {progress}%</p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
