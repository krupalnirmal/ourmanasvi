import { PrismaClient } from "@prisma/client";
import { MONTHS } from "../lib/journey-data";

const prisma = new PrismaClient();

// Who this book is for — all configurable so a new site needs no code edits.
const BABY_NAME = process.env.NEXT_PUBLIC_BABY_NAME?.trim() || "Baby";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || `Our${BABY_NAME}`;
// Stable row id, derived from the name so re-seeding updates rather than duplicates.
const BABY_ID = BABY_NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function envDate(key: string, fallback: string) {
  const raw = process.env[key]?.trim();
  if (!raw) return new Date(fallback);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`${key} is not a valid date: "${raw}" (expected YYYY-MM-DD)`);
  }
  return d;
}

async function main() {
  console.log(`🌱 Seeding ${SITE_NAME}…`);

  // One baby (the memory book's subject). Upsert by a stable id.
  const baby = await prisma.baby.upsert({
    where: { id: BABY_ID },
    update: {},
    create: {
      id: BABY_ID,
      name: BABY_NAME,
      tagline: "A year of firsts, from birth to first birthday.",
      birthDate: envDate("BABY_BIRTH_DATE", "2025-07-14"),
      firstBirthday: envDate("BABY_FIRST_BIRTHDAY", "2026-07-14"),
    },
  });
  console.log(`👶 Baby ready: ${baby.name}`);

  for (const m of MONTHS) {
    // Upsert the month by (babyId, monthNumber)
    const month = await prisma.month.upsert({
      where: { babyId_monthNumber: { babyId: baby.id, monthNumber: m.monthNumber } },
      update: {
        title: m.title,
        subtitle: m.subtitle ?? null,
        description: m.intro,
      },
      create: {
        babyId: baby.id,
        monthNumber: m.monthNumber,
        title: m.title,
        subtitle: m.subtitle ?? null,
        description: m.intro,
      },
    });

    // Reset child content for a clean, idempotent seed.
    await prisma.memory.deleteMany({ where: { monthId: month.id } });
    await prisma.milestone.deleteMany({ where: { monthId: month.id } });

    if (m.memories.length) {
      await prisma.memory.createMany({
        data: m.memories.map((mem) => ({
          monthId: month.id,
          title: mem.title,
          content: mem.content,
          mood: mem.mood ?? null,
        })),
      });
    }
    if (m.milestones.length) {
      await prisma.milestone.createMany({
        data: m.milestones.map((ms) => ({
          monthId: month.id,
          title: ms.title,
          description: ms.description ?? null,
          icon: ms.icon ?? null,
        })),
      });
    }
    console.log(`  ✓ Month ${m.monthNumber}: ${m.title}`);
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
