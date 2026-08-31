import { db } from "@/db";
import { supervisors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const [result] = await db.select().from(supervisors).limit(1);
  return Response.json(result ?? null);
}

export async function PATCH(request: Request) {
  await ensureSeeded();
  const body = await request.json();
  const allowed = ["name", "email", "designation", "department", "phone", "region"];
  const patch: Record<string, string> = {};
  for (const key of allowed) {
    if (typeof body[key] === "string") patch[key] = body[key] as string;
  }
  const [existing] = await db.select().from(supervisors).limit(1);
  if (!existing) {
    return Response.json({ ok: false }, { status: 404 });
  }
  await db.update(supervisors).set(patch).where(eq(supervisors.id, existing.id));
  return Response.json({ ok: true });
}
