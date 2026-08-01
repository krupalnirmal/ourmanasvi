import type { MetadataRoute } from "next";
import { BABY_NAME, SITE_DESCRIPTION, pageTitle } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: pageTitle(),
    short_name: BABY_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8f0",
    theme_color: "#f2a7b8",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
