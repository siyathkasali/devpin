import { prisma } from "./index";
import { Prisma } from "@/src/generated/prisma";
import { z } from "zod";

export const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string().url("Invalid URL").nullable().optional().or(z.literal("")),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().min(1).trim()).optional(),
});

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

export type GetItemsByTypeResult =
  | { success: true; data: DashboardItem[] }
  | { success: false; error: string };

export async function getItemsByType(
  userEmail: string,
  typeName: string,
): Promise<GetItemsByTypeResult> {
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
        type: {
          name: {
            equals: typeName,
            mode: "insensitive",
          },
        },
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
    console.error("Error fetching items by type:", error);
    return { success: false, error: "Failed to fetch items by type" };
  }
}

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    type: true;
    tags: {
      include: {
        tag: true;
      };
    };
    collection: true;
  };
}>;

export type GetItemByIdResult =
  | { success: true; data: ItemWithRelations }
  | { success: false; error: string };

export async function getItemById(
  userEmail: string,
  itemId: string,
): Promise<GetItemByIdResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        userId: user.id,
      },
      include: {
        type: true,
        tags: {
          include: {
            tag: true,
          },
        },
        collection: true,
      },
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    return { success: true, data: item };
  } catch (error) {
    console.error("Error fetching item by id:", error);
    return { success: false, error: "Failed to fetch item" };
  }
}

export type UpdateItemData = z.infer<typeof updateItemSchema>;

export type UpdateItemResult =
  | { success: true; data: ItemWithRelations }
  | { success: false; error: string };

export async function updateItem(
  userEmail: string,
  itemId: string,
  data: UpdateItemData
): Promise<UpdateItemResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const existingItem = await prisma.item.findFirst({
      where: {
        id: itemId,
        userId: user.id,
      },
    });

    if (!existingItem) {
      return { success: false, error: "Item not found" };
    }

    // Disconnect all existing tags
    await prisma.itemTag.deleteMany({
      where: { itemId },
    });

    // Handle tags: find existing or create new ones
    let tagConnections: { tagId: string }[] = [];
    if (data.tags && data.tags.length > 0) {
      // Find existing tags
      const existingTags = await prisma.tag.findMany({
        where: {
          name: { in: data.tags },
          userId: user.id,
        },
      });

      // Create new tags that don't exist
      const existingTagNames = new Set(existingTags.map((t) => t.name));
      const newTagNames = data.tags.filter((name) => !existingTagNames.has(name));

      if (newTagNames.length > 0) {
        await prisma.tag.createMany({
          data: newTagNames.map((name) => ({
            name,
            userId: user.id,
          })),
        });
      }

      // Re-fetch all tags to get their IDs
      const allTags = await prisma.tag.findMany({
        where: {
          name: { in: data.tags },
          userId: user.id,
        },
      });

      tagConnections = allTags.map((tag) => ({ tagId: tag.id }));
    }

    // Update item with new data
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        title: data.title,
        description: data.description ?? null,
        content: data.content ?? null,
        url: data.url || null,
        language: data.language ?? null,
        tags: tagConnections.length > 0 ? { create: tagConnections } : undefined,
      },
      include: {
        type: true,
        tags: {
          include: {
            tag: true,
          },
        },
        collection: true,
      },
    });

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: "Failed to update item" };
  }
}