import { NextResponse } from "next/server";
import { db, hasDatabase } from "@/db";
import { supervisors, interns } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasDatabase) {
    return NextResponse.json({ ok: false, error: "No database configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = body.role as "supervisor" | "intern";

    if (!email || !password || !["supervisor", "intern"].includes(role)) {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    if (role === "supervisor") {
      const [sup] = await db
        .select()
        .from(supervisors)
        .where(eq(supervisors.email, email))
        .limit(1);

      if (!sup) {
        return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
      }

      const passwordMatch = await bcrypt.compare(password, sup.passwordHash);
      if (!passwordMatch) {
        return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
      }

      await createSession({ userId: sup.id, role: "supervisor", email: sup.email, name: sup.name });
      return NextResponse.json({ ok: true, role: "supervisor" });

    } else {
      const [intern] = await db
        .select()
        .from(interns)
        .where(eq(interns.email, email))
        .limit(1);

      if (!intern) {
        return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
      }

      const passwordMatch = await bcrypt.compare(password, intern.passwordHash);
      if (!passwordMatch) {
        return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
      }

      await createSession({ userId: intern.id, role: "intern", email: intern.email, name: intern.name });
      return NextResponse.json({ ok: true, role: "intern" });
    }
  } catch (error) {
    console.error("[auth/login] Error:", error);
    return NextResponse.json({ ok: false, error: "Internal server error." }, { status: 500 });
  }
}
