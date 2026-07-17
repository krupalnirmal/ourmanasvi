"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteAsset, cloudinary, CLOUDINARY_FOLDER } from "@/lib/cloudinary";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

function refresh(monthNumber?: number) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (monthNumber !== undefined) {
    revalidatePath(`/month/${monthNumber}`);
    revalidatePath(`/admin/month/${monthNumber}`);
  }
}

/* ── Month text ─────────────────────────────────────────── */
export async function updateMonth(monthId: string, monthNumber: number, formData: FormData) {
  await requireAuth();
  await prisma.month.update({
    where: { id: monthId },
    data: {
      title: String(formData.get("title") ?? "").trim() || "Untitled",
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
    },
  });
  refresh(monthNumber);
}

/* ── Memories ───────────────────────────────────────────── */
export async function addMemory(monthId: string, monthNumber: number, formData: FormData) {
  await requireAuth();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) return;
  await prisma.memory.create({
    data: {
      monthId,
      title,
      content,
      mood: String(formData.get("mood") ?? "").trim() || null,
    },
  });
  refresh(monthNumber);
}

export async function deleteMemory(id: string, monthNumber: number) {
  await requireAuth();
  await prisma.memory.delete({ where: { id } });
  refresh(monthNumber);
}

/* ── Milestones ─────────────────────────────────────────── */
export async function addMilestone(monthId: string, monthNumber: number, formData: FormData) {
  await requireAuth();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await prisma.milestone.create({
    data: {
      monthId,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      icon: String(formData.get("icon") ?? "").trim() || null,
    },
  });
  refresh(monthNumber);
}

export async function deleteMilestone(id: string, monthNumber: number) {
  await requireAuth();
  await prisma.milestone.delete({ where: { id } });
  refresh(monthNumber);
}

/* ── Gallery photos (uploaded client-side to Cloudinary) ─── */
export async function saveGalleryPhoto(input: {
  monthId: string;
  monthNumber: number;
  imageUrl: string;
  publicId: string;
  caption?: string;
}) {
  await requireAuth();
  await prisma.gallery.create({
    data: {
      monthId: input.monthId,
      imageUrl: input.imageUrl,
      publicId: input.publicId,
      caption: input.caption?.trim() || null,
    },
  });
  refresh(input.monthNumber);
}

/**
 * Star/unstar a photo → controls what shows on the homepage.
 * Newly starred photos go to the end of the banner order (featuredRank).
 */
export async function setPhotoFeatured(id: string, monthNumber: number, value: boolean) {
  await requireAuth();
  if (value) {
    const last = await prisma.gallery.findFirst({
      where: { featured: true },
      orderBy: { featuredRank: "desc" },
      select: { featuredRank: true },
    });
    await prisma.gallery.update({
      where: { id },
      data: { featured: true, featuredRank: (last?.featuredRank ?? 0) + 1 },
    });
  } else {
    await prisma.gallery.update({
      where: { id },
      data: { featured: false, featuredRank: null },
    });
  }
  refresh(monthNumber);
}

export async function deleteGalleryPhoto(id: string, publicId: string, monthNumber: number) {
  await requireAuth();
  await prisma.gallery.delete({ where: { id } });
  try {
    await deleteAsset(publicId, "image");
  } catch {
    // DB row already gone; ignore Cloudinary cleanup failures.
  }
  refresh(monthNumber);
}

/* ── Videos (uploaded client-side to Cloudinary) ─────────── */
export async function saveVideo(input: {
  monthId: string;
  monthNumber: number;
  videoUrl: string;
  publicId: string;
  thumbnail?: string;
  caption?: string;
}) {
  await requireAuth();
  await prisma.video.create({
    data: {
      monthId: input.monthId,
      videoUrl: input.videoUrl,
      publicId: input.publicId,
      thumbnail: input.thumbnail || null,
      caption: input.caption?.trim() || null,
    },
  });
  refresh(input.monthNumber);
}

export async function deleteVideo(id: string, publicId: string, monthNumber: number) {
  await requireAuth();
  await prisma.video.delete({ where: { id } });
  try {
    await deleteAsset(publicId, "video");
  } catch {
    // ignore
  }
  refresh(monthNumber);
}

export async function setVideoSlowMo(id: string, monthNumber: number, value: boolean) {
  await requireAuth();
  await prisma.video.update({ where: { id }, data: { slowMotion: value } });
  refresh(monthNumber);
}

