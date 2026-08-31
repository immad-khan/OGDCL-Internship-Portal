import { db } from "@/db";
import { reports } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getReports } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ reports: await getReports() });
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
    .insert(reports)
    .values({
      title,
      content: String(body.content ?? "").trim() || null,
      internId,
      status: (body.status as "draft" | "submitted" | "approved" | "rejected") || "draft",
      rating: body.rating == null ? null : Number(body.rating),
    })
    .returning();

  return Response.json({ ok: true, report: created }, { status: 201 });
}
