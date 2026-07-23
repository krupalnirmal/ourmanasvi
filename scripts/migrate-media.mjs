// One-off migration: uploads data_for_upload/ to Cloudinary and fills the DB.
// - Dedupes identical files (same content shared across folders → one upload)
// - Images downscaled to ≤2048px JPEG (Cloudinary free 10MB limit)
// - Videos >95MB transcoded with ffmpeg to fit the free 100MB limit
// - Resumable: progress in .migrate-state.json (rerun continues where it left off)
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "data_for_upload");
const STATE_FILE = path.join(__dirname, "..", ".migrate-state.json");
const FOLDER = "ourmanasvi/album";
const MAX_VIDEO = 95 * 1024 * 1024;
// SKIP_VIDEOS=1 → upload photos only; videos already uploaded are still used,
// missing ones are simply left out (rerun without the flag to add them later).
const SKIP_VIDEOS = process.env.SKIP_VIDEOS === "1";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const prisma = new PrismaClient();

/* ── mappings ──────────────────────────────────────────── */
const MONTH_DIRS = {
  "Day One": 0, "First Month": 1, "Second Month": 2, "Third Month": 3,
  "Fourth Month": 4, "Fifth Month": 5, "Six Month": 6, "Seven Month": 7,
  "Eight Month": 8, "Nine Month": 9, "Ten Month": 10, "Eleven Month": 11,
  "Twelve Month": 12,
};
const BEST_DIRS = { Aug: 1, Sept: 2, Oct: 3, Nov: 4, Dec: 5, Jan: 6, Feb: 7, March: 8, April: 9 };
const MONTH_NAMES = {
  jan: 0, january: 0, feb: 1, february: 1, march: 2, mar: 2, april: 3, apr: 3,
  may: 4, june: 5, jun: 5, july: 6, jul: 6, aug: 7, august: 7, sept: 8, sep: 8,
  september: 8, oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

function parseEventDate(name) {
  // "… - 1 April 2026" | "… - Feb 2026" | "…-2025" | "… - 14-7-25"
  const dmy = name.match(/(\d{1,2})-(\d{1,2})-(\d{2,4})/);
  if (dmy) {
    const y = dmy[3].length === 2 ? 2000 + Number(dmy[3]) : Number(dmy[3]);
    return new Date(Date.UTC(y, Number(dmy[2]) - 1, Number(dmy[1])));
  }
  const full = name.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (full && MONTH_NAMES[full[2].toLowerCase()] !== undefined)
    return new Date(Date.UTC(Number(full[3]), MONTH_NAMES[full[2].toLowerCase()], Number(full[1])));
  const my = name.match(/([A-Za-z]+)\s*-?\s*(\d{4})/);
  if (my && MONTH_NAMES[my[1].toLowerCase()] !== undefined)
    return new Date(Date.UTC(Number(my[2]), MONTH_NAMES[my[1].toLowerCase()], 1));
  const y = name.match(/(\d{4})/);
  if (y) return new Date(Date.UTC(Number(y[1]), 0, 1));
  return null;
}

const isImg = (f) => /\.(jpe?g|gif|png)$/i.test(f);
const isVid = (f) => /\.mp4$/i.test(f);
const listFiles = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile()).sort()
    : [];

/* ── build the manifest (hash → targets) ───────────────── */
function sha1(file) {
  const h = crypto.createHash("sha1");
  h.update(fs.readFileSync(file));
  return h.digest("hex");
}

