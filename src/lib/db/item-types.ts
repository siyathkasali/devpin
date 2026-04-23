import { prisma } from "./index";

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  itemCount: number;
}

export async function getSidebarItemTypes(
  userEmail: string,
): Promise<SidebarItemType[]> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    return [];
  }

  // Fetch all system types
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" }, // Order alphabetically or any stable sort
  });

  // Fetch item counts for this user grouped by typeId
  const itemCounts = await prisma.item.groupBy({
    by: ["typeId"],
    where: { userId: user.id },
    _count: { typeId: true },
  });

  const countMap = new Map(
    itemCounts.map((ic) => [ic.typeId, ic._count.typeId]),
  );

  return types.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    itemCount: countMap.get(t.id) || 0,
  }));
}

export async function getSystemItemTypes() {
  return prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, icon: true, color: true },
  });
}

export type ItemTypeOption = {
  id: string;
  name: string;
  icon: string | null;
};
