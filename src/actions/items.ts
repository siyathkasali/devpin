"use server";

import { auth } from "@/src/auth";
import { updateItem, updateItemSchema, type UpdateItemData } from "@/src/lib/db/items";
import { revalidatePath } from "next/cache";

export type UpdateItemResult =
  | { success: true; data: Awaited<ReturnType<typeof updateItem>> extends infer R ? R extends { success: true; data: infer D } ? D : never : never }
  | { success: false; error: string };

export async function updateItemAction(
  itemId: string,
  data: UpdateItemData
): Promise<UpdateItemResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const validationResult = updateItemSchema.safeParse(data);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    const result = await updateItem(session.user.email, itemId, validationResult.data);

    if (!result.success) {
      return result;
    }

    revalidatePath("/");

    return result;
  } catch (error) {
    console.error("Error in updateItemAction:", error);
    return { success: false, error: "Failed to update item" };
  }
}
