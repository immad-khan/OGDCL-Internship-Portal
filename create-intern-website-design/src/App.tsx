import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight, Bell, BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, FileText, Folder, FolderOpen, LayoutDashboard, LogOut, Menu, MessageCircle,
  MoreHorizontal, Paperclip, Plus, Search, Send, Settings, SlidersHorizontal, Sparkles, Target, Upload, X,
} from "lucide-react";

type Page = "Overview" | "My Tasks" | "Learning" | "Calendar" | "Messages" | "Files";
type TaskStatus = "To do" | "In progress" | "In review" | "Completed";
type Task = { id: number; title: string; project: string; due: string; dueMeta: string; status: TaskStatus; priority: "High" | "Medium" | "Low"; progress: number };

const initialTasks: Task[] = [
  { id: 1, title: "Separator performance sensitivity analysis", project: "Process Engineering", due: "Today, 4:00 PM", dueMeta: "Due today", status: "In progress", priority: "High", progress: 68 },
  { id: 2, title: "Complete HSE site induction module", project: "HSE Learning", due: "Tomorrow, 11:00 AM", dueMeta: "Due tomorrow", status: "To do", priority: "Medium", progress: 0 },
  { id: 3, title: "Prepare weekly progress report", project: "Internship Programme", due: "Fri, 27 Sep", dueMeta: "This week", status: "In review", priority: "Medium", progress: 92 },
  { id: 4, title: "Review crude oil sampling procedure", project: "Operations", due: "Mon, 30 Sep", dueMeta: "Next week", status: "To do", priority: "Low", progress: 0 },
];

const navItems: { label: Page; icon: LucideIcon; count?: number }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "My Tasks", icon: CheckCircle2, count: 4 },
  { label: "Learning", icon: BookOpen }, { label: "Calendar", icon: CalendarDays },
];
const utilityItems: { label: Page; icon: LucideIcon; count?: number }[] = [
  { label: "Messages", icon: MessageCircle, count: 2 }, { label: "Files", icon: FolderOpen },
];

function Avatar({ size = "md", initials = "AK" }: { size?: "sm" | "md" | "lg"; initials?: string }) {
  const dimensions = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a9c98] to-[#1675bb] font-bold text-white shadow-sm ${dimensions[size]}`}>{initials}</div>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#079b97] shadow-[0_6px_14px_rgba(7,155,151,0.2)]"><div className="relative h-4 w-4"><span className="absolute left-0 top-0 h-2 w-2 rounded-sm bg-white" /><span className="absolute right-0 top-0 h-2 w-2 rounded-sm bg-[#bdf3ed]" /><span className="absolute bottom-0 left-0 h-2 w-2 rounded-sm bg-[#bdf3ed]" /><span className="absolute bottom-0 right-0 h-2 w-2 rounded-sm bg-white" /></div></div>{!compact && <div><p className="text-lg font-extrabold leading-none tracking-[-0.04em] text-[#10213d]">ogdcl</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#6f85a8]">Internship portal</p></div>}</div>;
}

function NavButton({ item, active, onClick }: { item: { label: Page; icon: LucideIcon; count?: number }; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${active ? "bg-[#e7f8f6] text-[#078d89] shadow-[inset_3px_0_0_#0da59f]" : "text-[#60769a] hover:bg-[#f3f7fa] hover:text-[#17345b]"}`}><Icon className={`h-[19px] w-[19px] ${active ? "text-[#079f99]" : "text-[#8097b9] group-hover:text-[#17345b]"}`} strokeWidth={1.9} /><span className="flex-1">{item.label}</span>{item.count && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold ${active ? "bg-[#12aaa4] text-white" : "bg-[#f0f3f8] text-[#6c82a4]"}`}>{item.count}</span>}</button>;
}

