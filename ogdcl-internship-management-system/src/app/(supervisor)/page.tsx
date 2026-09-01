import Link from "next/link";
import { getDashboardData, getSupervisor } from "@/lib/data";
import { cn, formatDate, timeAgo, isOverdue } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import {
  InternStatusBadge,
  PriorityBadge,
} from "@/components/badge";
import {
  IconUsers,
  IconTasks,
  IconFile,
  IconMessage,
  IconPlus,
  IconTrend,
  IconCalendar,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  todo: "#94a3b8",
  in_progress: "#2b7cb8",
  review: "#f59e0b",
  completed: "#10b981",
};
const STATUS_LABEL: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
};
const PRI_COLOR: Record<string, string> = {
  low: "#94a3b8",
  medium: "#0ea5e9",
  high: "#f59e0b",
  urgent: "#f43f5e",
};

function StatCard({
  label,
  value,
  icon,
  iconClass,
  delta,
  deltaClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  delta: string;
  deltaClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconClass)}>
          {icon}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
            deltaClass,
          )}
        >
          <IconTrend className="h-3 w-3" />
          {delta}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const sup = await getSupervisor();

  const statuses = ["todo", "in_progress", "review", "completed"];
  const totalTasks = data.totalTasks || 1;
  let acc = 0;
  const gradientStops = statuses
    .map((s) => {
      const pct = ((data.taskByStatus[s] ?? 0) / totalTasks) * 100;
      const start = acc;
      acc += pct;
      return `${STATUS_COLOR[s]} ${start}% ${acc}%`;
    })
    .join(", ");

  const weeklyMax = Math.max(1, ...data.weekly.map((w) => w.count));

  const today = new Date();
  const todayStr = `${today.toLocaleDateString("en-GB", {
    weekday: "long",
  })}, ${today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

  const cols = [
    { status: "todo", label: "To Do" },
    { status: "in_progress", label: "In Progress" },
    { status: "review", label: "Review" },
    { status: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white shadow-[var(--shadow-pop)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/80">{todayStr}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Assalam-o-Alaikum, {sup?.name?.replace("Engr. ", "")} 👋
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Here&apos;s what&apos;s happening with your interns today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/supervisor/tasks"
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/25"
          >
            <IconPlus className="h-4 w-4" /> New Task
          </Link>
          <Link
            href="/supervisor/interns?new=1"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            <IconPlus className="h-4 w-4" /> Add Intern
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Interns"
          value={data.totalInterns}
          icon={<IconUsers className="h-5 w-5" />}
          iconClass="bg-brand-50 text-brand-600"
          delta="+2 this month"
          deltaClass="bg-brand-50 text-brand-700"
        />
        <StatCard
          label="Active Tasks"
          value={data.totalTasks}
          icon={<IconTasks className="h-5 w-5" />}
          iconClass="bg-energy-50 text-energy-600"
          delta={`${data.taskByStatus.in_progress ?? 0} in progress`}
          deltaClass="bg-energy-50 text-energy-700"
        />
        <StatCard
          label="Reports to Review"
          value={data.pendingReports}
          icon={<IconFile className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-600"
          delta="awaiting"
          deltaClass="bg-amber-50 text-amber-700"
        />
        <StatCard
          label="Unread Messages"
          value={data.unreadMessages}
          icon={<IconMessage className="h-5 w-5" />}
          iconClass="bg-rose-50 text-rose-600"
          delta="from interns"
          deltaClass="bg-rose-50 text-rose-700"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Weekly Activity</h3>
              <p className="text-sm text-slate-400">Tasks &amp; messages this week</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> {data.totalTasks} tasks
            </span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3">
            {data.weekly.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">{w.count || ""}</span>
                <div
                  className={cn(
                    "w-full max-w-10 rounded-t-lg transition-all",
                    i === data.weekly.length - 1 ? "bg-brand-500" : "bg-brand-100",
                  )}
                  style={{ height: `${Math.max(8, Math.round((w.count / weeklyMax) * 132))}px` }}
                />
                <span className="text-[11px] text-slate-400">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion donut */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-slate-800">Task Completion</h3>
          <div className="relative mx-auto mt-4 h-40 w-40">
            <div
              className="h-full w-full rounded-full"
              style={{ background: `conic-gradient(${gradientStops})` }}
            />
            <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white">
              <span className="text-3xl font-semibold text-slate-900">{data.completionRate}%</span>
              <span className="text-xs text-slate-400">done</span>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {cols.map((c) => {
              const val = data.taskByStatus[c.status] ?? 0;
              return (
                <div key={c.status} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: STATUS_COLOR[c.status] }}
                  />
                  <span className="flex-1 text-slate-500">{c.label}</span>
                  <span className="font-semibold text-slate-700">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Messages + upcoming tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent messages */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-800">Recent Messages</h3>
            <Link href="/supervisor/messages" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentMessages.map((m) => (
              <Link
                key={m.id}
                href={`/supervisor/messages?id=${m.internId}`}
                className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50"
              >
                <Avatar name={m.internName ?? "?"} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {m.role === "supervisor" ? "You" : m.internName}
                    </p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                      {m.role}
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-500">{m.content}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{timeAgo(m.createdAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-800">Upcoming Tasks</h3>
            <Link href="/supervisor/tasks" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.upcomingTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    isOverdue(t.dueDate)
                      ? "bg-rose-50 text-rose-500"
                      : "bg-slate-100 text-brand-600",
                  )}
                >
                  <IconCalendar className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{t.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="truncate">{t.internName}</span>
                    <span>·</span>
                    <span className={isOverdue(t.dueDate) ? "font-medium text-rose-500" : ""}>
                      {formatDate(t.dueDate)}
                    </span>
                  </div>
                </div>
                <PriorityBadge value={t.priority} />
              </div>
            ))}
            {data.upcomingTasks.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No upcoming tasks.</p>
            )}
          </div>
        </div>
      </div>

      {/* Tasks by priority + recent interns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-slate-800">Tasks by Priority</h3>
          <div className="mt-5 space-y-4">
            {Object.entries(PRI_COLOR).map(([key, color]) => {
              const val = data.taskByPriority[key] ?? 0;
              const pct = totalTasks ? Math.round((val / totalTasks) * 100) : 0;
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-500">{key}</span>
                    <span className="font-semibold text-slate-700">{val}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-800">Recent Interns</h3>
            <Link href="/supervisor/interns" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.recentInterns.map((i) => (
              <Link
                key={i.id}
                href={`/supervisor/interns/${i.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <Avatar name={i.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{i.name}</p>
                  <p className="truncate text-xs text-slate-400">{i.department}</p>
                  <div className="mt-1">
                    <InternStatusBadge value={i.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
