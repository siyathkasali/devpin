import { prisma } from "./index";

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantTypeColor: string | null;
  types: { id: string; name: string; icon: string; color: string }[];
  createdAt: string;
}

export type GetDashboardCollectionsResult =
  | { success: true; data: DashboardCollection[] }
  | { success: false; error: string };

export async function getDashboardCollections(
  email: string,
): Promise<GetDashboardCollectionsResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        collections: {
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            items: {
              include: {
                type: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const collections = user.collections.map((collection) => {
      const itemCount = collection.items.length;

      const typeCountMap = new Map<string, number>();
      collection.items.forEach((item) => {
        const typeId = item.type.id;
        typeCountMap.set(typeId, (typeCountMap.get(typeId) || 0) + 1);
      });

      let dominantTypeColor: string | null = null;
      let maxCount = 0;

      collection.items.forEach((item) => {
        const currentCount = typeCountMap.get(item.type.id) || 0;
        if (currentCount > maxCount) {
          maxCount = currentCount;
          dominantTypeColor = item.type.color;
        }
      });

      const uniqueTypesMap = new Map<
        string,
        { id: string; name: string; icon: string; color: string }
      >();
      collection.items.forEach((item) => {
        if (
          !uniqueTypesMap.has(item.type.id) &&
          item.type.icon &&
          item.type.color
        ) {
          uniqueTypesMap.set(item.type.id, {
            id: item.type.id,
            name: item.type.name,
            icon: item.type.icon,
            color: item.type.color,
          });
        }
      });

      return {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        itemCount,
        dominantTypeColor,
        types: Array.from(uniqueTypesMap.values()),
        createdAt: collection.createdAt.toISOString(),
      };
    });

    return { success: true, data: collections };
  } catch (error) {
    console.error("Error fetching dashboard collections:", error);
    return { success: false, error: "Failed to fetch collections" };
  }
}

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  itemCount: number;
}

export type GetSidebarItemTypesResult =
  | { success: true; data: SidebarItemType[] }
  | { success: false; error: string };

export async function getSidebarItemTypes(
  userEmail: string,
): Promise<GetSidebarItemTypesResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return { success: true, data: [] };
    }

    const types = await prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
    });

    const itemCounts = await prisma.item.groupBy({
      by: ["typeId"],
      where: { userId: user.id },
      _count: { typeId: true },
    });

    const countMap = new Map(
      itemCounts.map((ic) => [ic.typeId, ic._count.typeId]),
    );

    return {
      success: true,
      data: types.map((t) => ({
        id: t.id,
        name: t.name,
        icon: t.icon,
        color: t.color,
        itemCount: countMap.get(t.id) || 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching sidebar item types:", error);
    return { success: false, error: "Failed to fetch item types" };
  }
}