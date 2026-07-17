/**
 * Insert Cloudinary transformations into a delivery URL so we serve
 * appropriately-sized, auto-optimised images (saves free-tier bandwidth and
 * loads faster). Non-Cloudinary URLs are returned unchanged.
 *
 * e.g. cld(url, "w_600,h_600,c_fill,q_auto,f_auto")
 */
export function cld(url: string | undefined | null, transform: string): string {
  if (!url) return "";
  const marker = "/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  // Avoid double-applying if a transform is already present.
  const rest = url.slice(i + marker.length);
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) return url;
  return url.slice(0, i + marker.length) + transform + "/" + rest;
}

/** Square thumbnail for gallery tiles. */
export const thumb = (url?: string | null) =>
  cld(url, "w_600,h_600,c_fill,g_auto,q_auto,f_auto");

/** Large, quality-optimised image for the lightbox. */
export const large = (url?: string | null) =>
  cld(url, "w_1600,c_limit,q_auto,f_auto");

/** Wide banner crop for hero backgrounds. */
export const banner = (url?: string | null) =>
  cld(url, "w_1920,h_1080,c_fill,g_auto,q_auto,f_auto");

/**
 * Hero banner crop that keeps faces in frame (baby photos are portraits, so a
 * plain centre crop cuts the subject out).
 */
export const heroBanner = (url?: string | null) =>
  cld(url, "w_1800,h_1100,c_fill,g_faces:auto,q_auto,f_auto");
