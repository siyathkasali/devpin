import { prisma } from './index';

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

export async function getDashboardCollections(email: string): Promise<DashboardCollection[]> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      collections: {
        orderBy: {
          updatedAt: 'desc',
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
    return [];
  }

  // Transform to the clean dashboard format
  return user.collections.map((collection) => {
    // 1. Calculate items count
    const itemCount = collection.items.length;

    // 2. Tally item type counts to compute the dominant type
    const typeCountMap = new Map<string, number>();
    collection.items.forEach((item) => {
      const typeId = item.type.id;
      typeCountMap.set(typeId, (typeCountMap.get(typeId) || 0) + 1);
    });

    // 3. Find dominant type logic
    let dominantTypeColor: string | null = null;
    let maxCount = 0;
    
    collection.items.forEach((item) => {
      const currentCount = typeCountMap.get(item.type.id) || 0;
      if (currentCount > maxCount) {
        maxCount = currentCount;
        dominantTypeColor = item.type.color;
      }
    });

    // 4. Extract unique types for tiny icon rendering
    const uniqueTypesMap = new Map<string, { id: string; name: string; icon: string; color: string }>();
    collection.items.forEach((item) => {
      if (!uniqueTypesMap.has(item.type.id) && item.type.icon && item.type.color) {
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
}
