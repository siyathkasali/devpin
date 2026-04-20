import { prisma } from './index';

export interface SidebarUser {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
}

export async function getSidebarUser(email: string): Promise<SidebarUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      isPro: true,
    },
  });

  return user ? {
      id: user.id,
      name: user.name ?? "User",
      email: user.email,
      isPro: user.isPro,
    } : null;
}