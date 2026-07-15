import { prisma } from "@/lib/prisma";
import { MONTHS, type MonthDetail } from "@/lib/journey-data";
import { cld } from "@/lib/cld";
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
        // Bake in half-speed slow motion via Cloudinary when enabled.
        videoUrl: v.slowMotion ? cld(v.videoUrl, "e_accelerate:-50") : v.videoUrl,
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

export interface BabyInfo {
  name: string;
  tagline?: string;
  birthDate?: string;
  firstBirthday?: string;
  coverImage?: string;
  storyAudio?: string;
}

export async function getBaby(): Promise<BabyInfo | null> {
  try {
    const baby = await prisma.baby.findFirst();
    if (!baby) return null;
    return {
      name: baby.name,
      tagline: baby.tagline ?? undefined,
      birthDate: baby.birthDate?.toISOString() ?? undefined,
      firstBirthday: baby.firstBirthday?.toISOString() ?? undefined,
      coverImage: baby.coverImage ?? undefined,
      storyAudio: baby.storyAudio ?? undefined,
    };
  } catch {
    return null;
  }
}

export interface Stats {
  months: number;
  photos: number;
  videos: number;
  memories: number;
}

export async function getStats(): Promise<Stats> {
  try {
    const [months, photos, videos, memories] = await Promise.all([
      prisma.month.count(),
      prisma.gallery.count(),
      prisma.video.count(),
      prisma.memory.count(),
    ]);
    return { months, photos, videos, memories };
  } catch {
    return { months: 13, photos: 0, videos: 0, memories: 0 };
  }
}

export interface FeaturedMoment {
  imageUrl: string;
  monthNumber: number;
}

/** Real photos to feature on the homepage (spread across months). */
export async function getFeaturedMoments(limit = 8): Promise<FeaturedMoment[]> {
  try {
    const photos = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      select: { imageUrl: true, month: { select: { monthNumber: true } } },
      take: 60,
    });
    if (photos.length === 0) return [];
    const step = Math.max(1, Math.floor(photos.length / limit));
    const picked: FeaturedMoment[] = [];
    for (let i = 0; i < photos.length && picked.length < limit; i += step) {
      picked.push({ imageUrl: photos[i].imageUrl, monthNumber: photos[i].month.monthNumber });
    }
    return picked;
  } catch {
    return [];
  }
}

export interface StorySlide {
  imageUrl: string;
  monthNumber: number;
  label: string;
}

/** All gallery photos in journey order (birth → first birthday), for the story player. */
export async function getStoryPhotos(): Promise<StorySlide[]> {
  try {
    const rows = await prisma.gallery.findMany({
      orderBy: [{ month: { monthNumber: "asc" } }, { sortOrder: "asc" }],
      select: {
        imageUrl: true,
        month: { select: { monthNumber: true, title: true } },
      },
    });
    return rows.map((r) => ({
      imageUrl: r.imageUrl,
      monthNumber: r.month.monthNumber,
      label: r.month.title,
    }));
  } catch {
    return [];
  }
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  photoUrl?: string;
  message?: string;
}
export async function getFamily(): Promise<FamilyMember[]> {
  try {
    const rows = await prisma.family.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      relation: r.relation,
      photoUrl: r.photoUrl ?? undefined,
      message: r.message ?? undefined,
    }));
  } catch {
    return [];
  }
}

export interface PlaceItem {
  id: string;
  name: string;
  description?: string;
  date?: string;
  imageUrl?: string;
}
export async function getPlaces(): Promise<PlaceItem[]> {
  try {
    const rows = await prisma.place.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      date: r.date?.toISOString() ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
    }));
  } catch {
    return [];
  }
}

export interface EventItem {
  id: string;
  name: string;
  description?: string;
  date?: string;
  imageUrl?: string;
}
export async function getEvents(): Promise<EventItem[]> {
  try {
    const rows = await prisma.festival.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      date: r.date?.toISOString() ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
    }));
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
