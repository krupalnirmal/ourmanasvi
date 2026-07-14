import { PrismaClient } from "@prisma/client";
import { MONTHS } from "../lib/journey-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding OurManasvi…");

  // One baby (the memory book's subject). Upsert by a stable id.
  const baby = await prisma.baby.upsert({
    where: { id: "manasvi" },
    update: {},
    create: {
      id: "manasvi",
      name: "Manasvi",
      tagline: "A year of firsts, from birth to first birthday.",
      birthDate: new Date("2025-01-01"),
      firstBirthday: new Date("2026-01-01"),
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
