import { getInterns, getInternById } from "@/lib/data";
import { InternClient } from "./intern-client";
import { formatDate } from "@/lib/utils";

// Define the Task format expected by InternClient
type TaskStatus = "To do" | "In progress" | "In review" | "Completed";
type Priority = "High" | "Medium" | "Low";

export const dynamic = "force-dynamic";

export default async function InternPage() {
  // We don't have proper auth, so we just pick the most recently created intern.
  const interns = await getInterns();
  const currentIntern = interns[0];

  if (!currentIntern) {
    return <div className="p-10 text-center text-lg font-medium text-slate-500">No intern found in database.</div>;
  }

  const details = await getInternById(currentIntern.id);
  const dbTasks = details?.tasks || [];

  // Map DB tasks to the frontend Task format
  const mappedTasks = dbTasks.map(t => {
    let status: TaskStatus = "To do";
    let progress = 0;
    if (t.status === "in_progress") { status = "In progress"; progress = 50; }
    if (t.status === "review") { status = "In review"; progress = 80; }
    if (t.status === "completed") { status = "Completed"; progress = 100; }

    let priority: Priority = "Medium";
    if (t.priority === "high" || t.priority === "urgent") priority = "High";
    if (t.priority === "low") priority = "Low";

    return {
      id: t.id,
      title: t.title,
      project: t.category || "General",
      due: formatDate(t.dueDate),
      dueMeta: "Due date",
      status,
      priority,
      progress
    };
  });

  // Calculate initials
  const parts = currentIntern.name.split(" ");
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];

  return (
    <InternClient 
      internId={currentIntern.id}
      initialTasks={mappedTasks} 
      internName={currentIntern.name}
      internDepartment={currentIntern.department}
      internInitials={initials.toUpperCase()}
    />
  );
}