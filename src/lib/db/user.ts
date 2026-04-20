import { prisma } from "./index";

export interface SidebarUser {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
}

export type GetSidebarUserResult =
  | { success: true; data: SidebarUser | null }
  | { success: false; error: string };

export async function getSidebarUser(
  email: string,
): Promise<GetSidebarUserResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        isPro: true,
      },
    });

    if (!user) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name ?? "User",
        email: user.email,
        isPro: user.isPro,
      },
    };
  } catch (error) {
    console.error("Error fetching sidebar user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}