import type { TimelineItem } from "@/types";

/**
 * Rich static content for each stop on the journey (birth → 12 months).
 * This is placeholder storytelling content so the whole experience is
 * complete and deployable BEFORE the database/Cloudinary are wired up.
 * When the DB is connected (Phase: persistence), these shapes map 1:1
 * onto the Prisma models (Month / Memory / Milestone / Gallery / Video).
 */

export interface MonthMemory {
  title: string;
  content: string;
  mood?: string;
}

export interface MonthMilestone {
  title: string;
  description?: string;
  icon?: string;
}

export interface MonthDetail extends TimelineItem {
  /** Short lead paragraph shown at the top of the month page. */
  intro: string;
  gallery: { caption: string }[]; // placeholders until Cloudinary images exist
  memories: MonthMemory[];
  milestones: MonthMilestone[];
}

export const MONTHS: MonthDetail[] = [
  {
    monthNumber: 0,
    title: "The Beginning",
    subtitle: "Hello, world",
    accent: "cream",
    intro:
      "The day everything changed. After all the waiting, Manasvi arrived — small, perfect, and impossibly loved.",
    gallery: [{ caption: "First held" }, { caption: "Tiny hands" }, { caption: "Going home" }],
    memories: [
      {
        title: "The first cry",
        content:
          "The whole room went quiet, and then that tiny cry filled it up. We cried too.",
        mood: "🥹",
      },
    ],
    milestones: [
      { title: "Born", description: "Welcome to the world", icon: "🌟" },
      { title: "First feed", icon: "🍼" },
    ],
  },
  {
    monthNumber: 1,
    title: "First Month",
    subtitle: "Tiny fingers, tiny toes",
    accent: "pink",
    intro:
      "A month of sleepy cuddles, midnight feeds, and memorising every little feature.",
    gallery: [{ caption: "Sleepy smiles" }, { caption: "Little yawn" }, { caption: "Cozy naps" }],
    memories: [
      {
        title: "Grip reflex",
        content: "Wrapped a whole hand around one finger and refused to let go.",
        mood: "🥰",
      },
    ],
    milestones: [
      { title: "Focuses on faces", icon: "👀" },
      { title: "Responds to sound", icon: "🔔" },
    ],
  },
  {
    monthNumber: 2,
    title: "Second Month",
    subtitle: "The first real smile",
    accent: "blue",
    intro: "The month the smiles became real — and our hearts melted completely.",
    gallery: [{ caption: "First grin" }, { caption: "Play mat" }, { caption: "Morning light" }],
    memories: [
      { title: "That smile", content: "Not gas this time — a real, deliberate smile.", mood: "😊" },
    ],
    milestones: [
      { title: "Social smile", icon: "😄" },
      { title: "Coos and gurgles", icon: "💬" },
    ],
  },
  {
    monthNumber: 3,
    title: "Third Month",
    subtitle: "Giggles begin",
    accent: "lavender",
    intro: "Laughter entered the house and never really left.",
    gallery: [{ caption: "Belly laughs" }, { caption: "Tummy time" }, { caption: "Discoveries" }],
    memories: [
      { title: "First laugh", content: "A silly face was all it took — the giggle was magic.", mood: "😂" },
    ],
    milestones: [
      { title: "Laughs out loud", icon: "😆" },
      { title: "Holds head steady", icon: "💪" },
    ],
  },
  {
    monthNumber: 4,
    title: "Fourth Month",
    subtitle: "Reaching out",
    accent: "pink",
    intro: "Curious hands started reaching for the whole world.",
    gallery: [{ caption: "Grabbing toys" }, { caption: "Colours" }, { caption: "Curiosity" }],
    memories: [
      { title: "Grabbed a toy", content: "Reached out, grabbed the rattle, and looked so proud.", mood: "🤩" },
    ],
    milestones: [
      { title: "Reaches for objects", icon: "✋" },
      { title: "Recognises us", icon: "❤️" },
    ],
  },
  {
    monthNumber: 5,
    title: "Fifth Month",
    subtitle: "Rolling over",
    accent: "blue",
    intro: "Suddenly, staying in one place was no longer an option.",
    gallery: [{ caption: "First roll" }, { caption: "Playtime" }, { caption: "So strong" }],
    memories: [
      { title: "Rolled over!", content: "Back to front, all on their own. We cheered like it was the World Cup.", mood: "🎉" },
    ],
    milestones: [
      { title: "Rolls over", icon: "🔄" },
      { title: "Grabs feet", icon: "🦶" },
    ],
  },
  {
    monthNumber: 6,
    title: "Half a Year",
    subtitle: "Sitting up tall",
    accent: "lavender",
    intro: "Half a year of you already. Sitting up, taking in the whole world.",
    gallery: [{ caption: "Sitting up" }, { caption: "First tastes" }, { caption: "Six months!" }],
    memories: [
      { title: "First solid food", content: "The face after the first spoon of mashed banana — priceless.", mood: "😋" },
    ],
    milestones: [
      { title: "Sits with support", icon: "🪑" },
      { title: "Starts solids", icon: "🥄" },
    ],
  },
  {
    monthNumber: 7,
    title: "Seventh Month",
    subtitle: "First tastes",
    accent: "cream",
    intro: "New flavours, new faces, and a personality shining through.",
    gallery: [{ caption: "Mealtime fun" }, { caption: "Messy joy" }, { caption: "New foods" }],
    memories: [
      { title: "Loves everything", content: "Turns out someone is not a picky eater at all.", mood: "😍" },
    ],
    milestones: [
      { title: "Sits unsupported", icon: "🧘" },
      { title: "Passes objects hand to hand", icon: "🤲" },
    ],
  },
  {
    monthNumber: 8,
    title: "Eighth Month",
    subtitle: "Crawling adventures",
    accent: "pink",
    intro: "Nothing in the house is safe anymore — and we love it.",
    gallery: [{ caption: "On the move" }, { caption: "Exploring" }, { caption: "Little explorer" }],
    memories: [
      { title: "First crawl", content: "Made a beeline straight for the TV remote. Of course.", mood: "😅" },
    ],
    milestones: [
      { title: "Crawls", icon: "🐛" },
      { title: "Babbles 'mama/dada'", icon: "🗣️" },
    ],
  },
  {
    monthNumber: 9,
    title: "Ninth Month",
    subtitle: "Pulling to stand",
    accent: "blue",
    intro: "Every piece of furniture became something to pull up on.",
    gallery: [{ caption: "Standing tall" }, { caption: "Peek-a-boo" }, { caption: "Cheeky grins" }],
    memories: [
      { title: "Stood up", content: "Pulled up on the sofa and grinned like a champion.", mood: "🏆" },
    ],
    milestones: [
      { title: "Pulls to stand", icon: "🧍" },
      { title: "Plays peek-a-boo", icon: "🙈" },
    ],
  },
  {
    monthNumber: 10,
    title: "Tenth Month",
    subtitle: "First words",
    accent: "lavender",
    intro: "The babbling turned into something that sounded a lot like... words.",
    gallery: [{ caption: "Chatterbox" }, { caption: "Storytime" }, { caption: "Big feelings" }],
    memories: [
      { title: "Said 'mama'", content: "Clear as day, and definitely on purpose. Heart = melted.", mood: "🥲" },
    ],
    milestones: [
      { title: "First word", icon: "💬" },
      { title: "Waves bye-bye", icon: "👋" },
    ],
  },
  {
    monthNumber: 11,
    title: "Eleventh Month",
    subtitle: "Almost walking",
    accent: "pink",
    intro: "Cruising along the furniture, one wobbly, brave step at a time.",
    gallery: [{ caption: "Cruising" }, { caption: "Wobbly steps" }, { caption: "So close" }],
    memories: [
      { title: "Two steps!", content: "Let go of the table and took two whole steps before the happy plop.", mood: "😮" },
    ],
    milestones: [
      { title: "Cruises furniture", icon: "🚶" },
      { title: "Stands alone briefly", icon: "⚖️" },
    ],
  },
  {
    monthNumber: 12,
    title: "First Birthday",
    subtitle: "A whole year of love",
    accent: "cream",
    intro:
      "One whole year. A year of firsts, of growing, of loving you more every single day. Happy birthday, Manasvi.",
    gallery: [{ caption: "The big day" }, { caption: "Cake smash" }, { caption: "One year old!" }],
    memories: [
      { title: "Cake smash", content: "Zero hesitation. Both hands straight into the cake. Perfect.", mood: "🎂" },
    ],
    milestones: [
      { title: "Turns ONE", icon: "🎉" },
      { title: "First steps", icon: "👣" },
    ],
  },
];

export function getMonth(n: number): MonthDetail | undefined {
  return MONTHS.find((m) => m.monthNumber === n);
}
