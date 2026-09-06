import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import { AppShell, StatusBadge, formatDate, initials } from "@/components/app-shell";
import {
  BarChart,
  ClipboardCheck,
  FileText,
  Grid,
  ShieldCheck,
  Users,
} from "@/components/icons";
import { createTask, setTaskStatus } from "./actions";

export const metadata: Metadata = { title: "Supervisor dashboard" };
export const dynamic = "force-dynamic";

export default async function SupervisorDashboard() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) redirect("/login?role=supervisor");
  if (user.role !== "supervisor") redirect("/intern");

  const [interns, allTasks] = await Promise.all([
    db.select().from(users).where(eq(users.supervisorId, user.id)).orderBy(asc(users.name)),
    db.select().from(tasks).where(eq(tasks.supervisorId, user.id)).orderBy(asc(tasks.dueDate)),
  ]);

  const internById = new Map(interns.map((i) => [i.id, i]));
  const active = allTasks.filter((t) => t.status !== "done");
  const awaitingReview = allTasks.filter((t) => t.status === "review");
  const doneCount = allTasks.filter((t) => t.status === "done").length;
  const completion = allTasks.length ? Math.round((doneCount / allTasks.length) * 100) : 0;

  const counts = {
    todo: allTasks.filter((t) => t.status === "todo").length,
    in_progress: allTasks.filter((t) => t.status === "in_progress").length,
    review: awaitingReview.length,
    done: doneCount,
  };

  const nav = [
    {
      heading: "Overview",
      items: [
        { href: "/supervisor", label: "Dashboard", icon: <Grid className="h-5 w-5" /> },
        { href: "/supervisor#interns", label: "Interns", icon: <Users className="h-5 w-5" />, badge: interns.length },
        { href: "/supervisor#tasks", label: "Tasks", icon: <ClipboardCheck className="h-5 w-5" />, badge: active.length },
      ],
    },
    {
      heading: "Management",
      items: [
        { href: "/supervisor#review", label: "Pending review", icon: <FileText className="h-5 w-5" />, badge: awaitingReview.length },
        { href: "/supervisor#new-task", label: "Assign task", icon: <BarChart className="h-5 w-5" /> },
      ],
    },
    {
      heading: "Account",
      items: [{ href: "/supervisor#account", label: "Profile", icon: <ShieldCheck className="h-5 w-5" /> }],
    },
  ];

  const stats = [
    { label: "Interns supervised", value: interns.length, hint: `${user.department ?? "Department"}` },
    { label: "Active tasks", value: active.length, hint: `${counts.in_progress} in progress` },
    { label: "Awaiting review", value: awaitingReview.length, hint: "Submitted by interns" },
    { label: "Overall completion", value: `${completion}%`, hint: `${doneCount} of ${allTasks.length} tasks` },
  ];

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AppShell user={user} title="Dashboard" subtitle="Supervisor portal" nav={nav} activeHref="/supervisor">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header band */}
        <section className="rounded-md bg-navy-950 px-7 py-7 text-white">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="m-0 text-[13px] text-navy-300">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-1 text-[26px] font-semibold tracking-tight">
                Welcome, {user.name}
              </h2>
              <p className="mt-1 text-[14.5px] text-navy-200">
                {user.designation} · {user.department}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="#new-task"
                className="inline-flex h-11 items-center rounded bg-brand-500 px-5 text-[14px] font-semibold text-white hover:bg-brand-400"
              >
                Assign task
              </a>
              <a
                href="#review"
                className="inline-flex h-11 items-center rounded border border-white/30 px-5 text-[14px] font-semibold text-white hover:bg-white/10"
              >
                Review submissions
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-md border border-navy-100 bg-white p-5">
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-500">
                {s.label}
              </p>
              <p className="m-0 mt-2 text-[32px] font-semibold leading-none text-navy-900">{s.value}</p>
              <p className="m-0 mt-2 text-[13px] text-navy-500">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Interns */}
          <section id="interns" className="rounded-md border border-navy-100 bg-white xl:col-span-2">
            <div className="border-b border-navy-100 px-6 py-4">
              <h3 className="text-[16px] font-semibold text-navy-900">Interns under supervision</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-navy-50 text-[12px] uppercase tracking-wider text-navy-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Intern</th>
                    <th className="px-4 py-3 font-semibold">Institution</th>
                    <th className="px-4 py-3 font-semibold">Period</th>
                    <th className="px-4 py-3 font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {interns.map((i) => {
                    const mine = allTasks.filter((t) => t.internId === i.id);
                    const d = mine.filter((t) => t.status === "done").length;
                    const p = mine.length ? Math.round((d / mine.length) * 100) : 0;
                    return (
                      <tr key={i.id}>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-800 ring-1 ring-brand-100">
                              {initials(i.name)}
                            </span>
                            <div>
                              <p className="m-0 font-semibold text-navy-900">{i.name}</p>
                              <p className="m-0 text-[12px] text-navy-500">{i.employeeNo}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-navy-700">{i.institution ?? "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-navy-700">
                          {formatDate(i.startDate)} – {formatDate(i.endDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-28 overflow-hidden rounded-full bg-navy-100">
                              <div className="h-full bg-brand-600" style={{ width: `${p}%` }} />
                            </div>
                            <span className="text-[13px] font-semibold text-navy-800">{p}%</span>
                            <span className="text-[12px] text-navy-500">
                              {d}/{mine.length}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Completion */}
          <section className="rounded-md border border-navy-100 bg-white p-6">
            <h3 className="text-[16px] font-semibold text-navy-900">Task status</h3>
            <div className="mt-5 space-y-4">
              {(
                [
                  ["todo", "To do", "bg-navy-400"],
                  ["in_progress", "In progress", "bg-blue-600"],
                  ["review", "Under review", "bg-amber-500"],
                  ["done", "Completed", "bg-brand-600"],
                ] as const
              ).map(([key, label, color]) => {
                const n = counts[key];
                const w = allTasks.length ? (n / allTasks.length) * 100 : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-[13.5px]">
                      <span className="text-navy-700">{label}</span>
                      <span className="font-semibold text-navy-900">{n}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-navy-100">
                      <div className={`h-full ${color}`} style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Pending review */}
        <section id="review" className="rounded-md border border-navy-100 bg-white">
          <div className="border-b border-navy-100 px-6 py-4">
            <h3 className="text-[16px] font-semibold text-navy-900">Submissions awaiting review</h3>
          </div>
          <ul className="divide-y divide-navy-100">
            {awaitingReview.map((t) => (
              <li key={t.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[15px] font-semibold text-navy-900">{t.title}</p>
                  <p className="m-0 text-[13px] text-navy-500">
                    {internById.get(t.internId)?.name} · due {formatDate(t.dueDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={setTaskStatus}>
                    <input type="hidden" name="taskId" value={t.id} />
                    <input type="hidden" name="status" value="in_progress" />
                    <button className="h-9 rounded border border-navy-300 px-3 text-[13px] font-semibold text-navy-800 hover:border-red-400 hover:text-red-700">
                      Return for revision
                    </button>
                  </form>
                  <form action={setTaskStatus}>
                    <input type="hidden" name="taskId" value={t.id} />
                    <input type="hidden" name="status" value="done" />
                    <button className="h-9 rounded bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700">
                      Approve
                    </button>
                  </form>
                </div>
              </li>
            ))}
            {awaitingReview.length === 0 && (
              <li className="px-6 py-8 text-center text-[14px] text-navy-500">
                Nothing is waiting for your review.
              </li>
            )}
          </ul>
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* All tasks */}
          <section id="tasks" className="rounded-md border border-navy-100 bg-white xl:col-span-2">
            <div className="border-b border-navy-100 px-6 py-4">
              <h3 className="text-[16px] font-semibold text-navy-900">All assigned tasks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-navy-50 text-[12px] uppercase tracking-wider text-navy-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Task</th>
                    <th className="px-4 py-3 font-semibold">Intern</th>
                    <th className="px-4 py-3 font-semibold">Due</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {allTasks.map((t) => (
                    <tr key={t.id}>
                      <td className="px-6 py-3 font-medium text-navy-900">{t.title}</td>
                      <td className="px-4 py-3 text-navy-700">{internById.get(t.internId)?.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-navy-700">{formatDate(t.dueDate)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* New task */}
          <section id="new-task" className="rounded-md border border-navy-100 bg-white p-6">
            <h3 className="text-[16px] font-semibold text-navy-900">Assign a new task</h3>
            <form action={createTask} className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-[13px] font-semibold text-navy-800">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  className="mt-1.5 h-11 w-full rounded border border-navy-300 px-3 text-[14px] focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>
              <div>
                <label htmlFor="internId" className="block text-[13px] font-semibold text-navy-800">
                  Intern
                </label>
                <select
                  id="internId"
                  name="internId"
                  required
                  className="mt-1.5 h-11 w-full rounded border border-navy-300 bg-white px-3 text-[14px] focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                >
                  {interns.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-[13px] font-semibold text-navy-800">
                  Due date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  min={today}
                  className="mt-1.5 h-11 w-full rounded border border-navy-300 px-3 text-[14px] focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-[13px] font-semibold text-navy-800">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1.5 w-full rounded border border-navy-300 px-3 py-2 text-[14px] focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>
              <button className="h-11 w-full rounded bg-brand-600 text-[14px] font-semibold text-white hover:bg-brand-700">
                Assign task
              </button>
            </form>
          </section>
        </div>

        <section id="account" className="rounded-md border border-navy-100 bg-white p-6">
          <h3 className="text-[16px] font-semibold text-navy-900">Profile</h3>
          <dl className="mt-3 grid gap-4 text-[14px] sm:grid-cols-4">
            <div><dt className="text-navy-500">Name</dt><dd className="font-semibold text-navy-900">{user.name}</dd></div>
            <div><dt className="text-navy-500">Employee no.</dt><dd className="font-semibold text-navy-900">{user.employeeNo}</dd></div>
            <div><dt className="text-navy-500">Designation</dt><dd className="font-semibold text-navy-900">{user.designation}</dd></div>
            <div><dt className="text-navy-500">Email</dt><dd className="font-semibold text-navy-900">{user.email}</dd></div>
          </dl>
        </section>
      </div>
    </AppShell>
  );
}
