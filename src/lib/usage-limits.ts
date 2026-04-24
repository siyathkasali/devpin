import { prisma } from "@/src/lib/db";

const FREE_ITEM_LIMIT = 50;
const FREE_COLLECTION_LIMIT = 3;

interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  upgradeRequired?: boolean;
}

export async function checkItemLimit(userId: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true, _count: { select: { items: true } } },
  });

  if (user?.isPro) {
    return { allowed: true, current: user._count.items, limit: Infinity };
  }

  const current = user?._count.items ?? 0;
  const allowed = current < FREE_ITEM_LIMIT;

  return {
    allowed,
    current,
    limit: FREE_ITEM_LIMIT,
    upgradeRequired: !allowed,
  };
}

export async function checkCollectionLimit(userId: string): Promise<LimitCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPro: true, _count: { select: { collections: true } } },
  });

  if (user?.isPro) {
    return { allowed: true, current: user._count.collections, limit: Infinity };
  }

  const current = user?._count.collections ?? 0;
  const allowed = current < FREE_COLLECTION_LIMIT;

  return {
    allowed,
    current,
    limit: FREE_COLLECTION_LIMIT,
    upgradeRequired: !allowed,
  };
}