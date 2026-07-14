import { v2 as cloudinary } from "cloudinary";

// Cloudinary Free tier — media (image/video) storage & delivery.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** Folder we keep all uploads under, so the free account stays tidy. */
export const CLOUDINARY_FOLDER = "ourmanasvi";

/** Delete an asset by its stored public_id (called when removing media). */
export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
