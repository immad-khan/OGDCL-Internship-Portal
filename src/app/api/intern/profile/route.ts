import { db } from "@/db";
import { interns, supervisors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const internId = Number(searchParams.get("internId") ?? 1);

  if (!Number.isInteger(internId) || internId < 1) {
    return Response.json({ ok: false, error: "A valid internId is required" }, { status: 400 });
  }
  const [intern] = await db.select().from(interns).where(eq(interns.id, internId)).limit(1);
  const [sup] = intern?.supervisorId
    ? await db
        .select({ name: supervisors.name, designation: supervisors.designation })
        .from(supervisors)
        .where(eq(supervisors.id, intern.supervisorId))
        .limit(1)
    : [];

  if (!intern) return Response.json({ ok: false, error: "Intern not found" }, { status: 404 });

  return Response.json({
    intern: {
      id: intern.id,
      name: intern.name,
      department: intern.department,
      email: intern.email,
      startDate: intern.startDate,
      endDate: intern.endDate,
    },
    supervisor: sup ?? { name: "Supervisor", designation: "Internship Supervisor" },
  });
}
