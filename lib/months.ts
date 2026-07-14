import type { TimelineItem } from "@/types";
import { MONTHS } from "@/lib/journey-data";

// Timeline items are derived from the rich month content so there is a
// single source of truth for the journey.
export const JOURNEY: TimelineItem[] = MONTHS.map(
  ({ monthNumber, title, subtitle, accent }) => ({
    monthNumber,
    title,
    subtitle,
    accent,
  })
);

export const ACCENT_CLASSES: Record<
  TimelineItem["accent"],
  { bg: string; dot: string; ring: string; text: string }
> = {
  pink: { bg: "bg-soft-pink/40", dot: "bg-soft-pink-deep", ring: "ring-soft-pink", text: "text-soft-pink-deep" },
  blue: { bg: "bg-baby-blue/40", dot: "bg-baby-blue-deep", ring: "ring-baby-blue", text: "text-baby-blue-deep" },
  lavender: { bg: "bg-lavender/40", dot: "bg-lavender-deep", ring: "ring-lavender", text: "text-lavender-deep" },
  cream: { bg: "bg-cream-deep/60", dot: "bg-soft-pink-deep", ring: "ring-cream-deep", text: "text-soft-pink-deep" },
};

export function monthLabel(n: number): string {
  if (n === 0) return "Day one";
  if (n === 12) return "One year";
  return `Month ${n}`;
}
