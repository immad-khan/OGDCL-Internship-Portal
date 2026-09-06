import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { LogOut } from "@/components/icons";
import { signOut } from "@/app/login/actions";
import type { SafeUser } from "@/lib/auth";

type NavItem = { href: string; label: string; icon: ReactNode; badge?: number };
type NavGroup = { heading: string; items: NavItem[] };

export function initials(name: string): string {
  return name
    .replace(/^(Engr\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell({
  user,
  title,
  subtitle,
  nav,
  activeHref,
  children,
}: {
  user: SafeUser;
  title: string;
  subtitle: string;
  nav: NavGroup[];
  activeHref: string;
  children: ReactNode;
}) {
  const roleLabel = user.role === "supervisor" ? "Supervisor" : "Intern";

  return (
    <div className="flex min-h-screen bg-navy-50">
      {/* Sidebar */}
      <aside className="hidden w-[272px] shrink-0 flex-col border-r border-navy-100 bg-white md:flex">
        <div className="flex h-[72px] items-center border-b border-navy-100 px-5">
          <Brand href={user.role === "supervisor" ? "/supervisor" : "/intern"} compact />
          <span className="ml-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-500">
            {roleLabel} portal
          </span>
        </div>

        <nav className="flex-1 space-y-7 px-4 py-6">
          {nav.map((group) => (
            <div key={group.heading}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-400">
                {group.heading}
              </p>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const active = item.href === activeHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex h-11 items-center gap-3 rounded px-3 text-[14.5px] transition ${
                          active
                            ? "bg-brand-50 font-semibold text-brand-800 ring-1 ring-brand-100"
                            : "text-navy-700 hover:bg-navy-50"
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className={active ? "text-brand-700" : "text-navy-400"}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge ? (
                          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-navy-100 px-1.5 text-[11px] font-semibold text-navy-700">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-navy-100 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-950 text-[13px] font-semibold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[14px] font-semibold text-navy-900">{user.name}</p>
              <p className="m-0 truncate text-[12px] text-navy-500">
                {user.designation ?? user.institution ?? roleLabel}
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                title="Sign out"
                className="grid h-9 w-9 place-items-center rounded text-navy-500 hover:bg-navy-50 hover:text-navy-900"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-navy-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Brand href={user.role === "supervisor" ? "/supervisor" : "/intern"} compact />
            </div>
            <div>
              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-400">
                {subtitle}
              </p>
              <h1 className="m-0 text-[20px] font-semibold leading-tight text-navy-900">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="m-0 text-[14px] font-semibold text-navy-900">{user.name}</p>
              <p className="m-0 text-[12px] text-navy-500">
                {roleLabel}
                {user.employeeNo ? ` · ${user.employeeNo}` : ""}
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-[13px] font-semibold text-white">
              {initials(user.name)}
            </span>
            <form action={signOut} className="md:hidden">
              <button
                type="submit"
                title="Sign out"
                className="grid h-9 w-9 place-items-center rounded text-navy-500 hover:bg-navy-50"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    todo: { label: "To do", cls: "bg-navy-100 text-navy-700" },
    in_progress: { label: "In progress", cls: "bg-blue-50 text-blue-800 ring-1 ring-blue-100" },
    review: { label: "Under review", cls: "bg-amber-50 text-amber-800 ring-1 ring-amber-100" },
    done: { label: "Completed", cls: "bg-brand-50 text-brand-800 ring-1 ring-brand-100" },
  };
  const s = map[status] ?? { label: status, cls: "bg-navy-100 text-navy-700" };
  return (
    <span
      className={`inline-flex h-6 items-center rounded px-2 text-[12px] font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(`${value}T00:00:00`) : value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
