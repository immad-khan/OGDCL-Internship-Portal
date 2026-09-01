import { db } from "@/db";
import { interns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getInternById } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getInternById(Number(id));
  return Response.json(data);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const allowed: Array<[string, keyof typeof interns.$inferInsert]> = [
    ["name", "name"],
    ["email", "email"],
    ["phone", "phone"],
    ["department", "department"],
    ["university", "university"],
    ["degree", "degree"],
    ["cgpa", "cgpa"],
    ["startDate", "startDate"],
    ["endDate", "endDate"],
  ];
  const patch: Record<string, unknown> = {};
  for (const [src, dst] of allowed) {
    if (src in body) {
      const v = body[src];
      patch[dst] = typeof v === "string" && v.trim() === "" ? null : v;
    }
  }
  if (body.status) patch.status = body.status;
  await db.update(interns).set(patch).where(eq(interns.id, Number(id)));
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(interns).where(eq(interns.id, Number(id)));
  return Response.json({ ok: true });
}