function Sidebar({ activePage, onNavigate, mobile = false, onClose }: { activePage: Page; onNavigate: (page: Page) => void; mobile?: boolean; onClose?: () => void }) {
  const navigate = (page: Page) => { onNavigate(page); onClose?.(); };
  return <aside className={`flex h-full flex-col bg-white ${mobile ? "w-[286px] shadow-2xl" : "w-[248px] border-r border-[#e4ebf2]"}`}><div className="flex h-[78px] items-center justify-between border-b border-[#e9eef4] px-6"><Brand />{mobile && <button onClick={onClose} className="rounded-lg p-1 text-[#7086a6] hover:bg-slate-100"><X className="h-5 w-5" /></button>}</div><nav className="flex-1 px-4 py-6"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#91a4c1]">Workspace</p><div className="mt-2 space-y-1">{navItems.map((item) => <NavButton key={item.label} item={item} active={activePage === item.label} onClick={() => navigate(item.label)} />)}</div><p className="mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#91a4c1]">Connect</p><div className="mt-2 space-y-1">{utilityItems.map((item) => <NavButton key={item.label} item={item} active={activePage === item.label} onClick={() => navigate(item.label)} />)}</div></nav><div className="m-4 rounded-2xl bg-[#f5f8fb] p-3"><div className="flex items-center gap-2.5"><Avatar size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#182b49]">Ayesha Khan</p><p className="truncate text-xs text-[#7b91b1]">Process Engineering</p></div><ChevronDown className="h-4 w-4 text-[#8397b4]" /></div></div></aside>;
}

function ProgressRing({ value, size = 116, stroke = 10, color = "#13aaa2" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashOffset = circumference - (value / 100) * circumference;
  return <div className="relative shrink-0" style={{ width: size, height: size }}><svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${value}% complete`}><circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#dff3f0" strokeWidth={stroke} /><circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-700 ease-out" /></svg><div className="absolute inset-0 grid place-items-center"><div className="text-center"><p className="text-xl font-extrabold tracking-tight text-[#133657]">{value}%</p><p className="text-[9px] font-bold uppercase tracking-wide text-[#7a91af]">complete</p></div></div></div>;
}

function StatusPill({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = { "To do": "border-[#dce5ef] bg-[#f5f8fb] text-[#687f9f]", "In progress": "border-[#b5e5e1] bg-[#eafaf8] text-[#078e89]", "In review": "border-[#c5d9f4] bg-[#eef6ff] text-[#2472b8]", Completed: "border-[#c9ebd7] bg-[#effbf3] text-[#2c9563]" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function PriorityPill({ priority }: { priority: Task["priority"] }) {
  const styles = { High: "bg-[#fff2ee] text-[#d66645]", Medium: "bg-[#fff8e6] text-[#b77b08]", Low: "bg-[#eff4fa] text-[#647fa2]" };
  return <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[priority]}`}>{priority}</span>;
}

function PanelTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8ca0bc]">{eyebrow}</p>}<h2 className="text-[17px] font-bold tracking-[-0.02em] text-[#132947]">{title}</h2></div>{action}</div>;
}

function ScheduleItem({ time, title, meta, color }: { time: string; title: string; meta: string; color: string }) {
  return <div className="flex gap-3"><p className="w-9 pt-0.5 text-[11px] font-bold text-[#7188a7]">{time}</p><div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} /><div><p className="text-[13px] font-bold text-[#1b3554]">{title}</p><p className="mt-1 text-[11px] text-[#8096b1]">{meta}</p></div></div>;
}

function FileRow({ name, meta, type }: { name: string; meta: string; type: "xlsx" | "doc" | "pdf" }) {
  const colors = { xlsx: "bg-[#eaf8ef] text-[#3b9c68]", doc: "bg-[#edf5ff] text-[#3a7ec2]", pdf: "bg-[#fff0ef] text-[#d96b65]" };
  return <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#f7fafc]"><div className={`grid h-9 w-9 place-items-center rounded-lg ${colors[type]}`}><FileText className="h-[17px] w-[17px]" /></div><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold text-[#203957]">{name}</p><p className="mt-0.5 truncate text-[11px] text-[#8499b3]">{meta}</p></div><MoreHorizontal className="h-4 w-4 text-[#a2b3c7]" /></button>;
}

