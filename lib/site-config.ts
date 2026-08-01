/**
 * Everything that changes from one baby's book to the next.
 *
 * Set these in `.env` (and on Vercel) when standing up a new site — the code
 * itself should never need editing. NEXT_PUBLIC_ so client components and
 * server metadata can both read them.
 */

/** The baby the book is about. Used in headings, prose and page titles. */
export const BABY_NAME = process.env.NEXT_PUBLIC_BABY_NAME?.trim() || "Baby";

/** The site's own name, e.g. "OurManasvi". Defaults to "Our<BabyName>". */
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || `Our${BABY_NAME}`;

/** Shown under the site name on the homepage hero. */
export const SITE_TAGLINE =
  process.env.NEXT_PUBLIC_SITE_TAGLINE?.trim() || "A Year of Firsts";

/** Used for <meta description>, the PWA manifest and social previews. */
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION?.trim() ||
  `A premium digital memory book celebrating ${BABY_NAME}'s first year, from birth to first birthday.`;

/** Signed off in the footer, e.g. "Made with love, for Manasvi". */
export const FAMILY_NAME =
  process.env.NEXT_PUBLIC_FAMILY_NAME?.trim() || `${BABY_NAME}'s Family`;

/** The big handwritten headline on the homepage hero. */
export const HERO_TITLE =
  process.env.NEXT_PUBLIC_HERO_TITLE?.trim() || "My Little World";

/** Small caps line under the logo in the site header. */
export const HEADER_SUBTITLE =
  process.env.NEXT_PUBLIC_HEADER_SUBTITLE?.trim() || "Forever Memories";

/**
 * Page title for a section, e.g. pageTitle("Gallery") → "Gallery — OurManasvi".
 * Call with no argument for the site's own title.
 */
export function pageTitle(section?: string) {
  return section ? `${section} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
}

/** Possessive form that reads correctly for names ending in s ("Aarav's" / "Ras'"). */
export const BABY_POSSESSIVE = BABY_NAME.endsWith("s") ? `${BABY_NAME}'` : `${BABY_NAME}'s`;
