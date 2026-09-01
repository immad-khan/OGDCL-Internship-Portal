"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn, formatDate, isOverdue, timeAgo } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { PriorityBadge, TaskStatusBadge } from "@/components/badge";
import { Modal } from "@/components/modal";
import { IconPlus, IconSearch, IconCalendar } from "@/components/icons";

type Task = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  dueDate: string | null;
  createdAt: string | Date;
  internId: number | null;
  internName: string | null;
  internDepartment: string | null;
};

type Intern = { id: number; name: string; department: string };

const STATUS_ORDER = ["todo", "in_progress", "review", "completed"] as const;
const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  todo: { label: "To Do", color: "text-slate-600 bg-slate-100 ring-slate-200", dot: "bg-slate-400" },
  in_progress: { label: "In Progress", color: "text-energy-700 bg-energy-50 ring-energy-200", dot: "bg-energy-500" },
  review: { label: "Review", color: "text-amber-700 bg-amber-50 ring-amber-200", dot: "bg-amber-500" },
  completed: { label: "Completed", color: "text-emerald-700 bg-emerald-50 ring-emerald-200", dot: "bg-emerald-500" },
};
const PRIORITIES = ["low", "medium", "high", "urgent"];
const CATEGORIES = ["General", "Wellsite Analysis", "Reporting", "Geology", "Process", "HSE", "Maintenance", "Design", "Electrical", "IT", "Finance"];

type FormState = {
  title: string;
  description: string;
  category: string;
  internId: string;
  priority: string;
  status: string;
  dueDate: string;
};
const emptyForm: FormState = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  internId: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function TasksBoard({ tasks, interns }: { tasks: Task[]; interns: Intern[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Task[]>(tasks);
  const [query, setQuery] = useState("");
  const [internFilter, setInternFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [view, setView] = useState<"board" | "list">("board");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setItems(tasks), [tasks]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(
    () =>
      items.filter((t) => {
        const q = query.trim().toLowerCase();
        const matchQ = !q || t.title.toLowerCase().includes(q) || (t.internName ?? "").toLowerCase().includes(q);
        const matchI = internFilter === "all" || t.internId === Number(internFilter);
        const matchP = priorityFilter === "all" || t.priority === priorityFilter;
        return matchQ && matchI && matchP;
      }),
    [items, query, internFilter, priorityFilter],
  );

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, internId: interns[0] ? String(interns[0].id) : "" });
    setModalOpen(true);
  }
  function openEdit(t: Task) {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? "",
      category: t.category,
      internId: t.internId ? String(t.internId) : "",
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate ?? "",
    });
    setModalOpen(true);
  }

  async function move(taskId: number, status: string) {
    setItems((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setToast("Could not update status.");
    }
  }

  async function save() {
    if (!form.title.trim()) {
      setToast("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing;
      const url = isEdit ? `/api/tasks/${editing.id}` : "/api/tasks";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, internId: form.internId ? Number(form.internId) : null }),
      });
      if (!res.ok) throw new Error();
      setToast(isEdit ? "Task updated." : "Task created.");
      setModalOpen(false);
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleting) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast("Task deleted.");
      setDeleting(null);
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const Card = ({ t }: { t: Task }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {t.category}
        </span>
        <select
          value={t.status}
          onChange={(e) => move(t.id, e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500 outline-none focus:border-brand-400"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-800">{t.title}</p>
      {t.description && <p className="mt-1 line-clamp-2 text-xs text-slate-400">{t.description}</p>}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {t.internName ? (
            <>
              <Avatar name={t.internName} size="xs" ring={false} />
              <span className="text-xs text-slate-500">{t.internName.split(" ")[0]}</span>
            </>
          ) : (
            <span className="text-xs text-slate-300">Unassigned</span>
          )}
        </div>
        <PriorityBadge value={t.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <span
          className={cn(
            "flex items-center gap-1 text-[11px]",
            isOverdue(t.dueDate) && t.status !== "completed" ? "font-medium text-rose-500" : "text-slate-400",
          )}
        >
          <IconCalendar className="h-3.5 w-3.5" /> {formatDate(t.dueDate)}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => openEdit(t)}
            className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleting(t)}
            className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-500 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Task Board</h2>
          <p className="text-sm text-slate-500">Assign and track intern deliverables across stages.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconPlus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks or interns..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={internFilter}
          onChange={(e) => setInternFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-brand-300"
        >
          <option value="all">All interns</option>
          {interns.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-brand-300"
        >
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="flex rounded-xl border border-slate-200 p-1">
          {(["board", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition",
                view === v ? "bg-brand-50 text-brand-700" : "text-slate-500",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUS_ORDER.map((status) => {
            const colTasks = filtered.filter((t) => t.status === status);
            return (
              <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center gap-2 px-1.5 pb-3">
                  <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_META[status].dot)} />
                  <h3 className="text-sm font-semibold text-slate-700">{STATUS_META[status].label}</h3>
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.map((t) => (
                    <Card key={t.id} t={t} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white/50 py-8 text-center text-xs text-slate-400">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Task</th>
                  <th className="px-5 py-3 font-semibold">Intern</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Due</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-800">{t.title}</p>
                      <p className="text-xs text-slate-400">{t.category}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <Avatar name={t.internName ?? "?"} size="sm" ring={false} />
                        <span className="text-slate-600">{t.internName ?? "—"}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <TaskStatusBadge value={t.status} />
                    </td>
                    <td className="px-5 py-3">
                      <PriorityBadge value={t.priority} />
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(t.dueDate)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(t)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Task" : "New Task"}
        description="Assign a deliverable to an intern."
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create task"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Task title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Analyze wellbore pressure data"
              className={inputCls}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Add details about the deliverable..."
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Assignee</span>
              <select
                value={form.internId}
                onChange={(e) => setForm({ ...form, internId: e.target.value })}
                className={inputCls}
              >
                <option value="">Unassigned</option>
                {interns.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Priority</span>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className={inputCls}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Due date</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete task?"
        description="This action cannot be undone."
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleting(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={remove}
              disabled={saving}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              {saving ? "Deleting..." : "Delete task"}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Delete <span className="font-semibold text-slate-900">“{deleting?.title}”</span>?
        </p>
      </Modal>
    </div>
  );
}
