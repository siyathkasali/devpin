import { prisma } from "./index";
import { Prisma } from "@/src/generated/prisma";

// Type definition for an item with its required relations
export type DashboardItem = Prisma.ItemGetPayload<{
  include: {
    type: true;
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

export async function getDashboardItemStats(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const [totalItems, favoriteItems] = await Promise.all([
    prisma.item.count({
      where: { userId: user.id },
    }),
    prisma.item.count({
      where: { userId: user.id, isFavorite: true },
    }),
  ]);

  return { totalItems, favoriteItems };
}

export async function getPinnedItems(userEmail: string): Promise<DashboardItem[]> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.item.findMany({
    where: {
      userId: user.id,
      isPinned: true,
    },
    include: {
      type: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      // Pin order might not exist, but let's order by creation date as fallback
      createdAt: "desc",
    },
  });
}

export async function getRecentItems(userEmail: string, limit: number = 10): Promise<DashboardItem[]> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.item.findMany({
    where: {
      userId: user.id,
    },
    include: {
      type: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}
