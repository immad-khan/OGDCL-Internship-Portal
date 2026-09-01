"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { InternStatusBadge } from "@/components/badge";
import { Modal } from "@/components/modal";
import {
  IconPlus,
  IconSearch,
  IconUsers,
  IconChevronRight,
  IconMail,
  IconStudy,
  IconBuilding,
} from "@/components/icons";

type Intern = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  department: string;
  university: string | null;
  degree: string | null;
  cgpa: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  taskCount: number;
  completedCount: number;
};

const DEPARTMENTS = [
  "Petroleum Engineering",
  "Geology",
  "Chemical Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "IT & Digital",
  "Finance",
  "Human Resources",
  "HSE",
];

const STATUSES = ["active", "on_hold", "completed", "pending"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  department: string;
  university: string;
  degree: string;
  cgpa: string;
  startDate: string;
  endDate: string;
  status: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  department: DEPARTMENTS[0],
  university: "",
  degree: "",
  cgpa: "",
  startDate: "",
  endDate: "",
  status: "active",
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function InternsManager({
  interns,
  initialNew,
}: {
  interns: Intern[];
  initialNew: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [dept, setDept] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Intern | null>(null);
  const [deleting, setDeleting] = useState<Intern | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialNew) setModalOpen(true);
  }, [initialNew]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return interns.filter((i) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q);
      const matchS = status === "all" || i.status === status;
      const matchD = dept === "all" || i.department === dept;
      return matchQ && matchS && matchD;
    });
  }, [interns, query, status, dept]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }
  function openEdit(intern: Intern) {
    setEditing(intern);
    setForm({
      name: intern.name,
      email: intern.email,
      phone: intern.phone ?? "",
      department: intern.department,
      university: intern.university ?? "",
      degree: intern.degree ?? "",
      cgpa: intern.cgpa ?? "",
      startDate: intern.startDate ?? "",
      endDate: intern.endDate ?? "",
      status: intern.status,
    });
    setModalOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) {
      setToast("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing;
      const url = isEdit ? `/api/interns/${editing.id}` : "/api/interns";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setToast(isEdit ? "Intern updated." : "Intern added.");
      setModalOpen(false);
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleting) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/interns/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Request failed");
      setToast("Intern removed.");
      setDeleting(null);
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const active = interns.filter((i) => i.status === "active").length;
    const departments = new Set(interns.map((i) => i.department).filter(Boolean)).size;
    return { total: interns.length, active, departments };
  }, [interns]);

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Intern Pool</h2>
          <p className="text-sm text-slate-500">
            {stats.total} interns · {stats.active} active · {stats.departments} departments
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconPlus className="h-4 w-4" /> Add Intern
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or department..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-brand-300"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-brand-300"
        >
          <option value="all">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <IconUsers className="h-7 w-7" />
          </span>
          <p className="mt-4 font-semibold text-slate-700">No interns found</p>
          <p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) => {
            const pct = i.taskCount ? Math.round((i.completedCount / i.taskCount) * 100) : 0;
            return (
              <div
                key={i.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] transition hover:border-brand-200 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={i.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/supervisor/interns/${i.id}`}
                      className="flex items-center gap-1 text-base font-semibold text-slate-800 hover:text-brand-700"
                    >
                      <span className="truncate">{i.name}</span>
                      <IconChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-brand-500" />
                    </Link>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <IconMail className="h-3.5 w-3.5" /> <span className="truncate">{i.email}</span>
                    </p>
                  </div>
                  <InternStatusBadge value={i.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <IconBuilding className="h-4 w-4 text-slate-300" />
                    <span className="truncate">{i.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <IconStudy className="h-4 w-4 text-slate-300" />
                    <span className="truncate">{i.university ?? "—"}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {i.completedCount}/{i.taskCount} tasks done
                    </span>
                    <span className="font-semibold text-brand-600">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">
                    {formatDate(i.startDate)} → {formatDate(i.endDate)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(i)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(i)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-500 transition hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Intern" : "Add New Intern"}
        description={editing ? "Update the intern's profile details." : "Register a new intern in the supervision pool."}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Add intern"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Fatima Noor"
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@ogdcl.com"
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+92 3xx xxxxxxx"
              className={inputCls}
            />
          </Field>
          <Field label="Department">
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className={inputCls}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="University">
            <input
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
              placeholder="e.g. NUST"
              className={inputCls}
            />
          </Field>
          <Field label="Degree">
            <input
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              placeholder="e.g. BSc Petroleum Engineering"
              className={inputCls}
            />
          </Field>
          <Field label="CGPA">
            <input
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              placeholder="e.g. 3.75"
              className={inputCls}
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputCls}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Start date">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Remove intern?"
        description="This permanently removes the intern and all of their tasks, messages and reports."
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleting(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={remove}
              disabled={saving}
              className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              {saving ? "Deleting..." : "Delete intern"}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          You&apos;re about to delete <span className="font-semibold text-slate-900">{deleting?.name}</span>. This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
