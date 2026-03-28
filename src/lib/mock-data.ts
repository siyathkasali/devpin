// Mock data for DevStash dashboard UI

// ─── Item Types ──────────────────────────────────────────────

export interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export const itemTypes: ItemType[] = [
  { id: "type-snippet", name: "Snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type-prompt", name: "Prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type-command", name: "Command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type-note", name: "Note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type-file", name: "File", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type-image", name: "Image", icon: "Image", color: "#ec4899", isSystem: true },
  { id: "type-link", name: "Link", icon: "Link", color: "#10b981", isSystem: true },
];

// ─── User ────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
}

export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  isPro: false,
};

// ─── Items ───────────────────────────────────────────────────

export interface Item {
  id: string;
  title: string;
  description: string;
  typeId: string;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const items: Item[] = [
  {
    id: "item-1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    typeId: "type-snippet",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    url: null,
    language: "typescript",
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "item-2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    typeId: "type-snippet",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
}`,
    url: null,
    language: "typescript",
    tags: ["api", "error-handling", "fetch"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "item-3",
    title: "Git Rebase Workflow",
    description: "Interactive rebase commands for cleaning up commits",
    typeId: "type-command",
    content: `git rebase -i HEAD~3
# In the editor, change 'pick' to 'squash' for commits to combine
git rebase --continue
git push --force-with-lease`,
    url: null,
    language: "bash",
    tags: ["git", "rebase", "workflow"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "item-4",
    title: "Code Review Prompt",
    description: "AI prompt for thorough code review with best practices",
    typeId: "type-prompt",
    content: `Review this code for:
1. Security vulnerabilities
2. Performance issues
3. Best practice violations
4. Edge cases not handled
5. Suggest improvements with examples

Be specific and reference line numbers.`,
    url: null,
    language: null,
    tags: ["ai", "code-review", "prompt"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
  },
  {
    id: "item-5",
    title: "Docker Compose for Dev",
    description: "Local development setup with PostgreSQL and Redis",
    typeId: "type-file",
    content: null,
    url: null,
    language: "yaml",
    tags: ["docker", "devops", "postgres"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
  {
    id: "item-6",
    title: "Tailwind CSS Cheat Sheet",
    description: "Quick reference for common Tailwind utility classes",
    typeId: "type-link",
    content: null,
    url: "https://tailwindcss.com/docs",
    language: null,
    tags: ["css", "tailwind", "reference"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
  {
    id: "item-7",
    title: "Meeting Notes - Sprint Planning",
    description: "Sprint 4 planning notes and action items",
    typeId: "type-note",
    content: `## Sprint 4 Goals
- Complete auth flow
- Implement item CRUD
- Set up CI/CD pipeline

### Action Items
- [ ] Design database schema
- [ ] Create API endpoints
- [ ] Write integration tests`,
    url: null,
    language: "markdown",
    tags: ["meeting", "sprint", "planning"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
  {
    id: "item-8",
    title: "Architecture Diagram",
    description: "System architecture overview for the microservices setup",
    typeId: "type-image",
    content: null,
    url: null,
    language: null,
    tags: ["architecture", "diagram", "system-design"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

// ─── Collections ─────────────────────────────────────────────

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  itemTypeBreakdown: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export const collections: Collection[] = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    itemTypeBreakdown: { "type-snippet": 7, "type-note": 3, "type-link": 2 },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "col-2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    itemTypeBreakdown: { "type-snippet": 6, "type-note": 2 },
    createdAt: "2024-01-02",
    updatedAt: "2024-01-14",
  },
  {
    id: "col-3",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    itemTypeBreakdown: { "type-file": 3, "type-note": 2 },
    createdAt: "2024-01-03",
    updatedAt: "2024-01-13",
  },
  {
    id: "col-4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
    itemTypeBreakdown: { "type-note": 8, "type-snippet": 6, "type-link": 5, "type-prompt": 5 },
    createdAt: "2024-01-04",
    updatedAt: "2024-01-12",
  },
  {
    id: "col-5",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    itemTypeBreakdown: { "type-command": 10, "type-note": 5 },
    createdAt: "2024-01-05",
    updatedAt: "2024-01-11",
  },
  {
    id: "col-6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    itemTypeBreakdown: { "type-prompt": 12, "type-snippet": 4, "type-note": 2 },
    createdAt: "2024-01-06",
    updatedAt: "2024-01-10",
  },
];
