import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import { AppShell, StatusBadge, formatDate } from "@/components/app-shell";
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Grid,
  MessageSquare,
} from "@/components/icons";
import { updateMyTaskStatus } from "./actions";

export const metadata: Metadata = { title: "Intern overview" };
export const dynamic = "force-dynamic";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function InternDashboard() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) redirect("/login?role=intern");
  if (user.role !== "intern") redirect("/supervisor");

  const [myTasks, supervisorRows] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.internId, user.id)).orderBy(asc(tasks.dueDate)),
    user.supervisorId
      ? db.select().from(users).where(eq(users.id, user.supervisorId)).limit(1)
      : Promise.resolve([]),
  ]);
  const supervisor = supervisorRows[0];

  const total = myTasks.length;
  const done = myTasks.filter((t) => t.status === "done").length;
  const inProgress = myTasks.filter((t) => t.status === "in_progress").length;
  const review = myTasks.filter((t) => t.status === "review").length;
  const open = myTasks.filter((t) => t.status !== "done").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const start = user.startDate ? new Date(`${user.startDate}T00:00:00`) : null;
  const end = user.endDate ? new Date(`${user.endDate}T00:00:00`) : null;
  const weeksIn = start ? Math.max(0, Math.floor((Date.now() - start.getTime()) / 6.048e8)) : 0;
  const weeksTotal =
    start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 6.048e8)) : 12;

  const nav = [
    {
      heading: "Workspace",
      items: [
        { href: "/intern", label: "Overview", icon: <Grid className="h-5 w-5" /> },
        { href: "/intern#tasks", label: "My tasks", icon: <ClipboardCheck className="h-5 w-5" />, badge: open },
        { href: "/intern#reports", label: "Weekly reports", icon: <FileText className="h-5 w-5" /> },
        { href: "/intern#learning", label: "Learning", icon: <BookOpen className="h-5 w-5" /> },
        { href: "/intern#calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
      ],
    },
    {
      heading: "Connect",
      items: [{ href: "/intern#supervisor", label: "Supervisor", icon: <MessageSquare className="h-5 w-5" /> }],
    },
  ];

  const circumference = 2 * Math.PI * 44;

  return (
    <AppShell user={user} title="Overview" subtitle="Intern portal" nav={nav} activeHref="/intern">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Greeting */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="m-0 text-[13px] font-medium text-brand-700">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h2 className="mt-1 text-[30px] font-semibold tracking-tight text-navy-900">
              {greeting()}, {user.name.split(" ")[0]}.
            </h2>
            <p className="mt-1 text-[15px] text-navy-600">
              A clear view of your placement progress and what needs your attention.
            </p>
          </div>
          <a
            href="#tasks"
            className="inline-flex h-11 items-center rounded bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700"
          >
            View my tasks
          </a>
        </div>

        {/* Progress + placement */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-md border border-navy-100 bg-white p-6 lg:col-span-2">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="relative h-[120px] w-[120px] shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#e1e8ef" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#0f7a6c"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - pct / 100)}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="m-0 text-[24px] font-semibold leading-none text-navy-900">{pct}%</p>
                    <p className="m-0 mt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-500">
                      complete
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-navy-900">Placement progress</h3>
                <p className="mt-1 text-[14.5px] text-navy-600">
                  You have completed {done} of {total} assigned deliverables. {review > 0 && `${review} awaiting supervisor review. `}
                  Keep your weekly report submissions on schedule.
                </p>
                <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-navy-100 pt-4">
                  <div>
                    <dt className="text-[12px] text-navy-500">Week</dt>
                    <dd className="text-[18px] font-semibold text-navy-900">
                      {Math.min(weeksIn + 1, weeksTotal)} <span className="text-[13px] font-normal text-navy-500">of {weeksTotal}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-navy-500">In progress</dt>
                    <dd className="text-[18px] font-semibold text-navy-900">{inProgress}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-navy-500">Ends</dt>
                    <dd className="text-[18px] font-semibold text-navy-900">{formatDate(user.endDate)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <section id="supervisor" className="rounded-md border border-navy-100 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-400">
              Placement details
            </p>
            <dl className="mt-4 space-y-3 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-navy-500">Intern ID</dt>
                <dd className="font-semibold text-navy-900">{user.employeeNo ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-navy-500">Department</dt>
                <dd className="text-right font-semibold text-navy-900">{user.department ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-navy-500">Institution</dt>
                <dd className="text-right font-semibold text-navy-900">{user.institution ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-navy-500">Period</dt>
                <dd className="text-right font-semibold text-navy-900">
                  {formatDate(user.startDate)} – {formatDate(user.endDate)}
                </dd>
              </div>
            </dl>
            {supervisor && (
              <div className="mt-5 border-t border-navy-100 pt-4">
                <p className="text-[12px] text-navy-500">Supervising officer</p>
                <p className="mt-1 text-[14.5px] font-semibold text-navy-900">{supervisor.name}</p>
                <p className="text-[13px] text-navy-500">{supervisor.designation}</p>
                <a
                  href={`mailto:${supervisor.email}`}
                  className="mt-2 inline-block text-[13px] font-semibold text-brand-700 hover:underline"
                >
                  {supervisor.email}
                </a>
              </div>
            )}
          </section>
        </div>

        {/* Tasks */}
        <section id="tasks" className="rounded-md border border-navy-100 bg-white">
          <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4">
            <div>
              <h3 className="text-[16px] font-semibold text-navy-900">Assigned deliverables</h3>
              <p className="m-0 text-[13px] text-navy-500">{open} open · {done} completed</p>
            </div>
          </div>
          <ul className="divide-y divide-navy-100">
            {myTasks.map((t) => (
              <li key={t.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="m-0 text-[15px] font-semibold text-navy-900">{t.title}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  {t.description && (
                    <p className="m-0 mt-1 text-[13.5px] text-navy-600">{t.description}</p>
                  )}
                  <p className="m-0 mt-1 text-[12.5px] text-navy-500">Due {formatDate(t.dueDate)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {t.status === "todo" && (
                    <form action={updateMyTaskStatus}>
                      <input type="hidden" name="taskId" value={t.id} />
                      <input type="hidden" name="status" value="in_progress" />
                      <button className="h-9 rounded border border-navy-300 px-3 text-[13px] font-semibold text-navy-800 hover:border-brand-600 hover:text-brand-700">
                        Start task
                      </button>
                    </form>
                  )}
                  {t.status === "in_progress" && (
                    <form action={updateMyTaskStatus}>
                      <input type="hidden" name="taskId" value={t.id} />
                      <input type="hidden" name="status" value="review" />
                      <button className="h-9 rounded bg-brand-600 px-3 text-[13px] font-semibold text-white hover:bg-brand-700">
                        Submit for review
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
            {myTasks.length === 0 && (
              <li className="px-6 py-10 text-center text-[14px] text-navy-500">
                No deliverables have been assigned yet.
              </li>
            )}
          </ul>
        </section>

        {/* Secondary panels */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section id="reports" className="rounded-md border border-navy-100 bg-white p-6">
            <h3 className="text-[15px] font-semibold text-navy-900">Weekly reports</h3>
            <p className="mt-1 text-[13.5px] text-navy-600">
              Reports are due every Friday by 17:00 PKT in the OGDCL standard template.
            </p>
            <a
              href="mailto:internships@ogdcl.com?subject=Weekly%20report"
              className="mt-4 inline-flex h-9 items-center rounded border border-navy-300 px-3 text-[13px] font-semibold text-navy-800 hover:border-brand-600 hover:text-brand-700"
            >
              Download template
            </a>
          </section>
          <section id="learning" className="rounded-md border border-navy-100 bg-white p-6">
            <h3 className="text-[15px] font-semibold text-navy-900">Learning</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-navy-700">
              <li className="flex justify-between"><span>HSE induction</span><span className="text-navy-500">Mandatory</span></li>
              <li className="flex justify-between"><span>Reservoir fundamentals</span><span className="text-navy-500">Module 1</span></li>
              <li className="flex justify-between"><span>Production data handling</span><span className="text-navy-500">Module 2</span></li>
            </ul>
          </section>
          <section id="calendar" className="rounded-md border border-navy-100 bg-white p-6">
            <h3 className="text-[15px] font-semibold text-navy-900">Milestones</h3>
            <ul className="mt-3 space-y-2 text-[13.5px] text-navy-700">
              <li className="flex justify-between"><span>Placement start</span><span className="text-navy-500">{formatDate(user.startDate)}</span></li>
              <li className="flex justify-between"><span>Mid-point review</span><span className="text-navy-500">{start && end ? formatDate(new Date((start.getTime() + end.getTime()) / 2)) : "—"}</span></li>
              <li className="flex justify-between"><span>Final evaluation</span><span className="text-navy-500">{formatDate(user.endDate)}</span></li>
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