/* ── Home hero background ────────────────────────────────── */
export async function setHeroImage(formData: FormData) {
  await requireAuth();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!imageUrl) return;
  const baby = await prisma.baby.findFirst();
  if (!baby) return;
  await prisma.baby.update({ where: { id: baby.id }, data: { coverImage: imageUrl } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function clearHeroImage() {
  await requireAuth();
  const baby = await prisma.baby.findFirst();
  if (!baby) return;
  await prisma.baby.update({ where: { id: baby.id }, data: { coverImage: null } });
  revalidatePath("/");
  revalidatePath("/admin");
}

/* ── Journey video music ─────────────────────────────────── */
export async function setStoryAudio(formData: FormData) {
  await requireAuth();
  let audioUrl = String(formData.get("audioUrl") ?? "").trim();
  if (!audioUrl) return;

  // Re-host external links on Cloudinary (some hosts block hotlinking; this
  // also keeps delivery on our free CDN). Skip if it's already our Cloudinary.
  const ours = `res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;
  if (/^https?:\/\//i.test(audioUrl) && !audioUrl.includes(ours)) {
    try {
      const res = await cloudinary.uploader.upload(audioUrl, {
        resource_type: "video",
        folder: CLOUDINARY_FOLDER,
        public_id: `story-audio-${Date.now()}`,
      });
      audioUrl = res.secure_url;
    } catch {
      // Keep the raw URL if Cloudinary can't fetch it.
    }
  }

  const baby = await prisma.baby.findFirst();
  if (!baby) return;
  await prisma.baby.update({ where: { id: baby.id }, data: { storyAudio: audioUrl } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function clearStoryAudio() {
  await requireAuth();
  const baby = await prisma.baby.findFirst();
  if (!baby) return;
  await prisma.baby.update({ where: { id: baby.id }, data: { storyAudio: null } });
  revalidatePath("/");
  revalidatePath("/admin");
}

/* ── Homepage banner music ───────────────────────────────── */
async function rehostAudio(url: string) {
  const ours = `res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;
  if (!/^https?:\/\//i.test(url) || url.includes(ours)) return url;
  try {
    const res = await cloudinary.uploader.upload(url, {
      resource_type: "video",
      folder: CLOUDINARY_FOLDER,
      public_id: `banner-audio-${Date.now()}`,
    });
    return res.secure_url;
  } catch {
    return url;
  }
}

export async function setBannerAudio(formData: FormData) {
  await requireAuth();
  const raw = String(formData.get("audioUrl") ?? "").trim();
  if (!raw) return;
  const audioUrl = await rehostAudio(raw);
  const baby = await prisma.baby.findFirst();
  if (!baby) return;
  await prisma.baby.update({ where: { id: baby.id }, data: { bannerAudio: audioUrl } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function clearBannerAudio() {
  await requireAuth();
  const baby = await prisma.baby.findFirst();
  if (!baby) return;
  await prisma.baby.update({ where: { id: baby.id }, data: { bannerAudio: null } });
  revalidatePath("/");
  revalidatePath("/admin");
}

/* ── Family ─────────────────────────────────────────────── */
function str(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}
function dateOrNull(fd: FormData, k: string) {
  const v = str(fd, k);
  return v ? new Date(v) : null;
}

export async function addFamily(formData: FormData) {
  await requireAuth();
  const name = str(formData, "name");
  const relation = str(formData, "relation");
  if (!name || !relation) return;
  await prisma.family.create({
    data: {
      name,
      relation,
      message: str(formData, "message") || null,
      photoUrl: str(formData, "imageUrl") || null,
      publicId: str(formData, "publicId") || null,
    },
  });
  revalidatePath("/family");
  revalidatePath("/admin/family");
}

export async function deleteFamily(id: string, publicId?: string) {
  await requireAuth();
  await prisma.family.delete({ where: { id } });
  if (publicId) await deleteAsset(publicId, "image").catch(() => {});
  revalidatePath("/family");
  revalidatePath("/admin/family");
}

/* ── Places ─────────────────────────────────────────────── */
export async function addPlace(formData: FormData) {
  await requireAuth();
  const name = str(formData, "name");
  if (!name) return;
  await prisma.place.create({
    data: {
      name,
      description: str(formData, "description") || null,
      date: dateOrNull(formData, "date"),
      imageUrl: str(formData, "imageUrl") || null,
      publicId: str(formData, "publicId") || null,
    },
  });
  revalidatePath("/places");
  revalidatePath("/admin/places");
}

export async function deletePlace(id: string, publicId?: string) {
  await requireAuth();
  await prisma.place.delete({ where: { id } });
  if (publicId) await deleteAsset(publicId, "image").catch(() => {});
  revalidatePath("/places");
  revalidatePath("/admin/places");
}

/* ── Events (Festival model) ────────────────────────────── */
export async function addEvent(formData: FormData) {
  await requireAuth();
  const name = str(formData, "name");
  if (!name) return;
  await prisma.festival.create({
    data: {
      name,
      description: str(formData, "description") || null,
      date: dateOrNull(formData, "date"),
      imageUrl: str(formData, "imageUrl") || null,
      publicId: str(formData, "publicId") || null,
    },
  });
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function deleteEvent(id: string, publicId?: string) {
  await requireAuth();
  await prisma.festival.delete({ where: { id } });
  if (publicId) await deleteAsset(publicId, "image").catch(() => {});
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
