import Link from "next/link";
import { notFound } from "next/navigation";
import { getInternById } from "@/lib/data";
import { formatDate, timeAgo, isOverdue, cn } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import {
  InternStatusBadge,
  TaskStatusBadge,
  PriorityBadge,
  ReportStatusBadge,
} from "@/components/badge";
import {
  IconChevronLeft,
  IconMail,
  IconBuilding,
  IconStudy,
  IconCalendar,
  IconTasks,
  IconFile,
  IconMessage,
  IconTrend,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function InternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getInternById(Number(id));
  if (!data) notFound();
  const { intern, tasks, messages, reports } = data;

  const completed = tasks.filter((t) => t.status === "completed").length;

  const stats = [
    { label: "Total Tasks", value: tasks.length, icon: IconTasks, cls: "text-brand-600 bg-brand-50" },
    { label: "Completed", value: completed, icon: IconTrend, cls: "text-emerald-600 bg-emerald-50" },
    { label: "Reports", value: reports.length, icon: IconFile, cls: "text-energy-600 bg-energy-50" },
    { label: "Messages", value: messages.length, icon: IconMessage, cls: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/interns"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-700"
      >
        <IconChevronLeft className="h-4 w-4" /> Back to interns
      </Link>

      {/* Profile header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="h-24 bg-gradient-to-r from-brand-500 to-energy-500" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar name={intern.name} size="2xl" ring={false} className="ring-4 ring-white" />
              <div className="pb-1">
                <h2 className="text-2xl font-semibold text-slate-900">{intern.name}</h2>
                <p className="flex items-center gap-1 text-sm text-slate-400">
                  <IconMail className="h-4 w-4" /> {intern.email}
                </p>
              </div>
            </div>
            <div className="pb-1">
              <InternStatusBadge value={intern.status} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <IconBuilding className="h-5 w-5 text-brand-500" />
              <div>
                <p className="text-xs text-slate-400">Department</p>
                <p className="text-sm font-semibold text-slate-700">{intern.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <IconStudy className="h-5 w-5 text-energy-500" />
              <div>
                <p className="text-xs text-slate-400">University</p>
                <p className="text-sm font-semibold text-slate-700">{intern.university || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <IconCalendar className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs text-slate-400">Tenure</p>
                <p className="text-sm font-semibold text-slate-700">
                  {formatDate(intern.startDate)} — {formatDate(intern.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <IconTrend className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-400">CGPA</p>
                <p className="text-sm font-semibold text-slate-700">{intern.cgpa || "—"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {intern.degree || "Degree not specified"} · Joined {formatDate(intern.createdAt)}
            </p>
            <Link
              href={`/messages?id=${intern.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <IconMessage className="h-4 w-4" /> Message
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
            <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-lg", s.cls)}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tasks */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-800">Assigned Tasks</h3>
            <Link href="/tasks" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Open board
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {tasks.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No tasks assigned yet.</p>
            )}
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    t.status === "completed"
                      ? "bg-emerald-500"
                      : t.status === "review"
                        ? "bg-amber-500"
                        : t.status === "in_progress"
                          ? "bg-energy-500"
                          : "bg-slate-300",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-400">
                    {t.category} · due {formatDate(t.dueDate)}
                    {isOverdue(t.dueDate) && t.status !== "completed" ? " · overdue" : ""}
                  </p>
                </div>
                <PriorityBadge value={t.priority} />
                <TaskStatusBadge value={t.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Reports + messages */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-semibold text-slate-800">Reports</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {reports.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-400">No reports yet.</p>
              )}
              {reports.map((r) => (
                <div key={r.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{r.title}</p>
                    <ReportStatusBadge value={r.status} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{r.content}</p>
                  <p className="mt-1 text-[11px] text-slate-300">{timeAgo(r.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-semibold text-slate-800">Recent Chat</h3>
            </div>
            <div className="space-y-3 p-5">
              {messages.slice(-4).map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm",
                    m.role === "supervisor"
                      ? "ml-auto rounded-br-sm bg-brand-600 text-white"
                      : "mr-auto rounded-bl-sm bg-slate-100 text-slate-700",
                  )}
                >
                  <p>{m.content}</p>
                  <p className={cn("mt-1 text-[10px]", m.role === "supervisor" ? "text-white/70" : "text-slate-400")}>
                    {timeAgo(m.createdAt)}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">No messages yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
