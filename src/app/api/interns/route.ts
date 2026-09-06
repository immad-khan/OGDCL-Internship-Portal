import { db, hasDatabase } from "@/db";
import { interns, supervisors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded, DEFAULT_PASSWORD_HASH } from "@/lib/seed";
import { getInterns } from "@/lib/data";

export const dynamic = "force-dynamic";

const optDate = (v?: string) => (v && v.trim() ? v : null);

export async function GET() {
  return Response.json({ interns: await getInterns() });
}

export async function POST(request: Request) {
  if (!hasDatabase) {
    return Response.json({ ok: false, error: "No database configured." }, { status: 503 });
  }
  await ensureSeeded();
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  if (!name || !email) {
    return Response.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const [sup] = await db.select().from(supervisors).limit(1);

  const [created] = await db
    .insert(interns)
    .values({
      name,
      email,
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: String(body.phone ?? "").trim() || null,
      department: String(body.department ?? "").trim() || "General",
      university: String(body.university ?? "").trim() || null,
      degree: String(body.degree ?? "").trim() || null,
      cgpa: String(body.cgpa ?? "").trim() || null,
      startDate: optDate(body.startDate),
      endDate: optDate(body.endDate),
      status: (body.status as "active" | "on_hold" | "completed" | "pending") || "active",
      supervisorId: sup?.id ?? null,
    })
    .returning();

  return Response.json({ ok: true, intern: created }, { status: 201 });
}
