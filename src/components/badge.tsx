import { cn } from "@/lib/utils";

const INTERN_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  active: { label: "Active", cls: "bg-brand-50 text-brand-700 ring-brand-200", dot: "bg-brand-500" },
  on_hold: { label: "On Hold", cls: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  completed: { label: "Completed", cls: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
  pending: { label: "Pending", cls: "bg-energy-50 text-energy-700 ring-energy-200", dot: "bg-energy-500" },
};

const TASK_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  todo: { label: "To Do", cls: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
  in_progress: { label: "In Progress", cls: "bg-energy-50 text-energy-700 ring-energy-200", dot: "bg-energy-500" },
  review: { label: "Review", cls: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
};

const PRIORITY: Record<string, { label: string; cls: string; dot: string }> = {
  low: { label: "Low", cls: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
  medium: { label: "Medium", cls: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  high: { label: "High", cls: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  urgent: { label: "Urgent", cls: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
};

const REPORT_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  draft: { label: "Draft", cls: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
  submitted: { label: "Submitted", cls: "bg-energy-50 text-energy-700 ring-energy-200", dot: "bg-energy-500" },
  approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", cls: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
};

function DotBadge({
  value,
  map,
}: {
  value: string;
  map: Record<string, { label: string; cls: string; dot: string }>;
}) {
  const meta = map[value] ?? { label: value, cls: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.cls,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function InternStatusBadge({ value }: { value: string }) {
  return <DotBadge value={value} map={INTERN_STATUS} />;
}
export function TaskStatusBadge({ value }: { value: string }) {
  return <DotBadge value={value} map={TASK_STATUS} />;
}
export function PriorityBadge({ value }: { value: string }) {
  return <DotBadge value={value} map={PRIORITY} />;
}
export function ReportStatusBadge({ value }: { value: string }) {
  return <DotBadge value={value} map={REPORT_STATUS} />;
}

export function PlainBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200",
        className,
      )}
    >
      {children}
    </span>
  );
}
