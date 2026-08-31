import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const patch: Record<string, unknown> = {};
  if (body.title != null) patch.title = body.title;
  if (body.description != null)
    patch.description = body.description === "" ? null : body.description;
  if (body.category != null) patch.category = body.category;
  if (body.priority != null) patch.priority = body.priority;
  if (body.status != null) patch.status = body.status;
  if (body.dueDate != null) patch.dueDate = body.dueDate === "" ? null : body.dueDate;
  if ("internId" in body) patch.internId = body.internId == null || body.internId === "" ? null : Number(body.internId);

  await db.update(tasks).set(patch).where(eq(tasks.id, Number(id)));
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(tasks).where(eq(tasks.id, Number(id)));
  return Response.json({ ok: true });
}
