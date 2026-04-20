import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const systemItemTypes = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6', isSystem: true },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6', isSystem: true },
  { name: 'command', icon: 'Terminal', color: '#f97316', isSystem: true },
  { name: 'note', icon: 'StickyNote', color: '#fde047', isSystem: true },
  { name: 'file', icon: 'File', color: '#6b7280', isSystem: true },
  { name: 'image', icon: 'Image', color: '#ec4899', isSystem: true },
  { name: 'link', icon: 'Link', color: '#10b981', isSystem: true },
];

async function main() {
  console.log('Starting DB Seed...');

  // 1. User
  const hashedPassword = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date()
    },
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`User created/updated: ${user.email}`);

  // 2. Item Types
  // First, collect all existing system types
  const existingTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
  });
  const typeMap = new Map<string, string>();

  // Build a map of lowercase name -> first existing type (for dedup)
  const lowerToType = new Map<string, typeof existingTypes[0]>();
  for (const et of existingTypes) {
    const key = et.name.toLowerCase();
    if (!lowerToType.has(key)) {
      lowerToType.set(key, et);
    }
  }

  // Create missing types; for existing ones, update them to canonical name
  for (const t of systemItemTypes) {
    const lowerName = t.name.toLowerCase();
    const existing = lowerToType.get(lowerName);

    if (existing) {
      // Update in place so the ID stays stable
      const updated = await prisma.itemType.update({
        where: { id: existing.id },
        data: { name: t.name, icon: t.icon, color: t.color },
      });
      typeMap.set(t.name, updated.id);
    } else {
      const created = await prisma.itemType.create({ data: t });
      typeMap.set(t.name, created.id);
      console.log(`Created System Item Type: ${t.name}`);
    }
  }

  // Migrate items from duplicate types to their canonical type, then delete duplicates
  const afterTypes = await prisma.itemType.findMany({ where: { isSystem: true } });
  const seenLower = new Set<string>();
  for (const et of afterTypes) {
    const key = et.name.toLowerCase();
    if (seenLower.has(key)) {
      // Find the canonical type with the same lowercase name
      const canonical = afterTypes.find(
        (t) => t.id !== et.id && t.name.toLowerCase() === key,
      );
      if (canonical) {
        // Migrate items to canonical type
        await prisma.item.updateMany({
          where: { typeId: et.id },
          data: { typeId: canonical.id },
        });
      }
      await prisma.itemType.delete({ where: { id: et.id } });
      console.log(`Deleted duplicate system type: ${et.name}`);
    } else {
      seenLower.add(key);
    }
  }

  // Helper to get typeId
  const getTypeId = (name: string) => {
    const id = typeMap.get(name);
    if (!id) throw new Error(`Type ${name} not found`);
    return id;
  };

  // 3. Collections & Items
  // Clean up existing collections for this user to avoid duplicates if re-running
  await prisma.collection.deleteMany({ where: { userId: user.id } });
  await prisma.item.deleteMany({ where: { userId: user.id } });
  console.log(`Cleared existing collections and items for ${user.email}`);

  // React Patterns
  const reactCol = await prisma.collection.create({
    data: { name: 'React Patterns', description: 'Reusable React patterns and hooks', userId: user.id, isFavorite: true }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Custom Hooks', description: 'useDebounce, useLocalStorage, etc.', contentType: 'text', typeId: getTypeId('snippet'), collectionId: reactCol.id, userId: user.id },
      { title: 'Component Patterns', description: 'Context providers, compound components', contentType: 'text', typeId: getTypeId('snippet'), collectionId: reactCol.id, userId: user.id },
      { title: 'Utility Functions', description: 'Common React utilities', contentType: 'text', typeId: getTypeId('snippet'), collectionId: reactCol.id, userId: user.id },
    ]
  });

  // AI Workflows
  const aiCol = await prisma.collection.create({
    data: { name: 'AI Workflows', description: 'AI prompts and workflow automations', userId: user.id }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Code Review', description: 'Prompts for code review', contentType: 'text', typeId: getTypeId('prompt'), collectionId: aiCol.id, userId: user.id },
      { title: 'Documentation Generation', description: 'Prompts for auto-generating docs', contentType: 'text', typeId: getTypeId('prompt'), collectionId: aiCol.id, userId: user.id },
      { title: 'Refactoring Assistance', description: 'Prompts to assist in refactoring large files', contentType: 'text', typeId: getTypeId('prompt'), collectionId: aiCol.id, userId: user.id },
    ]
  });

  // DevOps
  const devopsCol = await prisma.collection.create({
    data: { name: 'DevOps', description: 'Infrastructure and deployment resources', userId: user.id }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Docker Setup', description: 'Docker CLI, Compose configs, CI/CD templates', contentType: 'text', typeId: getTypeId('snippet'), collectionId: devopsCol.id, userId: user.id },
      { title: 'Deploy Script', description: 'Deployment bash commands', contentType: 'text', typeId: getTypeId('command'), collectionId: devopsCol.id, userId: user.id },
      { title: 'AWS Docs', description: 'AWS official docs', url: 'https://docs.aws.amazon.com', contentType: 'text', typeId: getTypeId('link'), collectionId: devopsCol.id, userId: user.id },
      { title: 'Vercel Guide', description: 'Vercel deployment guides', url: 'https://vercel.com/docs', contentType: 'text', typeId: getTypeId('link'), collectionId: devopsCol.id, userId: user.id },
    ]
  });

  // Terminal Commands
  const terminalCol = await prisma.collection.create({
    data: { name: 'Terminal Commands', description: 'Useful shell commands for everyday development', userId: user.id }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Git Operations', description: 'git rebase, squash, stash', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
      { title: 'Docker Commands', description: 'docker ps, cleanup, prune', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
      { title: 'Process Management', description: 'htop, kill, ps aux', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
      { title: 'Package Manager Utilities', description: 'npm, pnpm, yarn commands', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
    ]
  });

  // Design Resources
  const designCol = await prisma.collection.create({
    data: { name: 'Design Resources', description: 'UI/UX resources and references', userId: user.id, isFavorite: true }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Tailwind CSS Docs', description: 'Utility-first CSS framework', url: 'https://tailwindcss.com', contentType: 'text', typeId: getTypeId('link'), collectionId: designCol.id, userId: user.id },
      { title: 'Shadcn UI', description: 'Accessible and customizable components', url: 'https://ui.shadcn.com', contentType: 'text', typeId: getTypeId('link'), collectionId: designCol.id, userId: user.id },
      { title: 'Relume Library', description: 'Webflow design system', url: 'https://library.relume.io', contentType: 'text', typeId: getTypeId('link'), collectionId: designCol.id, userId: user.id },
      { title: 'Lucide Icons', description: 'Open source icon library', url: 'https://lucide.dev', contentType: 'text', typeId: getTypeId('link'), collectionId: designCol.id, userId: user.id },
    ]
  });

  console.log('Seeding finished successfully.');
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
