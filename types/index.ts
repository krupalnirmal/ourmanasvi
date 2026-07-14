// Shared domain types for OurManasvi.

export interface MonthSummary {
  id: string;
  monthNumber: number;
  title: string;
  subtitle?: string | null;
  coverImage?: string | null;
  date?: string | null;
}

export interface TimelineItem {
  monthNumber: number;
  title: string;
  subtitle?: string;
  accent: "pink" | "blue" | "lavender" | "cream";
  coverImage?: string;
}
