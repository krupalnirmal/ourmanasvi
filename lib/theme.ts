/**
 * Per-site colour palettes, chosen with `SITE_THEME` in `.env`.
 *
 * The token names below are the ones the original pink design shipped with
 * (`soft-pink`, `baby-blue`, `lavender`) and every component still uses them as
 * Tailwind classes — `bg-soft-pink-deep`, `text-ink-soft`, and so on. A palette
 * therefore swaps the *values* behind those names rather than renaming them:
 * in the `blue` theme, `soft-pink-deep` simply holds a blue. Renaming the tokens
 * to something neutral would mean touching every component, so read them as
 * roles, not colours:
 *
 *   soft-pink*  → the primary accent (buttons, active nav, handwriting text)
 *   baby-blue*  → the secondary accent (icon tiles, badges)
 *   lavender*   → borders, rings and quiet surfaces
 *   cream*      → page and card backgrounds
 *   ink*        → body text
 *
 * `globals.css` still hardcodes the pink palette, which keeps it as the default
 * and means a missing/unknown `SITE_THEME` renders exactly as before.
 *
 * To add a palette: copy a block, keep every key, and pick tones of a similar
 * lightness so the layout's contrast holds up.
 */

export interface Palette {
  cream: string;
  creamDeep: string;
  softPink: string;
  softPinkDeep: string;
  roseDeep: string;
  babyBlue: string;
  babyBlueDeep: string;
  lavender: string;
  lavenderDeep: string;
  ink: string;
  inkSoft: string;
  background: string;
  /** Browser UI colour (address bar on mobile, PWA splash). */
  themeColor: string;
}

export const PALETTES: Record<string, Palette> = {
  /** The original — soft pink, lavender and baby blue on cream. */
  pink: {
    cream: "#fff8f0",
    creamDeep: "#fbeee0",
    softPink: "#f9c9d4",
    softPinkDeep: "#f2a7b8",
    roseDeep: "#c24d72",
    babyBlue: "#c6e4f2",
    babyBlueDeep: "#9ccde6",
    lavender: "#e4dbf7",
    lavenderDeep: "#c7b8ee",
    ink: "#3f3a44",
    inkSoft: "#6b6572",
    background: "#fffdfb",
    themeColor: "#f2a7b8",
  },

  /** Calm sky blues with a soft teal second accent. */
  blue: {
    cream: "#f4faff",
    creamDeep: "#e4f0fa",
    softPink: "#bcdcf5",
    softPinkDeep: "#7cb4dd",
    roseDeep: "#2f6b9a",
    babyBlue: "#cdeae4",
    babyBlueDeep: "#94cec2",
    lavender: "#dbe3f7",
    lavenderDeep: "#b0c0e8",
    ink: "#33404a",
    inkSoft: "#5d6b77",
    background: "#fbfdff",
    themeColor: "#7cb4dd",
  },

  /** Fresh mint and sage, gentle and natural. */
  mint: {
    cream: "#f6fbf5",
    creamDeep: "#e7f3e4",
    softPink: "#c4e4cd",
    softPinkDeep: "#8bc9a2",
    roseDeep: "#2f7a52",
    babyBlue: "#cfe8ee",
    babyBlueDeep: "#a0cedc",
    lavender: "#dfe9da",
    lavenderDeep: "#b6cdae",
    ink: "#37423a",
    inkSoft: "#606c63",
    background: "#fcfefb",
    themeColor: "#8bc9a2",
  },

  /** Warm peach and apricot, cosy and sunlit. */
  peach: {
    cream: "#fffaf3",
    creamDeep: "#fdeddc",
    softPink: "#fbd6b8",
    softPinkDeep: "#f0ab77",
    roseDeep: "#b85f2a",
    babyBlue: "#cfe4ef",
    babyBlueDeep: "#a3cbe0",
    lavender: "#f6e2d3",
    lavenderDeep: "#e2bfa4",
    ink: "#4a3a30",
    inkSoft: "#77655a",
    background: "#fffdf9",
    themeColor: "#f0ab77",
  },

  /** Dreamy violets — the softest of the set. */
  lavender: {
    cream: "#faf7ff",
    creamDeep: "#eee7fb",
    softPink: "#ddd3f5",
    softPinkDeep: "#a892e0",
    roseDeep: "#6b4bab",
    babyBlue: "#d5e3f7",
    babyBlueDeep: "#aac5e8",
    lavender: "#eae2fb",
    lavenderDeep: "#c9b9ee",
    ink: "#3d3650",
    inkSoft: "#665e7a",
    background: "#fdfcff",
    themeColor: "#a892e0",
  },
};

export const DEFAULT_THEME = "pink";

/** The palette named by SITE_THEME, falling back to the original pink. */
export function activePalette(): Palette {
  const name = process.env.SITE_THEME?.trim().toLowerCase();
  return (name && PALETTES[name]) || PALETTES[DEFAULT_THEME];
}

/**
 * `:root` overrides for the active palette, injected by the root layout.
 * Tailwind v4 compiles `bg-soft-pink-deep` down to
 * `var(--color-soft-pink-deep)`, so redefining those variables re-skins every
 * component without any of them being touched.
 */
export function themeCss(): string {
  const p = activePalette();
  return `:root{--color-cream:${p.cream};--color-cream-deep:${p.creamDeep};--color-soft-pink:${p.softPink};--color-soft-pink-deep:${p.softPinkDeep};--color-rose-deep:${p.roseDeep};--color-baby-blue:${p.babyBlue};--color-baby-blue-deep:${p.babyBlueDeep};--color-lavender:${p.lavender};--color-lavender-deep:${p.lavenderDeep};--color-ink:${p.ink};--color-ink-soft:${p.inkSoft};--background:${p.background};--foreground:${p.ink};}`;
}
