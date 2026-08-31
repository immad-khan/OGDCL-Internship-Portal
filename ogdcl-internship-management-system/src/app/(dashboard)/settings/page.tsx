import { getSupervisor } from "@/lib/data";
import { SettingsForm } from "@/components/settings/settings-form";
import { Avatar } from "@/components/avatar";
import { IconBuilding, IconMail, IconMap, IconChevronLeft } from "@/components/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const sup = await getSupervisor();

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-700"
      >
        <IconChevronLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div>
        <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500">Manage your supervisor profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col items-center text-center">
            <Avatar name={sup?.name ?? "OGDCL"} size="2xl" ring={false} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{sup?.name}</h3>
            <p className="text-sm text-slate-500">{sup?.designation}</p>
            <span className="mt-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Supervisor
            </span>
          </div>
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <IconMail className="h-4 w-4 text-slate-300" /> {sup?.email}
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <IconBuilding className="h-4 w-4 text-slate-300" /> {sup?.department}
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <IconMap className="h-4 w-4 text-slate-300" /> {sup?.region}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-800">Profile Information</h3>
            <p className="text-sm text-slate-400">Update your details as they appear on reports.</p>
          </div>
          <div className="px-6 py-5">
            <SettingsForm supervisor={sup} />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-800">Notification Preferences</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { label: "New intern messages", desc: "Get notified when an intern sends you a message." },
            { label: "Task status changes", desc: "Receive alerts when a task moves between stages." },
            { label: "Report submissions", desc: "Be notified when an intern submits a report." },
            { label: "Weekly digest", desc: "A summary of activity every Monday morning." },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-slate-700">{pref.label}</p>
                <p className="text-xs text-slate-400">{pref.desc}</p>
              </div>
              <button
                className="relative h-6 w-11 rounded-full bg-brand-600 transition-colors"
                aria-label={pref.label}
              >
                <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
