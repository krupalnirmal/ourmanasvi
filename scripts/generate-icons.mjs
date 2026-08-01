/**
 * Generates the app icons for a site from `.env` — run `npm run icons`.
 *
 * The icons are images with the baby's name drawn into them, so they are the
 * one thing `.env` alone cannot re-skin. Rather than redrawing them by hand for
 * every client, this builds the artwork as SVG from NEXT_PUBLIC_BABY_NAME /
 * NEXT_PUBLIC_SITE_NAME / NEXT_PUBLIC_SITE_TAGLINE, colours it with the palette
 * named by SITE_THEME, and rasterises the four sizes the manifest expects.
 *
 * Output is deliberately plain-but-tidy: a leafy wreath, the initial, and the
 * site name. If a client pays for real branding, drop the designer's PNGs into
 * public/icons/ and simply don't run this again.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "icons");

/* ── Config ─────────────────────────────────────────────────── */

// Read .env by hand; this runs outside Next, which would normally load it.
async function loadEnv() {
  const { readFile } = await import("node:fs/promises");
  try {
    const raw = await readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (!m) continue;
      const key = m[1];
      if (process.env[key] !== undefined) continue; // real env wins
      process.env[key] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    // No .env — fall back to defaults below.
  }
}

/**
 * Drawing colours per theme, matching the palettes in lib/theme.ts. Kept as
 * plain data so this script needs no transpiling.
 *
 * `ink` (the "Our" prefix and the initial) and `accent` (the name itself) are
 * deliberately far apart in both hue and lightness — the wordmark reads as two
 * halves, and picking neighbouring tones makes it look like a mistake.
 */
const PALETTES = {
  pink:     { bg: "#fff8f0", ink: "#5c3a5e", accent: "#ec4b8c", leaf: "#8cbf7a", petal: "#f48fb4", rule: "#f2a7b8" },
  blue:     { bg: "#f4faff", ink: "#26405a", accent: "#3f9fd8", leaf: "#7fbfae", petal: "#8fc4e8", rule: "#7cb4dd" },
  mint:     { bg: "#f6fbf5", ink: "#27503b", accent: "#3fae74", leaf: "#7cb98f", petal: "#a8dcb8", rule: "#8bc9a2" },
  peach:    { bg: "#fffaf3", ink: "#5e3a24", accent: "#e07b32", leaf: "#9cbf86", petal: "#f7c095", rule: "#f0ab77" },
  lavender: { bg: "#faf7ff", ink: "#403163", accent: "#8b63d4", leaf: "#9ec49a", petal: "#c3aef0", rule: "#a892e0" },
};

function config() {
  const babyName = (process.env.NEXT_PUBLIC_BABY_NAME || "Baby").trim();
  const siteName = (process.env.NEXT_PUBLIC_SITE_NAME || `Our${babyName}`).trim();
  const tagline = (process.env.NEXT_PUBLIC_SITE_TAGLINE || "A Year of Firsts").trim();
  const theme = (process.env.SITE_THEME || "pink").trim().toLowerCase();
  const palette = PALETTES[theme] || PALETTES.pink;

  // "OurManasvi" splits into a muted "Our" + the name in the accent colour.
  const lower = siteName.toLowerCase();
  const idx = lower.lastIndexOf(babyName.toLowerCase());
  const [prefix, highlight] =
    idx > 0 ? [siteName.slice(0, idx), siteName.slice(idx)] : ["", siteName];

  return {
    babyName,
    siteName,
    tagline,
    theme,
    palette,
    prefix,
    highlight,
    initial: babyName.charAt(0).toUpperCase(),
  };
}

/* ── Drawing ────────────────────────────────────────────────── */

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A leaf, drawn pointing outward at `angle` degrees around the wreath. */
function leaf(cx, cy, r, angle, len, fill) {
  const rad = (angle * Math.PI) / 180;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${len.toFixed(1)}" ry="${(len * 0.42).toFixed(1)}"
    fill="${fill}" transform="rotate(${(angle + 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" opacity="0.9"/>`;
}

/** Deterministic wobble so the wreath reads as hand-drawn, not as a bead chain. */
function wobble(i) {
  return 0.82 + 0.36 * Math.abs(Math.sin(i * 2.399));
}

/** A five-petal flower. */
function flower(cx, cy, r, angle, size, petal, centre) {
  const rad = (angle * Math.PI) / 180;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 * Math.PI) / 180;
    return `<ellipse cx="${(x + size * 0.62 * Math.cos(a)).toFixed(1)}"
      cy="${(y + size * 0.62 * Math.sin(a)).toFixed(1)}"
      rx="${(size * 0.5).toFixed(1)}" ry="${(size * 0.38).toFixed(1)}" fill="${petal}"
      transform="rotate(${((i * 72) + 90).toFixed(1)} ${(x + size * 0.62 * Math.cos(a)).toFixed(1)} ${(y + size * 0.62 * Math.sin(a)).toFixed(1)})"/>`;
  }).join("");
  return `${petals}<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(size * 0.3).toFixed(1)}" fill="${centre}"/>`;
}

const S = 512; // everything is drawn at this scale, then sharp resizes

