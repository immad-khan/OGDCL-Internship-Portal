"use client";

import { BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, FileText, Folder, FolderOpen, LayoutDashboard, MessageCircle, MoreHorizontal, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Page = "Overview" | "My Tasks" | "Learning" | "Calendar" | "Messages" | "Files";
export type TaskStatus = "To do" | "In progress" | "In review" | "Completed";
export type Task = { id: number; title: string; project: string; due: string; dueMeta: string; status: TaskStatus; priority: "High" | "Medium" | "Low"; progress: number };

export const navItems: { label: Page; icon: LucideIcon; count?: number }[] = [
  { label: "Overview", icon: LayoutDashboard }, { label: "My Tasks", icon: CheckCircle2, count: 4 },
  { label: "Learning", icon: BookOpen }, { label: "Calendar", icon: CalendarDays },
];
export const utilityItems: { label: Page; icon: LucideIcon; count?: number }[] = [
  { label: "Messages", icon: MessageCircle, count: 2 }, { label: "Files", icon: FolderOpen },
];

export function Avatar({ size = "md", initials = "AK" }: { size?: "sm" | "md" | "lg"; initials?: string }) {
  const dimensions = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a9c98] to-[#1675bb] font-bold text-white shadow-sm ${dimensions[size]}`}>{initials}</div>;
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#079b97] shadow-[0_6px_14px_rgba(7,155,151,0.2)]"><div className="relative h-4 w-4"><span className="absolute left-0 top-0 h-2 w-2 rounded-sm bg-white" /><span className="absolute right-0 top-0 h-2 w-2 rounded-sm bg-[#bdf3ed]" /><span className="absolute bottom-0 left-0 h-2 w-2 rounded-sm bg-[#bdf3ed]" /><span className="absolute bottom-0 right-0 h-2 w-2 rounded-sm bg-white" /></div></div>{!compact && <div><p className="text-lg font-extrabold leading-none tracking-[-0.04em] text-[#10213d]">ogdcl</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#6f85a8]">Internship portal</p></div>}</div>;
}

export function NavButton({ item, active, onClick }: { item: { label: Page; icon: LucideIcon; count?: number }; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${active ? "bg-[#e7f8f6] text-[#078d89] shadow-[inset_3px_0_0_#0da59f]" : "text-[#60769a] hover:bg-[#f3f7fa] hover:text-[#17345b]"}`}><Icon className={`h-[19px] w-[19px] ${active ? "text-[#079f99]" : "text-[#8097b9] group-hover:text-[#17345b]"}`} strokeWidth={1.9} /><span className="flex-1">{item.label}</span>{item.count && <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold ${active ? "bg-[#12aaa4] text-white" : "bg-[#f0f3f8] text-[#6c82a4]"}`}>{item.count}</span>}</button>;
}

export function Sidebar({ activePage, onNavigate, mobile = false, onClose }: { activePage: Page; onNavigate: (page: Page) => void; mobile?: boolean; onClose?: () => void }) {
  const navigate = (page: Page) => { onNavigate(page); onClose?.(); };
  return <aside className={`flex h-full flex-col bg-white ${mobile ? "w-[286px] shadow-2xl" : "w-[248px] border-r border-[#e4ebf2]"}`}><div className="flex h-[78px] items-center justify-between border-b border-[#e9eef4] px-6"><Brand />{mobile && <button onClick={onClose} className="rounded-lg p-1 text-[#7086a6] hover:bg-slate-100"><X className="h-5 w-5" /></button>}</div><nav className="flex-1 px-4 py-6"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#91a4c1]">Workspace</p><div className="mt-2 space-y-1">{navItems.map((item) => <NavButton key={item.label} item={item} active={activePage === item.label} onClick={() => navigate(item.label)} />)}</div><p className="mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#91a4c1]">Connect</p><div className="mt-2 space-y-1">{utilityItems.map((item) => <NavButton key={item.label} item={item} active={activePage === item.label} onClick={() => navigate(item.label)} />)}</div></nav><div className="m-4 rounded-2xl bg-[#f5f8fb] p-3"><div className="flex items-center gap-2.5"><Avatar size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#182b49]">Ayesha Khan</p><p className="truncate text-xs text-[#7b91b1]">Process Engineering</p></div><ChevronDown className="h-4 w-4 text-[#8397b4]" /></div></div></aside>;
}

export function ProgressRing({ value, size = 116, stroke = 10, color = "#13aaa2" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashOffset = circumference - (value / 100) * circumference;
  return <div className="relative shrink-0" style={{ width: size, height: size }}><svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${value}% complete`}><circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#dff3f0" strokeWidth={stroke} /><circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-700 ease-out" /></svg><div className="absolute inset-0 grid place-items-center"><div className="text-center"><p className="text-xl font-extrabold tracking-tight text-[#133657]">{value}%</p><p className="text-[9px] font-bold uppercase tracking-wide text-[#7a91af]">complete</p></div></div></div>;
}

export function StatusPill({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = { "To do": "border-[#dce5ef] bg-[#f5f8fb] text-[#687f9f]", "In progress": "border-[#b5e5e1] bg-[#eafaf8] text-[#078e89]", "In review": "border-[#c5d9f4] bg-[#eef6ff] text-[#2472b8]", Completed: "border-[#c9ebd7] bg-[#effbf3] text-[#2c9563]" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

export function PriorityPill({ priority }: { priority: Task["priority"] }) {
  const styles = { High: "bg-[#fff2ee] text-[#d66645]", Medium: "bg-[#fff8e6] text-[#b77b08]", Low: "bg-[#eff4fa] text-[#647fa2]" };
  return <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[priority]}`}>{priority}</span>;
}

export function PanelTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8ca0bc]">{eyebrow}</p>}<h2 className="text-[17px] font-bold tracking-[-0.02em] text-[#132947]">{title}</h2></div>{action}</div>;
}

export function ScheduleItem({ time, title, meta, color }: { time: string; title: string; meta: string; color: string }) {
  return <div className="flex gap-3"><p className="w-9 pt-0.5 text-[11px] font-bold text-[#7188a7]">{time}</p><div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} /><div><p className="text-[13px] font-bold text-[#1b3554]">{title}</p><p className="mt-1 text-[11px] text-[#8096b1]">{meta}</p></div></div>;
}

export function FileRow({ name, meta, type }: { name: string; meta: string; type: "xlsx" | "doc" | "pdf" }) {
  const colors = { xlsx: "bg-[#eaf8ef] text-[#3b9c68]", doc: "bg-[#edf5ff] text-[#3a7ec2]", pdf: "bg-[#fff0ef] text-[#d96b65]" };
  return <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#f7fafc]"><div className={`grid h-9 w-9 place-items-center rounded-lg ${colors[type]}`}><FileText className="h-[17px] w-[17px]" /></div><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold text-[#203957]">{name}</p><p className="mt-0.5 truncate text-[11px] text-[#8499b3]">{meta}</p></div><MoreHorizontal className="h-4 w-4 text-[#a2b3c7]" /></button>;
}

export function TaskListRow({ task, onUpdate, onClick }: { task: Task; onUpdate: (id: number, status: TaskStatus) => void; onClick: () => void }) {
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

export function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-[#edf1f5] pb-4 last:border-0 last:pb-0"><span className="text-sm text-[#7087a6]">{label}</span><span className="text-sm font-extrabold text-[#1a3657]">{value}</span></div>;
}

export function FolderTile({ title, count, people = false }: { title: string; count: string; people?: boolean }) {
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