"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks, users, type TaskStatus } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const allowed: TaskStatus[] = ["todo", "in_progress", "review", "done"];

export async function setTaskStatus(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "supervisor") return;

  const taskId = Number(formData.get("taskId"));
  const status = String(formData.get("status")) as TaskStatus;
  if (!Number.isFinite(taskId) || !allowed.includes(status)) return;

  await db
    .update(tasks)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.supervisorId, user.id)));

  revalidatePath("/supervisor");
  revalidatePath("/intern");
}

export async function createTask(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "supervisor") return;

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const internId = Number(formData.get("internId"));
  const dueDate = String(formData.get("dueDate") ?? "").trim();

  if (!title || !Number.isFinite(internId)) return;

  // Ensure the intern belongs to this supervisor.
  const [intern] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, internId), eq(users.supervisorId, user.id), eq(users.role, "intern")))
    .limit(1);
  if (!intern) return;

  await db.insert(tasks).values({
    title,
    description: description || null,
    internId,
    supervisorId: user.id,
    dueDate: dueDate || null,
    status: "todo",
  });

  revalidatePath("/supervisor");
  revalidatePath("/intern");
}
