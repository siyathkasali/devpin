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
      { title: 'Custom Hooks', description: 'useDebounce, useLocalStorage, etc.', content: `// useDebounce\nimport { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => {\n      clearTimeout(handler);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\n// useLocalStorage\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    if (typeof window === 'undefined') return initialValue;\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n\n  const setValue = (value: T | ((val: T) => T)) => {\n    const valueToStore = value instanceof Function ? value(storedValue) : value;\n    setStoredValue(valueToStore);\n    if (typeof window !== 'undefined') {\n      window.localStorage.setItem(key, JSON.stringify(valueToStore));\n    }\n  };\n\n  return [storedValue, setValue] as const;\n}`, contentType: 'text', typeId: getTypeId('snippet'), collectionId: reactCol.id, userId: user.id },
      { title: 'Component Patterns', description: 'Context providers, compound components', content: `// Context Provider Pattern\nimport { createContext, useContext, ReactNode } from 'react';\n\ninterface ThemeContextType {\n  theme: 'light' | 'dark';\n  toggleTheme: () => void;\n}\n\nconst ThemeContext = createContext<ThemeContextType | undefined>(undefined);\n\nexport function ThemeProvider({ children }: { children: ReactNode }) {\n  const [theme, setTheme] = useState<'light' | 'dark'>('light');\n\n  const toggleTheme = () => {\n    setTheme(prev => prev === 'light' ? 'dark' : 'light');\n  };\n\n  return (\n    <ThemeContext.Provider value={{ theme, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nexport function useTheme() {\n  const context = useContext(ThemeContext);\n  if (!context) throw new Error('useTheme must be used within ThemeProvider');\n  return context;\n}`, contentType: 'text', typeId: getTypeId('snippet'), collectionId: reactCol.id, userId: user.id },
      { title: 'Utility Functions', description: 'Common React utilities', content: `// cn utility (shadcn style)\nimport { type ClassValue, clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n\n// formatDate\nexport function formatDate(date: Date | string): string {\n  return new Intl.DateTimeFormat('en-US', {\n    month: 'short',\n    day: 'numeric',\n    year: 'numeric',\n  }).format(new Date(date));\n}`, contentType: 'text', typeId: getTypeId('snippet'), collectionId: reactCol.id, userId: user.id },
    ]
  });

  // AI Workflows
  const aiCol = await prisma.collection.create({
    data: { name: 'AI Workflows', description: 'AI prompts and workflow automations', userId: user.id }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Code Review', description: 'Prompts for code review', content: `You are a senior software engineer conducting a code review. Analyze the following code for:\n\n1. **Correctness** - Does it do what it's supposed to do?\n2. **Performance** - Any obvious bottlenecks or inefficient operations?\n3. **Security** - Potential vulnerabilities or concerns?\n4. **Readability** - Is the code clear and well-organized?\n\nProvide specific, actionable feedback with examples where possible.\n\nCode to review:\n\`\`\`\n[PASTE CODE HERE]\n\`\`\``, contentType: 'text', typeId: getTypeId('prompt'), collectionId: aiCol.id, userId: user.id },
      { title: 'Documentation Generation', description: 'Prompts for auto-generating docs', content: 'Generate comprehensive documentation for the following code. Include:\n\n1. Overview of what the code does\n2. Parameters and return values\n3. Usage examples\n4. Edge cases and error handling\n5. Related functions or dependencies', contentType: 'text', typeId: getTypeId('prompt'), collectionId: aiCol.id, userId: user.id },
      { title: 'Refactoring Assistance', description: 'Prompts to assist in refactoring large files', content: 'Analyze this large file and suggest:\n\n1. Natural extraction points (functions, modules)\n2. Circular dependency risks\n3. State management improvements\n4. Testability suggestions\n\nFocus on changes that reduce complexity without changing behavior.', contentType: 'text', typeId: getTypeId('prompt'), collectionId: aiCol.id, userId: user.id },
    ]
  });

  // DevOps
  const devopsCol = await prisma.collection.create({
    data: { name: 'DevOps', description: 'Infrastructure and deployment resources', userId: user.id }
  });
  await prisma.item.createMany({
    data: [
      { title: 'Docker Setup', description: 'Docker CLI, Compose configs, CI/CD templates', content: '# Docker Setup\n\n## Common Commands\n\n```bash\n# Build image\ndocker build -t myapp .\n\n# Run container\ndocker run -d -p 3000:3000 myapp\n\n# docker-compose\ndocker-compose up -d\ndocker-compose down\n```\n\n## Dockerfile Example\n\n```dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nEXPOSE 3000\nCMD ["npm", "start"]\n```', contentType: 'text', typeId: getTypeId('snippet'), collectionId: devopsCol.id, userId: user.id },
      { title: 'Deploy Script', description: 'Deployment bash commands', content: '#!/bin/bash\n\n# Deploy script\nexport NODE_ENV=production\ngit pull origin main\nnpm install\nnpm run build\npm2 restart all\n\necho "Deployment complete!"', contentType: 'text', typeId: getTypeId('command'), collectionId: devopsCol.id, userId: user.id },
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
      { title: 'Git Operations', description: 'git rebase, squash, stash', content: '# Git Operations\n\n## Rebase\n```bash\ngit checkout feature-branch\ngit rebase main\n```\n\n## Squash commits\n```bash\ngit rebase -i HEAD~3\n# In editor: squash/pick commands\n```\n\n## Stash\n```bash\ngit stash\ngit stash pop\n# or\nngit stash apply\ngit stash drop\n```', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
      { title: 'Docker Commands', description: 'docker ps, cleanup, prune', content: '# Docker Commands\n\n## Container Management\n```bash\ndocker ps -a              # List all containers\ndocker stop <id>          # Stop container\ndocker rm <id>            # Remove container\ndocker logs <id>           # View logs\n```\n\n## Cleanup\n```bash\ndocker system prune       # Remove unused data\ndocker volume prune        # Remove unused volumes\ndocker image prune -a      # Remove all unused images\n```', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
      { title: 'Process Management', description: 'htop, kill, ps aux', content: '# Process Management\n\n## View Processes\n```bash\nps aux | grep node        # Find node processes\nhtop                      # Interactive process viewer\ntop                       # Basic process viewer\n```\n\n## Kill Processes\n```bash\nkill <pid>               # Graceful kill\nkill -9 <pid>            # Force kill\npkill -f "node server"    # Kill by name\n```', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
      { title: 'Package Manager Utilities', description: 'npm, pnpm, yarn commands', content: '# Package Manager Commands\n\n## npm\n```bash\nnpm install\nnpm run dev\nnpm run build\nnpm test\nnpm install -D <package>\n```\n\n## pnpm\n```bash\npnpm install\npnpm add <package>\npnpm remove <package>\n```\n\n## yarn\n```bash\nyarn install\nyarn add <package>\nyarn remove <package>\n```', contentType: 'text', typeId: getTypeId('command'), collectionId: terminalCol.id, userId: user.id },
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
