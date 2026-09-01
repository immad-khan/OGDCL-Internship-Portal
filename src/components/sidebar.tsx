"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { OgdcLogo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import {
  IconDashboard,
  IconUsers,
  IconTasks,
  IconMessage,
  IconFile,
  IconSettings,
  IconLogout,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

export function Sidebar({
  supervisor,
  unread,
  open,
  onClose,
}: {
  supervisor: { name: string; designation: string; region: string };
  unread: number;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/supervisor" ? pathname === "/supervisor" : pathname.startsWith(href);

  const overview: NavItem[] = [
    { href: "/supervisor", label: "Dashboard", icon: IconDashboard },
    { href: "/supervisor/interns", label: "Interns", icon: IconUsers },
    { href: "/supervisor/tasks", label: "Tasks", icon: IconTasks },
  ];
  const management: NavItem[] = [
    { href: "/supervisor/messages", label: "Messages", icon: IconMessage, badge: unread },
    { href: "/supervisor/reports", label: "Reports", icon: IconFile },
  ];
  const account: NavItem[] = [{ href: "/supervisor/settings", label: "Settings", icon: IconSettings }];

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-brand-50 text-brand-700"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />
        )}
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 stroke-[1.8]",
            active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600",
          )}
        />
        <span className="flex-1">{item.label}</span>
        {typeof item.badge === "number" && item.badge > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const Section = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mt-5">
      <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <nav className="mt-2 space-y-1">{items.map(renderItem)}</nav>
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-w)] flex-col border-r border-slate-200 bg-white transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <OgdcLogo className="h-10 w-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <Section title="Overview" items={overview} />
        <Section title="Management" items={management} />
        <Section title="Account" items={account} />
      </div>

      {/* Supervisor card */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <Avatar name={supervisor.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{supervisor.name}</p>
            <p className="truncate text-xs text-slate-500">{supervisor.designation}</p>
          </div>
          <Link
            href="/"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
            aria-label="Sign out"
          >
            <IconLogout className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
