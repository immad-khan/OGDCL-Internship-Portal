import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["todo", "in_progress", "review", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, taskId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
