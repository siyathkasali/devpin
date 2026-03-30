import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const systemItemTypes = [
  { name: 'Snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
  { name: 'Prompt', icon: 'Sparkles', color: '#a855f7', isSystem: true },
  { name: 'Note', icon: 'FileText', color: '#10b981', isSystem: true },
  { name: 'Command', icon: 'Terminal', color: '#f59e0b', isSystem: true },
  { name: 'File', icon: 'File', color: '#64748b', isSystem: true },
  { name: 'Image', icon: 'Image', color: '#ec4899', isSystem: true },
  { name: 'URL', icon: 'Link', color: '#0ea5e9', isSystem: true },
];

async function main() {
  console.log(`Starting seeding...`);

  const existingTypesCount = await prisma.itemType.count({
    where: { isSystem: true },
  });

  if (existingTypesCount > 0) {
    console.log(`Found ${existingTypesCount} existing system item types. Skipping creation to avoid duplicates.`);
    return;
  }

  for (const t of systemItemTypes) {
    const itemType = await prisma.itemType.create({
      data: t,
    });
    console.log(`Created System Item Type: ${itemType.name}`);
  }

  console.log(`Seeding finished successfully.`);
}

main()
  .catch((e) => {
    console.error("Database seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
