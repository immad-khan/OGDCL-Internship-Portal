import { db, hasDatabase } from "@/db";
import { interns, supervisors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { getInterns } from "@/lib/data";
import { sendInternWelcomeEmail, generateInternPassword } from "@/lib/email";
import bcrypt from "bcryptjs";

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

  // 1. Generate a readable random password and hash it
  const plainPassword = generateInternPassword();
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  // 2. Look up the supervisor to attach
  const [sup] = await db.select().from(supervisors).limit(1);

  // 3. Insert the intern row
  const [created] = await db
    .insert(interns)
    .values({
      name,
      email,
      passwordHash,
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

  // 4. Send credentials email — on failure roll back the insert
  try {
    await sendInternWelcomeEmail(email, name, plainPassword);
  } catch (err) {
    console.error("[email] Failed to send welcome email, rolling back intern insert:", err);

    // Rollback: delete the just-created row
    await db.delete(interns).where(eq(interns.id, created.id));

    return Response.json(
      {
        ok: false,
        error:
          "Account created but the credential email could not be delivered. " +
          "Please check the email address and try again.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, intern: created }, { status: 201 });
}
