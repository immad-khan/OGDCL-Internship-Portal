import { db } from "@/db";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const patch: Record<string, unknown> = {};
  if (body.title != null) patch.title = body.title;
  if (body.content != null) patch.content = body.content === "" ? null : body.content;
  if (body.status != null) patch.status = body.status;
  if ("rating" in body) patch.rating = body.rating == null ? null : Number(body.rating);
  if ("internId" in body)
    patch.internId = body.internId == null || body.internId === "" ? null : Number(body.internId);

  await db.update(reports).set(patch).where(eq(reports.id, Number(id)));
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(reports).where(eq(reports.id, Number(id)));
  return Response.json({ ok: true });
}
