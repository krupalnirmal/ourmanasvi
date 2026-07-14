// Client-side direct upload to Cloudinary (unsigned preset), with progress.
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Downscale/re-encode an image in the browser so it fits Cloudinary's free-tier
 * 10MB image limit (phone photos are often 12–20MB). Also normalises EXIF
 * orientation. Returns a JPEG blob; falls back to the original on any error.
 */
export async function prepareImage(
  input: Blob,
  maxDim = 2048,
  quality = 0.85
): Promise<Blob> {
  const url = URL.createObjectURL(input);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = url;
    });
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (!w || !h) return input;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return input;
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    return blob ?? input;
  } catch {
    return input;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function cloudinaryUpload(
  file: Blob,
  kind: "image" | "video",
  onProgress?: (pct: number) => void,
  filename = "upload"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file, filename);
    form.append("upload_preset", PRESET as string);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD}/${kind}/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Upload failed (${xhr.status})`));
        return;
      }
      try {
        const res = JSON.parse(xhr.responseText);
        resolve({ secure_url: res.secure_url, public_id: res.public_id });
      } catch {
        reject(new Error("Bad upload response"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.send(form);
  });
}
