import { db } from "@/db";
import { tasks, interns } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const internId = Number(searchParams.get("internId") ?? 1);

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

  return Response.json({ tasks: rows });
}
