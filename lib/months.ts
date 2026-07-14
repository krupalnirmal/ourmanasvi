import type { TimelineItem } from "@/types";

// The journey: birth + 12 months. Static so the timeline renders beautifully
// even before the database is connected (Phase 1 foundation).
export const JOURNEY: TimelineItem[] = [
  { monthNumber: 0, title: "The Beginning", subtitle: "Hello, world", accent: "cream" },
  { monthNumber: 1, title: "First Month", subtitle: "Tiny fingers, tiny toes", accent: "pink" },
  { monthNumber: 2, title: "Second Month", subtitle: "The first real smile", accent: "blue" },
  { monthNumber: 3, title: "Third Month", subtitle: "Giggles begin", accent: "lavender" },
  { monthNumber: 4, title: "Fourth Month", subtitle: "Reaching out", accent: "pink" },
  { monthNumber: 5, title: "Fifth Month", subtitle: "Rolling over", accent: "blue" },
  { monthNumber: 6, title: "Half a Year", subtitle: "Sitting up tall", accent: "lavender" },
  { monthNumber: 7, title: "Seventh Month", subtitle: "First tastes", accent: "cream" },
  { monthNumber: 8, title: "Eighth Month", subtitle: "Crawling adventures", accent: "pink" },
  { monthNumber: 9, title: "Ninth Month", subtitle: "Pulling to stand", accent: "blue" },
  { monthNumber: 10, title: "Tenth Month", subtitle: "First words", accent: "lavender" },
  { monthNumber: 11, title: "Eleventh Month", subtitle: "Almost walking", accent: "pink" },
  { monthNumber: 12, title: "First Birthday", subtitle: "A whole year of love", accent: "cream" },
];

export const ACCENT_CLASSES: Record<
  TimelineItem["accent"],
  { bg: string; dot: string; ring: string }
> = {
  pink: { bg: "bg-soft-pink/40", dot: "bg-soft-pink-deep", ring: "ring-soft-pink" },
  blue: { bg: "bg-baby-blue/40", dot: "bg-baby-blue-deep", ring: "ring-baby-blue" },
  lavender: { bg: "bg-lavender/40", dot: "bg-lavender-deep", ring: "ring-lavender" },
  cream: { bg: "bg-cream-deep/60", dot: "bg-soft-pink-deep", ring: "ring-cream-deep" },
};