function SplineScene({ sceneUrl, onLoaded, onFailed }: { sceneUrl: string; onLoaded: () => void; onFailed: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const failTimer = window.setTimeout(() => {
      if (!cancelled) onFailed();
    }, 12000);

    const handleLoadComplete = () => {
      window.clearTimeout(failTimer);
      if (!cancelled) onLoaded();
    };
    const handleContextLoss = () => {
      if (!cancelled) onFailed();
    };

    let viewer: HTMLElement | null = null;

    const mount = () => {
      if (cancelled || !container) return;
      viewer = document.createElement("spline-viewer");
      viewer.setAttribute("url", sceneUrl);
      viewer.setAttribute("loading", "eager");
      viewer.style.width = "100%";
      viewer.style.height = "100%";
      viewer.style.display = "block";
      viewer.addEventListener("load-complete", handleLoadComplete);
      viewer.addEventListener("context-loss", handleContextLoss);
      container.appendChild(viewer);
    };

    if (customElements.get("spline-viewer")) {
      mount();
    } else {
      customElements.whenDefined("spline-viewer").then(() => {
        if (!cancelled) mount();
      });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      if (viewer) {
        viewer.removeEventListener("load-complete", handleLoadComplete);
        viewer.removeEventListener("context-loss", handleContextLoss);
        viewer.remove();
      }
    };
  }, [sceneUrl, onLoaded, onFailed]);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}

