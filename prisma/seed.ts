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
  const typeMap = new Map<string, string>();
  for (const t of systemItemTypes) {
    const existingType = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true }
    });
    
    let typeId: string;
    if (existingType) {
      const updated = await prisma.itemType.update({
        where: { id: existingType.id },
        data: t
      });
      typeId = updated.id;
    } else {
      const created = await prisma.itemType.create({
        data: t
      });
      typeId = created.id;
      console.log(`Created System Item Type: ${t.name}`);
    }
    typeMap.set(t.name, typeId);
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
    data: { name: 'React Patterns', description: 'Reusable React patterns and hooks', userId: user.id }
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
    data: { name: 'Design Resources', description: 'UI/UX resources and references', userId: user.id }
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
