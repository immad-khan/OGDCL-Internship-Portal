"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function updateMyTaskStatus(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "intern") return;

  const taskId = Number(formData.get("taskId"));
  const next = String(formData.get("status"));
  if (!Number.isFinite(taskId)) return;
  if (next !== "in_progress" && next !== "review") return;

  await db
    .update(tasks)
    .set({ status: next, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.internId, user.id)));

  revalidatePath("/intern");
}
