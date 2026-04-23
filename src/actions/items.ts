"use server";

import { auth } from "@/src/auth";
import { createItem, createItemSchema, deleteItem, updateItem, updateItemSchema, type CreateItemData, type UpdateItemData } from "@/src/lib/db/items";
import { getSystemItemTypes } from "@/src/lib/db/item-types";
import { revalidatePath } from "next/cache";

export async function getItemTypesAction() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const types = await getSystemItemTypes();
    return { success: true, data: types };
  } catch (error) {
    console.error("Error in getItemTypesAction:", error);
    return { success: false, error: "Failed to get item types" };
  }
}

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

export type CreateItemActionResult =
  | { success: true; data: Awaited<ReturnType<typeof createItem>> extends infer R ? R extends { success: true; data: infer D } ? D : never : never }
  | { success: false; error: string };

export async function createItemAction(
  data: CreateItemData
): Promise<CreateItemActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const validationResult = createItemSchema.safeParse(data);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    const result = await createItem(session.user.email, validationResult.data);

    if (!result.success) {
      return result;
    }

    revalidatePath("/");

    return result;
  } catch (error) {
    console.error("Error in createItemAction:", error);
    return { success: false, error: "Failed to create item" };
  }
}

export type DeleteItemActionResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteItemAction(
  itemId: string,
): Promise<DeleteItemActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await deleteItem(session.user.email, itemId);

    if (!result.success) {
      return result;
    }

    revalidatePath("/");

    return result;
  } catch (error) {
    console.error("Error in deleteItemAction:", error);
    return { success: false, error: "Failed to delete item" };
  }
}
