"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveFunMedia } from "@/app/admin/actions";
import { cloudinaryUpload, prepareImage } from "@/lib/upload-client";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function FunUploader({ kind }: { kind: "image" | "video" }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [pct, setPct] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setBusy(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        setStatus(`Uploading ${i + 1}/${files.length}`);
        setPct(0);
        const payload = kind === "image" ? await prepareImage(files[i]) : files[i];
        const res = await cloudinaryUpload(payload, kind, setPct, files[i].name);
        await saveFunMedia({
          kind,
          url: res.secure_url,
          publicId: res.public_id,
          thumbnail:
            kind === "video"
              ? `https://res.cloudinary.com/${CLOUD}/video/upload/so_0/${res.public_id}.jpg`
              : undefined,
          caption,
        });
      }
      setCaption("");
      setStatus("");
      setPct(0);
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload error");
      setBusy(false);
    }
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
    </div>
  );
}
