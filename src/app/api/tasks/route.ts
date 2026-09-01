import { db } from "@/db";
import { tasks } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

const optDate = (v?: string) => (v && v.trim() ? v : null);

export async function GET() {
  return Response.json({ tasks: await getTasks() });
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) {
    return Response.json({ ok: false, error: "Title is required." }, { status: 400 });
  }

  const internId = body.internId == null || body.internId === "" ? null : Number(body.internId);

  const [created] = await db
    .insert(tasks)
    .values({
      title,
      description: String(body.description ?? "").trim() || null,
      category: String(body.category ?? "").trim() || "General",
      priority: (body.priority as "low" | "medium" | "high" | "urgent") || "medium",
      status: (body.status as "todo" | "in_progress" | "review" | "completed") || "todo",
      dueDate: optDate(body.dueDate),
      internId,
    })
    .returning();

  return Response.json({ ok: true, task: created }, { status: 201 });
}
