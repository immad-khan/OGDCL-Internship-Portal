"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { IconMenu, IconSearch, IconBell } from "@/components/icons";

const TITLES: Array<[string, string]> = [
  ["/interns/", "Intern Profile"],
  ["/interns", "Interns"],
  ["/tasks", "Tasks"],
  ["/messages", "Messages"],
  ["/reports", "Reports"],
  ["/settings", "Settings"],
];

function pageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard";
  const match = TITLES.find(([prefix]) => pathname.startsWith(prefix));
  if (match) return match[1];
  return "Dashboard";
}

export function Header({
  supervisor,
  unread,
  onMenu,
}: {
  supervisor: { name: string; designation: string };
  unread: number;
  onMenu: () => void;
}) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <IconMenu />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-slate-800">{pageTitle(pathname)}</h1>
        <p className="hidden text-xs text-slate-400 sm:block">OGDCL Internship Management</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500 md:flex">
          <IconSearch className="h-4 w-4 text-slate-400" />
          <input
            className="w-40 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Search... "
          />
        </div>

        <button
          className="relative rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <IconBell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </button>

        <div className="ml-1 flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-colors hover:bg-slate-100">
          <Avatar name={supervisor.name} size="sm" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-800">{supervisor.name}</p>
            <p className="text-[11px] leading-tight text-slate-400">Supervisor</p>
          </div>
        </div>
      </div>
    </header>
  );
}
