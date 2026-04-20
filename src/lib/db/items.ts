import { prisma } from "./index";
import { Prisma } from "@/src/generated/prisma";

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

export type GetDashboardItemStatsResult =
  | { success: true; data: { totalItems: number; favoriteItems: number } }
  | { success: false; error: string };

export async function getDashboardItemStats(
  userEmail: string,
): Promise<GetDashboardItemStatsResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return { success: true, data: { totalItems: 0, favoriteItems: 0 } };
    }

    const [totalItems, favoriteItems] = await Promise.all([
      prisma.item.count({
        where: { userId: user.id },
      }),
      prisma.item.count({
        where: { userId: user.id, isFavorite: true },
      }),
    ]);

    return { success: true, data: { totalItems, favoriteItems } };
  } catch (error) {
    console.error("Error fetching dashboard item stats:", error);
    return { success: false, error: "Failed to fetch item stats" };
  }
}

export type GetPinnedItemsResult =
  | { success: true; data: DashboardItem[] }
  | { success: false; error: string };

export async function getPinnedItems(
  userEmail: string,
): Promise<GetPinnedItemsResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const items = await prisma.item.findMany({
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
        createdAt: "desc",
      },
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching pinned items:", error);
    return { success: false, error: "Failed to fetch pinned items" };
  }
}

export type GetRecentItemsResult =
  | { success: true; data: DashboardItem[] }
  | { success: false; error: string };

export async function getRecentItems(
  userEmail: string,
  limit: number = 10,
): Promise<GetRecentItemsResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const items = await prisma.item.findMany({
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

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching recent items:", error);
    return { success: false, error: "Failed to fetch recent items" };
  }
}