function Overview({ tasks, onNavigate, onTaskSelect, splineLoaded, splineError, setSplineLoaded, setSplineError }: { tasks: Task[]; onNavigate: (page: Page) => void; onTaskSelect: (task: Task) => void; splineLoaded: boolean; splineError: boolean; setSplineLoaded: (loaded: boolean) => void; setSplineError: (error: boolean) => void }) {
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
        <div className="relative h-[340px] w-full overflow-hidden sm:h-[430px] lg:h-[520px]">
          <SplineScene
            sceneUrl="https://prod.spline.design/PPljLYJWAAZjGcy3/scene.splinecode"
            onLoaded={() => setSplineLoaded(true)}
            onFailed={() => setSplineError(true)}
          />
          {splineError && <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#e7f7f5] to-[#e8f4ff]"><p className="px-6 text-center text-sm font-medium text-[#547895]">The interactive 3D scene could not be loaded.</p></div>}
          {!splineLoaded && !splineError && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-gradient-to-br from-[#e7f7f5] to-[#e8f4ff]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0d9f99] border-t-transparent" /></div>}
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

function TaskListRow({ task, onUpdate, onClick }: { task: Task; onUpdate: (id: number, status: TaskStatus) => void; onClick: () => void }) {
  const done = task.status === "Completed";
  return <div className="grid gap-3 border-b border-[#e9eef4] px-5 py-4 last:border-0 md:grid-cols-[minmax(220px,1.6fr)_1fr_120px_116px] md:items-center md:gap-5 md:px-6">
    <div className="flex min-w-0 items-center gap-3">
      <button onClick={() => onUpdate(task.id, done ? "To do" : "Completed")} className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${done ? "border-[#14a49e] bg-[#14a49e] text-white" : "border-[#c7d4e2] bg-white hover:border-[#0c9e98]"}`}>{done && <Check className="h-3.5 w-3.5" />}</button>
      <button onClick={onClick} className="min-w-0 flex-1 text-left group">
        <p className={`truncate text-sm font-bold ${done ? "text-[#7e92aa] line-through" : "text-[#18304f] group-hover:text-[#078e89]"}`}>{task.title}</p>
        <p className="mt-1 text-xs text-[#8195b0]">{task.project} <span className="mx-1 text-[#cad4e1]">|</span> <PriorityPill priority={task.priority} /></p>
      </button>
    </div>
    <div className="flex items-center gap-2 text-xs text-[#7389a8]"><Clock3 className="h-3.5 w-3.5" />{task.due}</div>
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9eef4]"><div className="h-full rounded-full bg-[#159f9a] transition-all duration-500" style={{ width: `${task.progress}%` }} /></div>
      <span className="text-[11px] font-bold text-[#6e86a5]">{task.progress}%</span>
    </div>
    <select value={task.status} onChange={(event) => onUpdate(task.id, event.target.value as TaskStatus)} className="rounded-lg border border-[#dbe5ef] bg-white px-2 py-1.5 text-xs font-bold text-[#55708f] outline-none focus:border-[#0c9e98]">
      {(["To do", "In progress", "In review", "Completed"] as TaskStatus[]).map((status) => <option key={status}>{status}</option>)}
    </select>
  </div>;
}

function TaskPage({ tasks, onUpdate, onTaskSelect }: { tasks: Task[]; onUpdate: (id: number, status: TaskStatus) => void; onTaskSelect: (task: Task) => void }) {
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

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-[#edf1f5] pb-4 last:border-0 last:pb-0"><span className="text-sm text-[#7087a6]">{label}</span><span className="text-sm font-extrabold text-[#1a3657]">{value}</span></div>;
}

function LearningPage() {
  const modules = [["Introduction to process safety", "18 min", true], ["Hazard identification and controls", "32 min", true], ["Permit to Work systems", "28 min", false], ["Isolation and lockout procedures", "24 min", false]] as const;
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Development plan</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Learning</h1><p className="mt-2 text-[15px] text-[#6981a3]">Build the core knowledge you need for a strong field placement.</p></div>
      <button className="inline-flex items-center gap-2 self-start rounded-xl border border-[#d9e6ef] bg-white px-4 py-3 text-sm font-bold text-[#486887] hover:bg-[#f7fbfb]"><CircleHelp className="h-4 w-4" /> Need help?</button>
    </section>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="overflow-hidden rounded-[22px] bg-[#243e6b] p-6 text-white sm:p-8">
        <div className="flex max-w-xl flex-col justify-between gap-10 sm:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9db8e7]">Current pathway</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">Process safety essentials</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#c4d3ed]">Understand the everyday controls that protect people, plant and the environment.</p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#28476f] transition hover:bg-[#e9f6f5]">Resume module <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="flex justify-center"><ProgressRing value={75} size={126} stroke={10} color="#a59bff" /></div>
        </div>
      </div>
      <div className="rounded-[20px] border border-[#e0e8f1] bg-white p-6 shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
        <PanelTitle eyebrow="Programme" title="Learning record" />
        <div className="mt-6 space-y-5">
          <Metric label="Modules completed" value="5 / 6" />
          <Metric label="Learning time" value="3h 42m" />
          <Metric label="Assessment score" value="92%" />
        </div>
      </div>
    </div>
    <div className="mt-6 rounded-[20px] border border-[#e0e8f1] bg-white p-5 shadow-[0_8px_22px_rgba(30,62,100,0.035)] sm:p-6">
      <PanelTitle title="Course modules" action={<span className="text-xs font-medium text-[#8195b2]">4 lessons</span>} />
      <div className="mt-4 divide-y divide-[#e9eef4]">
        {modules.map(([title, duration, complete], index) => (
          <div className="flex items-center gap-4 py-4" key={title}>
            <div className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${complete ? "bg-[#e5f8ef] text-[#2d9a66]" : "bg-[#f1f5fa] text-[#6f87a8]"}`}>
              {complete ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#1b3452]">{title}</p>
              <p className="mt-1 text-xs text-[#8398b2]">{duration} {complete ? "| Completed" : "| Ready to start"}</p>
            </div>
            {complete ? <span className="text-xs font-bold text-[#319967]">Done</span> : <button className="rounded-lg bg-[#eaf8f7] px-3 py-2 text-xs font-bold text-[#078e89] hover:bg-[#d8f2ef]">Start</button>}
          </div>
        ))}
      </div>
    </div>
  </div>;
}

function CalendarPage() {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const events: Record<number, string[]> = { 4: ["Team stand-up"], 8: ["Weekly review"], 12: ["Mid-point review"], 19: ["HSE briefing"], 24: ["Report due"], 27: ["Team stand-up"] };
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Schedule</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Calendar</h1><p className="mt-2 text-[15px] text-[#6981a3]">Plan around your team commitments and coursework.</p></div>
      <button className="inline-flex items-center gap-2 self-start rounded-xl bg-[#0d9f99] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,159,153,0.2)]"><Plus className="h-4 w-4" /> Add event</button>
    </section>
    <div className="mt-7 overflow-hidden rounded-[20px] border border-[#e0e8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
      <div className="flex items-center justify-between border-b border-[#e8eef4] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-1.5 text-[#6f87a7] hover:bg-[#f2f6f9]"><ChevronLeft className="h-4 w-4" /></button>
          <h2 className="text-lg font-bold text-[#17304f]">September 2026</h2>
          <button className="rounded-lg p-1.5 text-[#6f87a7] hover:bg-[#f2f6f9]"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <button className="rounded-lg border border-[#dde7f0] px-3 py-1.5 text-xs font-bold text-[#55718f]">Today</button>
      </div>
      <div className="grid grid-cols-7 border-l border-t border-[#e8eef4]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="border-b border-r border-[#e8eef4] bg-[#f8fafc] px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#8a9db6]">{day}</div>
        ))}
        <div className="hidden min-h-[98px] border-b border-r border-[#e8eef4] p-2 sm:block" />
        {days.map((day) => (
          <div className={`min-h-[75px] border-b border-r border-[#e8eef4] p-2 sm:min-h-[102px] ${day === 24 ? "bg-[#f3fbfa]" : ""}`} key={day}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${day === 24 ? "bg-[#0d9f99] text-white" : "text-[#56708f]"}`}>{day}</span>
            {events[day]?.map((event) => (
              <p key={event} className="mt-2 truncate rounded bg-[#e9f7f5] px-1.5 py-1 text-[9px] font-bold text-[#078e89] sm:text-[10px]">{event}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>;
}

function MessagesPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ from: "supervisor", text: "Nice work, Ayesha. Please attach the sensitivity analysis when it is ready.", time: "10:02 AM" }]);
  const sendMessage = () => { if (message.trim()) { setMessages((current) => [...current, { from: "me", text: message.trim(), time: "Now" }]); setMessage(""); } };
  const contacts = [["Engr. Ahmad Raza", "Supervisor", "ER"], ["Fatima Noor", "Electrical Engineering", "FN"], ["Usman Malik", "IT Department", "UM"], ["HSE Support", "Safety & Environment", "HS"]];
  return <div className="animate-enter">
    <section><p className="text-sm font-semibold text-[#0c9f99]">Connect</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Messages</h1><p className="mt-2 text-[15px] text-[#6981a3]">Ask a question or keep your supervisor up to date.</p></section>
    <div className="mt-7 grid min-h-[570px] overflow-hidden rounded-[20px] border border-[#dfe8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)] md:grid-cols-[270px_1fr]">
      <aside className="border-b border-[#e5edf4] md:border-b-0 md:border-r">
        <div className="border-b border-[#e9eef4] p-4">
          <div className="flex items-center gap-2 rounded-xl bg-[#f4f7fb] px-3 py-2.5 text-[#8195af]">
            <Search className="h-4 w-4" /><span className="text-xs">Search conversations</span>
          </div>
        </div>
        {contacts.map(([name, role, initials], index) => (
          <button key={name} className={`flex w-full items-center gap-3 border-b border-[#e9eef4] px-4 py-4 text-left transition hover:bg-[#f7fbfb] ${index === 0 ? "bg-[#ecf9f7]" : ""}`}>
            <Avatar size="sm" initials={initials} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1b3553]">{name}</p>
              <p className="mt-1 truncate text-xs text-[#8095b0]">{index === 0 ? "Please attach the sensitivity..." : role}</p>
            </div>
            {index === 0 && <span className="h-2 w-2 rounded-full bg-[#10a59f]" />}
          </button>
        ))}
      </aside>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3 border-b border-[#e8eef4] px-5 py-4">
          <Avatar size="md" initials="ER" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[#193453]">Engr. Ahmad Raza</p>
            <p className="mt-1 text-xs text-[#7990ad]">Supervisor <span className="mx-1">|</span> Online</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-[#8ba0b9]" />
        </div>
        <div className="flex-1 space-y-4 bg-[#fbfcfe] p-5">
          <div className="max-w-[490px] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-[#284361] shadow-sm">
            <p>Sir, I finished the first simulation run of the separator train. The recovery improved by about 2.1%.</p>
            <span className="mt-2 block text-[10px] font-medium text-[#91a2b9]">Ayesha Khan | 10:02 AM</span>
          </div>
          {messages.map((item, index) => (
            <div key={index} className={`max-w-[520px] rounded-2xl p-4 text-sm leading-6 shadow-sm ${item.from === "me" ? "ml-auto rounded-br-sm bg-[#0d9f99] text-white" : "rounded-tl-sm bg-white text-[#294563]"}`}>
              <p>{item.text}</p>
              <span className={`mt-2 block text-[10px] font-medium ${item.from === "me" ? "text-[#c5f4ef]" : "text-[#91a2b9]"}`}>{item.from === "me" ? "You" : "Engr. Ahmad Raza"} | {item.time}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#e8eef4] p-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#dce6ef] px-3 py-2">
            <button className="p-1 text-[#8197b3]"><Paperclip className="h-4 w-4" /></button>
            <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Write a message..." className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#2b4664] outline-none placeholder:text-[#98a8be]" />
            <button onClick={sendMessage} className="grid h-8 w-8 place-items-center rounded-lg bg-[#0d9f99] text-white hover:bg-[#078e89]"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

function FolderTile({ title, count, people = false }: { title: string; count: string; people?: boolean }) {
  return <button className="group rounded-[18px] border border-[#e0e8f1] bg-white p-5 text-left shadow-[0_8px_20px_rgba(30,62,100,0.03)] transition hover:-translate-y-0.5 hover:border-[#b9ddd9]">
    <div className="flex items-start justify-between">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8f8f6] text-[#0a9c97]"><Folder className="h-5 w-5" /></div>
      <MoreHorizontal className="h-4 w-4 text-[#92a5bd]" />
    </div>
    <p className="mt-5 text-sm font-bold text-[#1b3553]">{title}</p>
    <div className="mt-2 flex items-center justify-between">
      <p className="text-xs text-[#7e94b0]">{count}</p>
      {people && <div className="flex -space-x-1.5"><span className="h-5 w-5 rounded-full border-2 border-white bg-[#1f78bd]" /><span className="h-5 w-5 rounded-full border-2 border-white bg-[#11a49e]" /><span className="h-5 w-5 rounded-full border-2 border-white bg-[#e2a652]" /></div>}
    </div>
  </button>;
}

function FilesPage() {
  const files = [["Weekly progress report template.docx", "Document", "240 KB", "Yesterday", "doc"], ["Separator train data pack.xlsx", "Spreadsheet", "1.8 MB", "24 Sep 2026", "xlsx"], ["HSE site induction checklist.pdf", "PDF", "2.1 MB", "22 Sep 2026", "pdf"], ["Process engineering orientation.pptx", "Presentation", "4.7 MB", "18 Sep 2026", "ppt"]] as const;
  const iconColor: Record<string, string> = { doc: "bg-[#edf5ff] text-[#357cc3]", xlsx: "bg-[#e8f8ee] text-[#3d9b69]", pdf: "bg-[#fff0ef] text-[#d56760]", ppt: "bg-[#fff4e8] text-[#db8439]" };
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Resources</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">My files</h1><p className="mt-2 text-[15px] text-[#6981a3]">Your work, learning materials and shared department resources.</p></div>
      <button className="inline-flex items-center gap-2 self-start rounded-xl bg-[#0d9f99] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,159,153,0.2)]"><Upload className="h-4 w-4" /> Upload file</button>
    </section>
    <div className="mt-7 grid gap-4 sm:grid-cols-3">
      <FolderTile title="Supervisor shared" count="8 files" people />
      <FolderTile title="My reports" count="3 files" />
      <FolderTile title="Learning resources" count="12 files" />
    </div>
    <div className="mt-7 overflow-hidden rounded-[20px] border border-[#e0e8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
      <div className="flex flex-col gap-3 border-b border-[#e8eef4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-[17px] font-bold text-[#17304f]">All files</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-[#f4f7fb] px-3 py-2 text-xs text-[#8498b2]"><Search className="h-3.5 w-3.5" />Search files</div>
          <button className="rounded-lg border border-[#dfe8f0] p-2 text-[#6981a1]"><SlidersHorizontal className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="hidden grid-cols-[1.7fr_1fr_100px_130px_30px] gap-4 border-b border-[#e8eef4] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#91a3bd] md:grid"><p>Name</p><p>Type</p><p>Size</p><p>Modified</p><span /></div>
      {files.map(([name, type, size, date, icon]) => (
        <button key={name} className="grid w-full items-center gap-3 border-b border-[#e8eef4] px-5 py-4 text-left transition hover:bg-[#f8fbfc] md:grid-cols-[1.7fr_1fr_100px_130px_30px] md:gap-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconColor[icon]}`}><FileText className="h-4 w-4" /></div>
            <p className="truncate text-sm font-bold text-[#1d3755]">{name}</p>
          </div>
          <p className="hidden text-xs text-[#7187a5] md:block">{type}</p>
          <p className="hidden text-xs text-[#7187a5] md:block">{size}</p>
          <p className="hidden text-xs text-[#7187a5] md:block">{date}</p>
          <MoreHorizontal className="h-4 w-4 justify-self-end text-[#90a3ba]" />
        </button>
      ))}
    </div>
  </div>;
}

function TaskModal({ task, onClose, onUpdate }: { task: Task; onClose: () => void; onUpdate: (id: number, status: TaskStatus) => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#13243f]/40 p-4 backdrop-blur-sm animate-fade">
    <div className="w-full max-w-[560px] overflow-hidden rounded-[22px] bg-white shadow-2xl animate-pop">
      <div className="flex items-start justify-between border-b border-[#e6edf3] p-6">
        <div>
          <div className="flex items-center gap-2"><PriorityPill priority={task.priority} /><span className="text-xs text-[#7d91ad]">{task.project}</span></div>
          <h2 className="mt-3 text-xl font-extrabold tracking-[-0.03em] text-[#142c4a]">{task.title}</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-[#7890ad] hover:bg-[#f3f6f9]"><X className="h-5 w-5" /></button>
      </div>
      <div className="space-y-6 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8fa2bc]">Task brief</p>
          <p className="mt-2 text-sm leading-6 text-[#506f8e]">Complete the working file, summarise the result and share your key observation with your supervisor for feedback.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8fa2bc]">Due</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1d3857]"><CalendarDays className="h-4 w-4 text-[#0d9f99]" /> {task.due}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8fa2bc]">Progress</p>
            <p className="mt-2 text-sm font-bold text-[#1d3857]">{task.progress}% complete</p>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#8fa2bc]">Update status</label>
          <select value={task.status} onChange={(event) => onUpdate(task.id, event.target.value as TaskStatus)} className="mt-2 w-full rounded-xl border border-[#dce6ee] bg-white px-3 py-3 text-sm font-bold text-[#456280] outline-none focus:border-[#0c9e98]">
            {(["To do", "In progress", "In review", "Completed"] as TaskStatus[]).map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e6edf3] bg-[#fbfcfd] p-4">
        <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#66809f] hover:bg-[#f0f4f7]">Close</button>
        <button onClick={() => { onUpdate(task.id, "Completed"); onClose(); }} className="inline-flex items-center gap-2 rounded-xl bg-[#0d9f99] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#078e89]"><Check className="h-4 w-4" />Mark completed</button>
      </div>
    </div>
  </div>;
}

function NotificationItem({ color, icon, text, time }: { color: string; icon: React.ReactNode; text: string; time: string }) {
  return <button className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-[#f7fafc]">
    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${color}`}>{icon}</div>
    <div><p className="text-xs leading-5 text-[#46637f]">{text}</p><p className="mt-1 text-[10px] text-[#96a7bc]">{time}</p></div>
  </button>;
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  return <div className="absolute right-0 top-12 z-40 w-[310px] overflow-hidden rounded-2xl border border-[#e0e8f1] bg-white shadow-xl animate-pop">
    <div className="flex items-center justify-between border-b border-[#e9eef4] px-4 py-3">
      <p className="text-sm font-bold text-[#1c3553]">Notifications</p>
      <button onClick={onClose} className="text-xs font-bold text-[#0a9791]">Mark all read</button>
    </div>
    <div className="p-2">
      <NotificationItem color="bg-[#e8f8f5] text-[#0e9f99]" icon={<CheckCircle2 className="h-4 w-4" />} text="Your weekly report is ready for review." time="12 min ago" />
      <NotificationItem color="bg-[#edf5ff] text-[#397abe]" icon={<MessageCircle className="h-4 w-4" />} text="Engr. Ahmad Raza replied to your message." time="1 hour ago" />
      <NotificationItem color="bg-[#fff5e8] text-[#c98217]" icon={<Clock3 className="h-4 w-4" />} text="Site induction module is due tomorrow." time="3 hours ago" />
    </div>
  </div>;
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>("Overview");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const selectedCurrentTask = selectedTask ? tasks.find((task) => task.id === selectedTask.id) ?? null : null;
  const suggestedSearch = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase())).slice(0, 3), [search, tasks]);
  const updateTask = (id: number, status: TaskStatus) => setTasks((current) => current.map((task) => task.id === id ? { ...task, status, progress: status === "Completed" ? 100 : task.progress } : task));
  const navigate = (page: Page) => { setActivePage(page); setSearch(""); };
  const content = () => {
    if (activePage === "My Tasks") return <TaskPage tasks={tasks} onUpdate={updateTask} onTaskSelect={setSelectedTask} />;
    if (activePage === "Learning") return <LearningPage />;
    if (activePage === "Calendar") return <CalendarPage />;
    if (activePage === "Messages") return <MessagesPage />;
    if (activePage === "Files") return <FilesPage />;
    return <Overview tasks={tasks} onNavigate={navigate} onTaskSelect={setSelectedTask} splineLoaded={splineLoaded} splineError={splineError} setSplineLoaded={setSplineLoaded} setSplineError={setSplineError} />;
  };
  return <div className="min-h-screen bg-[#f5f8fb] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#142a47]">
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <div className="hidden lg:block"><Sidebar activePage={activePage} onNavigate={navigate} /></div>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-[78px] items-center border-b border-[#e3eaf2] bg-white/95 px-5 backdrop-blur lg:px-8">
          <button onClick={() => setMenuOpen(true)} className="mr-3 rounded-lg p-2 text-[#64809d] hover:bg-[#f2f6f9] lg:hidden"><Menu className="h-5 w-5" /></button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#90a4bf]">Internship portal</p>
            <h2 className="truncate text-lg font-bold tracking-[-0.02em] text-[#1a314f]">{activePage}</h2>
          </div>
          <div className="relative mr-2 hidden w-[270px] xl:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ca1bc]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks and files..." className="w-full rounded-xl bg-[#f3f6fa] py-2.5 pl-10 pr-3 text-sm text-[#304b68] outline-none placeholder:text-[#94a7bf] focus:ring-2 focus:ring-[#b7e5e1]" />
            {search && <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-[#e1e9f1] bg-white p-1 shadow-xl">
              {suggestedSearch.length ? suggestedSearch.map((task) => <button onClick={() => { setSelectedTask(task); setSearch(""); }} key={task.id} className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#385574] hover:bg-[#f4f8fb]">{task.title}</button>) : <p className="p-3 text-xs text-[#8599b2]">No task found</p>}
            </div>}
          </div>
          <div className="relative">
            <button onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }} className="relative grid h-10 w-10 place-items-center rounded-xl text-[#627d9d] transition hover:bg-[#f2f6f9]">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full border-2 border-white bg-[#ef426a] px-1 text-[9px] font-bold leading-3 text-white">2</span>
            </button>
            {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}
          </div>
          <div className="relative ml-2 border-l border-[#e8eef4] pl-3 sm:ml-4">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }} className="flex items-center gap-2.5 rounded-xl p-1 text-left hover:bg-[#f7f9fb]">
              <Avatar size="sm" />
              <div className="hidden pr-1 sm:block">
                <p className="text-sm font-bold leading-4 text-[#1c3553]">Ayesha Khan</p>
                <p className="mt-1 text-[11px] text-[#7890ae]">Intern</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-[#8398b3] sm:block" />
            </button>
            {profileOpen && <div className="absolute right-0 top-12 z-40 w-[190px] overflow-hidden rounded-xl border border-[#e0e8f1] bg-white p-1.5 shadow-xl animate-pop">
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#526f8d] hover:bg-[#f5f8fb]"><Settings className="h-4 w-4" /> Account settings</button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#c75d65] hover:bg-[#fff5f5]"><LogOut className="h-4 w-4" /> Sign out</button>
            </div>}
          </div>
        </header>
        <main className="mx-auto max-w-[1460px] px-5 py-7 sm:px-7 lg:px-8 lg:py-8">{content()}</main>
      </div>
    </div>
    {menuOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute inset-0 bg-[#152943]/40 backdrop-blur-[1px]" />
      <div className="relative h-full"><Sidebar mobile activePage={activePage} onNavigate={navigate} onClose={() => setMenuOpen(false)} /></div>
    </div>}
    {selectedCurrentTask && <TaskModal task={selectedCurrentTask} onClose={() => setSelectedTask(null)} onUpdate={updateTask} />}
  </div>;
}
