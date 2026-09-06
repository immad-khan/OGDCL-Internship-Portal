"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskListRow } from "../_components";
import type { Task, TaskStatus } from "../_components";

export function TaskPage({ tasks, onUpdate, onTaskSelect }: { tasks: Task[]; onUpdate: (id: number, status: TaskStatus) => void; onTaskSelect: (task: Task) => void }) {
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");
  const filtered = filter === "All" ? tasks : tasks.filter((task) => task.status === filter);
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Personal workspace</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">My tasks</h1><p className="mt-2 text-[15px] text-[#6981a3]">Keep the next deliverable moving, one clear step at a time.</p></div>
      <button className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#0d9f99] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,159,153,0.2)] transition hover:-translate-y-0.5 hover:bg-[#078f8a]"><Plus className="h-4 w-4" /> Add personal task</button>
    </section>
    <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
      {(["All", "To do", "In progress", "In review", "Completed"] as const).map((option) => (
        <button key={option} onClick={() => setFilter(option)} className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${filter === option ? "bg-[#0d9f99] text-white shadow-sm" : "bg-white text-[#7187a6] ring-1 ring-[#e0e8f0] hover:bg-[#f5faf9]"}`}>{option}{option === "All" ? ` ${tasks.length}` : ""}</button>
      ))}
    </div>
    <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e0e8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
      <div className="hidden grid-cols-[minmax(220px,1.6fr)_1fr_120px_116px] gap-5 border-b border-[#e7edf4] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#91a3bd] md:grid"><p>Task</p><p>Due</p><p>Progress</p><p>Status</p></div>
      {filtered.map((task) => <TaskListRow key={task.id} task={task} onUpdate={onUpdate} onClick={() => onTaskSelect(task)} />)}
      {filtered.length === 0 && <div className="px-6 py-16 text-center text-sm text-[#7c91ab]">Nothing in this section right now.</div>}
    </div>
  </div>;
}