function buildManifest() {
  const byHash = new Map(); // hash -> { path, kind, targets: [] }
  const add = (file, target) => {
    if (!isImg(file) && !isVid(file)) return;
    const hash = sha1(file);
    if (!byHash.has(hash))
      byHash.set(hash, { path: file, kind: isVid(file) ? "video" : "image", targets: [] });
    byHash.get(hash).targets.push(target);
  };

  // Months + Welcome
  for (const [dir, n] of Object.entries(MONTH_DIRS))
    for (const f of listFiles(path.join(ROOT, "Months", dir)))
      add(path.join(ROOT, "Months", dir, f), { type: "month", n, order: f });
  for (const f of listFiles(path.join(ROOT, "Welcome - 14-7-25")))
    add(path.join(ROOT, "Welcome - 14-7-25", f), { type: "month", n: 0, order: f });

  // Best → featured
  let rank = 0;
  for (const [dir, n] of Object.entries(BEST_DIRS).sort((a, b) => a[1] - b[1]))
    for (const f of listFiles(path.join(ROOT, "Best", dir)))
      add(path.join(ROOT, "Best", dir, f), { type: "best", n, rank: ++rank, order: f });

  // Events
  const evRoot = path.join(ROOT, "Events");
  for (const ev of fs.readdirSync(evRoot).sort()) {
    const dir = path.join(evRoot, ev);
    if (!fs.statSync(dir).isDirectory()) continue;
    listFiles(dir).forEach((f, i) => add(path.join(dir, f), { type: "event", name: ev, order: i }));
  }

  // Funny
  for (const sub of ["Photos", "Videos"])
    listFiles(path.join(ROOT, "Funny", sub)).forEach((f, i) =>
      add(path.join(ROOT, "Funny", sub, f), { type: "fun", order: i })
    );

  return byHash;
}

/* ── upload helpers ────────────────────────────────────── */
const upStream = (buffer, options) =>
  new Promise((resolve, reject) => {
    const s = cloudinary.uploader.upload_stream(options, (e, r) => (e ? reject(e) : resolve(r)));
    s.end(buffer);
  });
const upLarge = (file, options) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(file, options, (e, r) => (e ? reject(e) : resolve(r)));
  });

async function uploadImage(file) {
  const buf = await sharp(file, { animated: false })
    .rotate()
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84 })
    .toBuffer();
  const r = await upStream(buf, { folder: FOLDER, resource_type: "image" });
  return { url: r.secure_url, publicId: r.public_id };
}

