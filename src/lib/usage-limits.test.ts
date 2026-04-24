import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkItemLimit, checkCollectionLimit } from "./usage-limits";
import { prisma } from "@/src/lib/db";

vi.mock("@/src/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("checkItemLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows Pro users unlimited items", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: true,
      _count: { items: 100 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(Infinity);
    expect(result.upgradeRequired).toBeUndefined();
  });

  it("allows free users under limit", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { items: 25 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.current).toBe(25);
    expect(result.limit).toBe(50);
    expect(result.upgradeRequired).toBeFalsy();
  });

  it("denies free users at limit", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { items: 50 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(false);
    expect(result.current).toBe(50);
    expect(result.upgradeRequired).toBe(true);
  });

  it("handles new users with no items", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { items: 0 },
    } as any);

    const result = await checkItemLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.current).toBe(0);
  });
});

describe("checkCollectionLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows Pro users unlimited collections", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: true,
      _count: { collections: 10 },
    } as any);

    const result = await checkCollectionLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(Infinity);
  });

  it("allows free users under 3 collections", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { collections: 2 },
    } as any);

    const result = await checkCollectionLimit("user-123");

    expect(result.allowed).toBe(true);
    expect(result.current).toBe(2);
    expect(result.limit).toBe(3);
  });

  it("denies free users at 3 collections", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      isPro: false,
      _count: { collections: 3 },
    } as any);

    const result = await checkCollectionLimit("user-123");

    expect(result.allowed).toBe(false);
    expect(result.upgradeRequired).toBe(true);
  });
});