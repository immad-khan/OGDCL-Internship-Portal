import { db } from "@/db";
import { tasks, interns } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const internId = Number(searchParams.get("internId") ?? 1);

  if (!Number.isInteger(internId) || internId < 1) {
    return Response.json({ error: "A valid internId is required" }, { status: 400 });
  }

  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      category: tasks.category,
      priority: tasks.priority,
      status: tasks.status,
      dueDate: tasks.dueDate,
      createdAt: tasks.createdAt,
    })
    .from(tasks)
    .where(eq(tasks.internId, internId))
    .orderBy(asc(tasks.dueDate));

  const statusLabels = {
    todo: "To do",
    in_progress: "In progress",
    review: "In review",
    completed: "Completed",
  } as const;

  return Response.json({
    tasks: rows.map((task) => ({ ...task, status: statusLabels[task.status] })),
  });
}