async function uploadVideo(file) {
  let src = file;
  let tmp = null;
  if (fs.statSync(file).size > MAX_VIDEO) {
    tmp = `/tmp/claude-1001/transcode-${Date.now()}.mp4`;
    for (const crf of [26, 30]) {
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", file,
        "-vf", "scale='min(1280,iw)':-2", "-c:v", "libx264", "-preset", "fast",
        "-crf", String(crf), "-c:a", "aac", "-b:a", "128k", tmp]);
      if (fs.statSync(tmp).size <= MAX_VIDEO) break;
    }
    src = tmp;
    console.log(`    transcoded ${(fs.statSync(file).size / 1048576) | 0}MB → ${(fs.statSync(tmp).size / 1048576) | 0}MB`);
  }
  const r = await upLarge(src, {
    folder: FOLDER,
    resource_type: "video",
    chunk_size: 10 * 1024 * 1024, // smaller chunks — survive flaky links better
    timeout: 600000, // 10 min per request instead of the default 60s
  });
  if (tmp) fs.unlinkSync(tmp);
  const thumbnail = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${r.public_id}.jpg`;
  return { url: r.secure_url, publicId: r.public_id, thumbnail };
}

/* ── main ──────────────────────────────────────────────── */
async function main() {
  console.log("Building manifest (hashing files)…");
  const manifest = buildManifest();
  const entries = [...manifest.entries()];
  console.log(`Manifest: ${entries.length} unique files (deduped)`);

  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) : {};
  const save = () => fs.writeFileSync(STATE_FILE, JSON.stringify(state));

  // Phase 1 — upload
  let done = Object.keys(state).length;
  console.log(`Resuming: ${done}/${entries.length} already uploaded`);
  for (const [hash, item] of entries) {
    if (state[hash]) continue;
    if (SKIP_VIDEOS && item.kind === "video") continue;
    const label = path.relative(ROOT, item.path);
    try {
      const res = item.kind === "image" ? await uploadImage(item.path) : await uploadVideo(item.path);
      state[hash] = { ...res, kind: item.kind };
      save();
      done++;
      console.log(`[${done}/${entries.length}] ${item.kind} ${label}`);
    } catch (e) {
      console.log(`FAIL ${label}: ${e?.error?.message || e.message}`);
    }
  }
  const missing = entries.filter(
    ([h, item]) => !state[h] && !(SKIP_VIDEOS && item.kind === "video")
  ).length;
  const skippedVids = entries.filter(([h, item]) => !state[h] && item.kind === "video").length;
  if (missing) {
    console.log(`UPLOADS INCOMPLETE: ${missing} failed — rerun the script to retry. DB phase skipped.`);
    return;
  }
  if (skippedVids) console.log(`(${skippedVids} videos skipped — add them later by rerunning without SKIP_VIDEOS)`);

  // Phase 2 — DB (idempotent: wipe + insert)
  console.log("Inserting DB rows…");
  await prisma.eventMedia.deleteMany({});
  await prisma.festival.deleteMany({});
  await prisma.funMedia.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.gallery.deleteMany({});

  const months = await prisma.month.findMany({ select: { id: true, monthNumber: true } });
  const monthId = Object.fromEntries(months.map((m) => [m.monthNumber, m.id]));

  // months + best (photos may belong to several months; best sets featured)
  const galleryRows = [];
  const videoRows = [];
  for (const [hash, item] of entries) {
    const up = state[hash];
    if (!up) continue; // skipped (video-only run)
    const monthTargets = new Map(); // n -> {order, rank?}
    for (const t of item.targets) {
      if (t.type === "month") {
        if (!monthTargets.has(t.n)) monthTargets.set(t.n, { order: t.order });
      } else if (t.type === "best") {
        const cur = monthTargets.get(t.n) ?? { order: t.order };
        cur.rank = t.rank;
        monthTargets.set(t.n, cur);
      }
    }
    for (const [n, info] of monthTargets) {
      if (monthId[n] === undefined) continue;
      if (up.kind === "image") {
        galleryRows.push({
          monthId: monthId[n], imageUrl: up.url, publicId: up.publicId,
          featured: info.rank !== undefined, featuredRank: info.rank ?? null,
        });
      } else {
        videoRows.push({ monthId: monthId[n], videoUrl: up.url, publicId: up.publicId, thumbnail: up.thumbnail });
      }
    }
  }
  // Batched inserts (few round trips → survives flaky connections)
  for (let i = 0; i < galleryRows.length; i += 100)
    await prisma.gallery.createMany({ data: galleryRows.slice(i, i + 100) });
  for (let i = 0; i < videoRows.length; i += 100)
    await prisma.video.createMany({ data: videoRows.slice(i, i + 100) });
  console.log(`months: ${galleryRows.length} photos, ${videoRows.length} videos`);

  // events
  const eventNames = new Map(); // name -> [{hash, order}]
  for (const [hash, item] of entries)
    for (const t of item.targets)
      if (t.type === "event") {
        if (!eventNames.has(t.name)) eventNames.set(t.name, []);
        eventNames.get(t.name).push({ hash, order: t.order });
      }
  for (const [name, files0] of eventNames) {
    const files = files0.filter((f) => state[f.hash]); // drop skipped videos
    if (files.length === 0) continue;
    files.sort((a, b) => a.order - b.order);
    const cover = files.map((f) => state[f.hash]).find((u) => u.kind === "image");
    const fest = await prisma.festival.create({
      data: { name: name.replace(/\s*-\s*\d.*$/, "").replace(/\(.*\)$/, "").trim() || name,
        date: parseEventDate(name), imageUrl: cover?.url ?? null, publicId: cover?.publicId ?? null },
    });
    await prisma.eventMedia.createMany({
      data: files.map((f, i) => {
        const up = state[f.hash];
        return { festivalId: fest.id, kind: up.kind, url: up.url, publicId: up.publicId,
          thumbnail: up.thumbnail ?? null, sortOrder: i };
      }),
    });
    console.log(`event "${name}": ${files.length} items`);
  }

  // funny
  const funRows = [];
  for (const [hash, item] of entries)
    for (const t of item.targets)
      if (t.type === "fun") {
        const up = state[hash];
        if (!up) continue; // skipped video
        funRows.push({ kind: up.kind, url: up.url, publicId: up.publicId, thumbnail: up.thumbnail ?? null, sortOrder: t.order });
      }
  if (funRows.length) await prisma.funMedia.createMany({ data: funRows });
  console.log(`funny: ${funRows.length} items`);

  console.log("MIGRATION DONE ✅");
}

main()
  .catch((e) => { console.error("MIGRATION FAIL:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
