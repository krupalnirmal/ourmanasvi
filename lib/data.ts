import { prisma } from "@/lib/prisma";
import { MONTHS, type MonthDetail } from "@/lib/journey-data";
import type { TimelineItem } from "@/types";

/**
 * Data access layer. Reads from the database, but falls back to the static
 * journey content if the DB is unreachable or empty — so the site never
 * breaks (e.g. during a build without DB access, or before seeding).
 */

export interface GalleryPhoto {
  caption: string;
  imageUrl?: string;
}
export interface MonthVideo {
  caption: string;
  videoUrl: string;
  thumbnail?: string;
}
export interface MonthView extends TimelineItem {
  intro: string;
  gallery: GalleryPhoto[];
  videos: MonthVideo[];
  memories: { title: string; content: string; mood?: string }[];
  milestones: { title: string; description?: string; icon?: string }[];
}

/** Accent is a design attribute kept in the static definition. */
function accentFor(monthNumber: number): TimelineItem["accent"] {
  return MONTHS.find((m) => m.monthNumber === monthNumber)?.accent ?? "cream";
}

export async function getTimeline(): Promise<TimelineItem[]> {
  try {
    const months = await prisma.month.findMany({
      orderBy: { monthNumber: "asc" },
      select: {
        monthNumber: true,
        title: true,
        subtitle: true,
        gallery: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { imageUrl: true },
        },
      },
    });
    if (months.length === 0) throw new Error("empty");
    return months.map((m) => ({
      monthNumber: m.monthNumber,
      title: m.title,
      subtitle: m.subtitle ?? undefined,
      accent: accentFor(m.monthNumber),
      coverImage: m.gallery[0]?.imageUrl,
    }));
  } catch {
    return MONTHS.map(({ monthNumber, title, subtitle, accent }) => ({
      monthNumber,
      title,
      subtitle,
      accent,
    }));
  }
}

function staticView(n: number): MonthView | undefined {
  const m = MONTHS.find((x) => x.monthNumber === n);
  if (!m) return undefined;
  return { ...m, videos: [], gallery: m.gallery };
}

export async function getMonthView(n: number): Promise<MonthView | undefined> {
  try {
    const month = await prisma.month.findFirst({
      where: { monthNumber: n },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { createdAt: "asc" } },
        memories: { orderBy: { createdAt: "asc" } },
        milestones: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!month) return staticView(n);

    const staticGallery = staticView(n)?.gallery ?? [];
    return {
      monthNumber: month.monthNumber,
      title: month.title,
      subtitle: month.subtitle ?? undefined,
      accent: accentFor(month.monthNumber),
      intro: month.description ?? "",
      // Real uploaded photos take over; otherwise keep the placeholder tiles.
      gallery:
        month.gallery.length > 0
          ? month.gallery.map((g) => ({ caption: g.caption ?? "", imageUrl: g.imageUrl }))
          : staticGallery,
      videos: month.videos.map((v) => ({
        caption: v.caption ?? "",
        videoUrl: v.videoUrl,
        thumbnail: v.thumbnail ?? undefined,
      })),
      memories: month.memories.map((m) => ({
        title: m.title,
        content: m.content,
        mood: m.mood ?? undefined,
      })),
      milestones: month.milestones.map((m) => ({
        title: m.title,
        description: m.description ?? undefined,
        icon: m.icon ?? undefined,
      })),
    };
  } catch {
    return staticView(n);
  }
}

/** A few real photos to feature on the homepage hero (empty if none uploaded). */
export async function getFeaturedPhotos(limit = 5): Promise<string[]> {
  try {
    const photos = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      select: { imageUrl: true },
      take: 40,
    });
    if (photos.length === 0) return [];
    // Spread the picks across the set so they're varied, not all from one month.
    const step = Math.max(1, Math.floor(photos.length / limit));
    const picked: string[] = [];
    for (let i = 0; i < photos.length && picked.length < limit; i += step) {
      picked.push(photos[i].imageUrl);
    }
    return picked;
  } catch {
    return [];
  }
}

/** All month numbers that exist (for nav / listings). */
export async function getMonthNumbers(): Promise<number[]> {
  try {
    const months = await prisma.month.findMany({
      orderBy: { monthNumber: "asc" },
      select: { monthNumber: true },
    });
    if (months.length === 0) throw new Error("empty");
    return months.map((m) => m.monthNumber);
  } catch {
    return MONTHS.map((m) => m.monthNumber);
  }
}
