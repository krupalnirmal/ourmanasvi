import type { MetadataRoute } from "next";
import { BABY_NAME, SITE_DESCRIPTION, pageTitle } from "@/lib/site-config";
import { activePalette } from "@/lib/theme";

export default function manifest(): MetadataRoute.Manifest {
  const palette = activePalette();
  return {
    name: pageTitle(),
    short_name: BABY_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: palette.cream,
    theme_color: palette.themeColor,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
