import { db } from "@/db";
import { messages, interns, supervisors } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const internId = Number(searchParams.get("internId") ?? 1);

  // Mark supervisor messages as read when intern opens chat
  await db
    .update(messages)
    .set({ read: true })
    .where(and(eq(messages.internId, internId), eq(messages.role, "supervisor")));

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.internId, internId))
    .orderBy(asc(messages.createdAt));

  const [intern] = await db
    .select({ name: interns.name, supervisorId: interns.supervisorId })
    .from(interns)
    .where(eq(interns.id, internId))
    .limit(1);
  const [sup] = intern?.supervisorId
    ? await db.select({ name: supervisors.name }).from(supervisors).where(eq(supervisors.id, intern.supervisorId)).limit(1)
    : [];

  return Response.json({ messages: rows, supervisorName: sup?.name ?? "Supervisor", internName: intern?.name ?? "Intern" });
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();
  const internId = Number(body.internId ?? 1);
  const content = String(body.content ?? "").trim();
  if (!Number.isInteger(internId) || internId < 1 || !content || content.length > 4000) {
    return Response.json({ ok: false, error: "Provide a valid intern and message under 4,000 characters." }, { status: 400 });
  }

  const [intern] = await db.select({ name: interns.name }).from(interns).where(eq(interns.id, internId)).limit(1);

  const [created] = await db
    .insert(messages)
    .values({
      internId,
      senderName: intern?.name ?? "Intern",
      role: "intern",
      content,
      read: false,
    })
    .returning();

  return Response.json({ ok: true, message: created }, { status: 201 });
}
