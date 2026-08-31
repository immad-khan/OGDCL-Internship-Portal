import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getMessagesForIntern } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ internId: string }> }) {
  const { internId } = await params;
  const messagesList = await getMessagesForIntern(Number(internId));
  // Mark intern messages as read when the supervisor views the thread.
  await db
    .update(messages)
    .set({ read: true })
    .where(and(eq(messages.internId, Number(internId)), eq(messages.role, "intern")));
  return Response.json({ messages: messagesList });
}