/**
 * The wreath, initial and heart, drawn around (0,0) so the caller can place and
 * scale it freely. Base radius is 100, i.e. it occupies roughly 260×260.
 */
function emblem(p, initial) {
  const R = 100;
  let out = "";

  // Open at the top, like a laurel — the gap is what stops it reading as a ring.
  for (let a = 118, i = 0; a <= 422; a += 14, i++) {
    out += leaf(0, 0, R, a, 17 * wobble(i), p.leaf);
  }
  out += flower(0, 0, R, 168, 15, p.petal, p.accent);
  out += flower(0, 0, R, 196, 13, p.petal, p.accent);
  out += flower(0, 0, R, 146, 11, p.petal, p.accent);

  const fs = 132; // initial
  out += `<text x="0" y="${fs * 0.3}" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="${fs}"
    font-weight="700" fill="${p.ink}">${esc(initial)}</text>`;

  const h = 17; // heart tucked under the initial
  const hy = fs * 0.44;
  out += `<path d="M 0 ${hy + h * 0.9}
    C ${-h * 1.35} ${hy - h * 0.1} ${-h * 0.62} ${hy - h * 1.15} 0 ${hy - h * 0.28}
    C ${h * 0.62} ${hy - h * 1.15} ${h * 1.35} ${hy - h * 0.1} 0 ${hy + h * 0.9} z"
    fill="${p.petal}"/>`;

  return out;
}

/**
 * Builds the icon SVG.
 *
 * `withText` off is for the maskable and Apple icons: Android crops the outer
 * ~20% to whatever shape the launcher fancies, so those drop the wordmark and
 * scale the emblem up to fill the safe zone instead of shrinking it.
 */
function buildSvg({ size, cfg, withText = true }) {
  const { palette: p, initial, prefix, highlight, tagline } = cfg;
  const cx = S / 2;

  // With the wordmark the emblem sits high; alone it centres and grows.
  const scale = withText ? 0.95 : 1.34;
  const cy = withText ? S * 0.375 : S * 0.5;

  const art = `<g transform="translate(${cx} ${cy}) scale(${scale})">${emblem(p, initial)}</g>`;

  const text = withText
    ? `
    <text x="${cx}" y="${S * 0.725}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="${S * 0.105}" font-weight="700">
      <tspan fill="${p.ink}">${esc(prefix)}</tspan><tspan fill="${p.accent}">${esc(highlight)}</tspan>
    </text>
    <line x1="${S * 0.2}" y1="${S * 0.788}" x2="${S * 0.315}" y2="${S * 0.788}" stroke="${p.rule}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="${S * 0.685}" y1="${S * 0.788}" x2="${S * 0.8}" y2="${S * 0.788}" stroke="${p.rule}" stroke-width="2.5" stroke-linecap="round"/>
    <text x="${cx}" y="${S * 0.802}" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif" font-size="${S * 0.048}" fill="${p.ink}">${esc(tagline)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${p.bg}"/>
  ${art}
  ${text}
</svg>`;
}

/* ── Output ─────────────────────────────────────────────────── */

const TARGETS = [
  { file: "icon-192.png", size: 192, withText: true },
  { file: "icon-512.png", size: 512, withText: true },
  // Emblem only — the wordmark would be illegible once cropped/shrunk.
  { file: "icon-maskable-512.png", size: 512, withText: false },
  { file: "apple-touch-icon.png", size: 180, withText: false },
];

/**
 * Refuse to clobber icons this script did not write — they are most likely a
 * designer's, and overwriting them silently would lose work that was paid for.
 * The marker is dropped alongside the PNGs on every successful run.
 */
const MARKER = ".generated-by-script";

async function guardExistingIcons(force) {
  if (force) return;
  const { access } = await import("node:fs/promises");
  const exists = async (f) => access(path.join(OUT_DIR, f)).then(() => true, () => false);

  if (!(await exists("icon-512.png"))) return; // nothing to lose
  if (await exists(MARKER)) return; // ours, safe to redo

  console.error(
    `\nRefusing to overwrite: public/icons/ holds icons this script did not generate.\n` +
      `They are probably hand-designed. If you are sure, re-run with --force:\n\n` +
      `    npm run icons -- --force\n\n` +
      `(Everything in that folder is committed, so "git checkout public/icons" undoes a mistake.)\n`
  );
  process.exit(1);
}

async function main() {
  await loadEnv();
  const cfg = config();
  await guardExistingIcons(process.argv.includes("--force"));

  console.log(`Generating icons for "${cfg.siteName}" (initial ${cfg.initial}, theme ${cfg.theme})…`);
  await mkdir(OUT_DIR, { recursive: true });

  for (const t of TARGETS) {
    const svg = buildSvg({ size: t.size, cfg, withText: t.withText });
    const png = await sharp(Buffer.from(svg)).resize(t.size, t.size).png().toBuffer();
    await writeFile(path.join(OUT_DIR, t.file), png);
    console.log(`  ✓ ${t.file} (${t.size}×${t.size})`);
  }

  await writeFile(
    path.join(OUT_DIR, MARKER),
    "Written by scripts/generate-icons.mjs. Delete this to protect hand-made icons here.\n"
  );

  console.log("\nDone. Open public/icons/icon-512.png and check it before shipping.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
