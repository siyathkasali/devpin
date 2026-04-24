"use server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/db";
import { checkCollectionLimit } from "@/src/lib/usage-limits";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().nullable().optional(),
});

export type CreateCollectionData = z.infer<typeof createCollectionSchema>;

export type CreateCollectionActionResult =
  | { success: true; data: { id: string; name: string } }
  | { success: false; error: string };

export async function createCollectionAction(
  data: CreateCollectionData
): Promise<CreateCollectionActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check collection limit for free users
    const limitCheck = await checkCollectionLimit(user.id);
    if (!limitCheck.allowed) {
      return { success: false, error: `Free tier limit reached (${limitCheck.current}/${limitCheck.limit} collections). Upgrade to Pro for unlimited.` };
    }

    const validationResult = createCollectionSchema.safeParse(data);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    const collection = await prisma.collection.create({
      data: {
        name: validationResult.data.name,
        description: validationResult.data.description ?? null,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath("/");

    return { success: true, data: collection };
  } catch (error) {
    console.error("Error in createCollectionAction:", error);
    return { success: false, error: "Failed to create collection" };
  }
}

export type DeleteCollectionActionResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteCollectionAction(
  collectionId: string,
): Promise<DeleteCollectionActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const existingCollection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId: user.id,
      },
    });

    if (!existingCollection) {
      return { success: false, error: "Collection not found" };
    }

    await prisma.collection.delete({
      where: { id: collectionId },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteCollectionAction:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}