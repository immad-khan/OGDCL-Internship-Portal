"use client";

import { ArrowRight, BookOpen, CalendarDays, ChevronRight, FileText, Sparkles, Target } from "lucide-react";
import { FileRow, PanelTitle, ProgressRing, ScheduleItem, StatusPill } from "../_components";
import type { Page, Task } from "../_components";

export function Overview({ tasks, onNavigate, onTaskSelect }: { tasks: Task[]; onNavigate: (page: Page) => void; onTaskSelect: (task: Task) => void }) {
  const progress = Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length);
  const completed = tasks.filter((task) => task.status === "Completed").length + 3;
  const upcoming = tasks.filter((task) => task.status !== "Completed").slice(0, 3);
  return <div className="space-y-6 animate-enter">
    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0c9f99]"><span className="h-2 w-2 rounded-full bg-[#14b2a8] animate-pulse" />Tuesday, 24 September</p><h1 className="text-3xl font-extrabold tracking-[-0.045em] text-[#10223f] sm:text-[34px]">Good morning, Ayesha.</h1><p className="mt-2 text-[15px] text-[#6981a3]">Here is a clear view of your placement progress and what needs your attention.</p></div>
      <button onClick={() => onNavigate("My Tasks")} className="group inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#0d9f99] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,159,153,0.2)] transition hover:-translate-y-0.5 hover:bg-[#078f8a] md:self-auto">View my tasks <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
    </section>
    <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#e7f7f5] via-[#f0faf9] to-[#e8f4ff] p-0 sm:p-0">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="relative z-10 p-5 sm:p-7 lg:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-[11px] font-bold text-[#168f8a]"><Sparkles className="h-3.5 w-3.5" /> ON TRACK THIS WEEK</div>
          <h2 className="max-w-md text-2xl font-extrabold tracking-[-0.04em] text-[#123655] sm:text-[28px]">Your internship is taking shape.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#547895]">You have completed {completed} of 8 assigned deliverables. Keep your analysis moving and submit your weekly report by Friday.</p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
            <div><p className="font-bold text-[#133a5b]">4 weeks</p><p className="mt-0.5 text-xs text-[#6b88a2]">in the programme</p></div>
            <div className="h-8 w-px bg-[#bfe3df]" />
            <div><p className="font-bold text-[#133a5b]">12 Oct</p><p className="mt-0.5 text-xs text-[#6b88a2]">mid-point review</p></div>
          </div>
          <div className="relative mx-auto mt-6 flex items-center gap-4 rounded-[20px] bg-white/85 p-4 lg:mx-0 lg:mt-0">
            <ProgressRing value={progress} />
            <div className="pr-2"><p className="text-sm font-bold text-[#193958]">Placement progress</p><p className="mt-1 max-w-[130px] text-xs leading-5 text-[#6c86a2]">Ahead of the expected weekly pace.</p></div>
          </div>
        </div>
        <div className="relative hidden h-[340px] w-full overflow-hidden sm:h-[430px] lg:grid lg:h-[520px] place-items-center bg-gradient-to-br from-[#e7f7f5] to-[#e8f4ff]">
          <Sparkles className="h-16 w-16 text-[#0d9f99]/30" />
        </div>
      </div>
    </section>
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
      <div className="rounded-[20px] border border-[#e0e8f1] bg-white px-5 py-5 shadow-[0_8px_22px_rgba(30,62,100,0.035)] sm:px-6">
        <PanelTitle eyebrow="Your work" title="Priority tasks" action={<button onClick={() => onNavigate("My Tasks")} className="text-xs font-bold text-[#078e89] hover:text-[#057670]">View all</button>} />
        <div className="mt-4 divide-y divide-[#eaf0f5]">
          {upcoming.map((task) => (
            <button key={task.id} onClick={() => onTaskSelect(task)} className="group flex w-full items-center gap-3 py-4 text-left first:pt-2 hover:bg-[#fbfdfd]">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${task.status === "In progress" ? "bg-[#e8f8f5] text-[#08a09a]" : task.status === "In review" ? "bg-[#edf5ff] text-[#2377bf]" : "bg-[#f4f7fa] text-[#7e94b2]"}`}>
                {task.status === "In progress" ? <Target className="h-[19px] w-[19px]" /> : task.status === "In review" ? <FileText className="h-[19px] w-[19px]" /> : <BookOpen className="h-[19px] w-[19px]" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#1a304e] transition-colors group-hover:text-[#078f8a]">{task.title}</p>
                <p className="mt-1 text-xs text-[#7e94b1]">{task.project} <span className="mx-1 text-[#c1cede]">|</span> {task.dueMeta}</p>
              </div>
              <div className="hidden text-right sm:block"><StatusPill status={task.status} /><p className="mt-2 text-[11px] font-medium text-[#7188a7]">{task.progress}% done</p></div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#a8bad0] transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[20px] border border-[#e0e8f1] bg-white px-5 py-5 shadow-[0_8px_22px_rgba(30,62,100,0.035)] sm:px-6">
        <PanelTitle eyebrow="Tuesday" title="Today's rhythm" action={<CalendarDays className="h-4 w-4 text-[#8fa3bf]" />} />
        <div className="mt-5 space-y-5">
          <ScheduleItem time="09:30" title="Daily team stand-up" meta="Conference room 2B" color="bg-[#0da39d]" />
          <ScheduleItem time="11:00" title="Process simulation review" meta="With Omar S., Process Lead" color="bg-[#3e82ca]" />
          <ScheduleItem time="14:30" title="Focus time" meta="Sensitivity analysis" color="bg-[#f2b548]" />
        </div>
        <button onClick={() => onNavigate("Calendar")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe8f1] py-2.5 text-xs font-bold text-[#567292] transition hover:border-[#a9ddd8] hover:bg-[#f2fbfa] hover:text-[#078e89]">Open calendar <ArrowRight className="h-3.5 w-3.5" /></button>
      </div>
    </section>
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[20px] border border-[#e0e8f1] bg-white px-5 py-5 shadow-[0_8px_22px_rgba(30,62,100,0.035)] sm:px-6">
        <PanelTitle eyebrow="Learning path" title="Process safety essentials" action={<button onClick={() => onNavigate("Learning")} className="text-xs font-bold text-[#078e89] hover:text-[#057670]">Continue</button>} />
        <div className="mt-5 flex items-center gap-5">
          <ProgressRing value={75} size={82} stroke={8} color="#577bdf" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#183151]">5 of 6 modules complete</p>
            <p className="mt-1 text-xs leading-5 text-[#7d93af]">Next up: Permit to Work and isolation procedures.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9eef8]"><div className="h-full rounded-full bg-[#587cdd] transition-all duration-700" style={{ width: "75%" }} /></div>
          </div>
        </div>
      </div>
      <div className="rounded-[20px] border border-[#e0e8f1] bg-white px-5 py-5 shadow-[0_8px_22px_rgba(30,62,100,0.035)] sm:px-6">
        <PanelTitle eyebrow="Shared with you" title="Latest files" action={<button onClick={() => onNavigate("Files")} className="text-xs font-bold text-[#078e89] hover:text-[#057670]">Open files</button>} />
        <div className="mt-4 space-y-1">
          <FileRow name="Separator train data pack.xlsx" meta="Shared by Engr. Ahmad Raza" type="xlsx" />
          <FileRow name="Weekly report template.docx" meta="Updated yesterday" type="doc" />
          <FileRow name="Site induction checklist.pdf" meta="Shared by HSE team" type="pdf" />
        </div>
      </div>
    </section>
  </div>;
}