import { db } from "@/db";
import { messages } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getConversations } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ conversations: await getConversations() });
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();
  const internId = Number(body.internId);
  const content = String(body.content ?? "").trim();
  const role = body.role === "intern" ? "intern" : "supervisor";
  if (!internId || !content) {
    return Response.json({ ok: false, error: "internId and content are required." }, { status: 400 });
  }
  const [created] = await db
    .insert(messages)
    .values({
      internId,
      senderName: String(body.senderName ?? (role === "supervisor" ? "Supervisor" : "")),
      role,
      content,
      read: role === "supervisor",
    })
    .returning();
  return Response.json({ ok: true, message: created }, { status: 201 });
}
