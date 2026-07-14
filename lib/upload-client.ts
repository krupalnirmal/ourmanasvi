// Client-side direct upload to Cloudinary (unsigned preset), with progress.
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  secure_url: string;
  public_id: string;
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
