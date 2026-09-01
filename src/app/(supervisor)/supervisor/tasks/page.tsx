import { getTasks, getInterns } from "@/lib/data";
import { TasksBoard } from "@/components/tasks/tasks-board";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, interns] = await Promise.all([getTasks(), getInterns()]);
  return (
    <div className="space-y-6">
      <TasksBoard tasks={tasks} interns={interns} />
    </div>
  );
}
