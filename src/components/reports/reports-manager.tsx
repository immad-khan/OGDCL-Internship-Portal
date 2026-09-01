"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { ReportStatusBadge } from "@/components/badge";
import { Modal } from "@/components/modal";
import { IconPlus, IconFile, IconStar, IconSearch } from "@/components/icons";

type Report = {
  id: number;
  title: string;
  content: string | null;
  status: string;
  rating: number | null;
  createdAt: string | Date;
  internId: number | null;
  internName: string | null;
  internDepartment: string | null;
};

type Intern = { id: number; name: string };

const STATUSES = ["draft", "submitted", "approved", "rejected"];
const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

type FormState = { title: string; content: string; internId: string; status: string };
const emptyForm: FormState = { title: "", content: "", internId: "", status: "submitted" };
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function Stars({ value }: { value: number | null }) {
  if (value == null) return <span className="text-xs text-slate-300">Not rated</span>;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconStar
          key={n}
          className={cn("h-3.5 w-3.5", n <= value ? "text-amber-400" : "text-slate-200")}
        />
      ))}
    </span>
  );
}

export function ReportsManager({ reports, interns }: { reports: Report[]; interns: Intern[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Report[]>(reports);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState<Report | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setItems(reports), [reports]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(
    () =>
      items.filter((r) => {
        const q = query.trim().toLowerCase();
        const matchQ = !q || r.title.toLowerCase().includes(q) || (r.internName ?? "").toLowerCase().includes(q);
        const matchS = statusFilter === "all" || r.status === statusFilter;
        return matchQ && matchS;
      }),
    [items, query, statusFilter],
  );

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, internId: interns[0] ? String(interns[0].id) : "" });
    setModalOpen(true);
  }
  function openEdit(r: Report) {
    setEditing(r);
    setForm({
      title: r.title,
      content: r.content ?? "",
      internId: r.internId ? String(r.internId) : "",
      status: r.status,
    });
    setModalOpen(true);
  }

  async function patch(id: number, body: Record<string, unknown>) {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    }
  }

  async function save() {
    if (!form.title.trim()) {
      setToast("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!editing;
      const url = isEdit ? `/api/reports/${editing.id}` : "/api/reports";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, internId: form.internId ? Number(form.internId) : null }),
      });
      if (!res.ok) throw new Error();
      setToast(isEdit ? "Report updated." : "Report created.");
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
      const res = await fetch(`/api/reports/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast("Report deleted.");
      setDeleting(null);
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: reports.length };
    for (const s of STATUSES) c[s] = reports.filter((r) => r.status === s).length;
    return c;
  }, [reports]);

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Internship Reports</h2>
          <p className="text-sm text-slate-500">Review and approve intern progress submissions.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconPlus className="h-4 w-4" /> New Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports or interns..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition",
                statusFilter === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              )}
            >
              {STATUS_LABEL[s] ?? "All"}
              <span className="ml-1 text-xs opacity-70">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <IconFile className="h-7 w-7" />
          </span>
          <p className="mt-4 font-semibold text-slate-700">No reports found</p>
          <p className="mt-1 text-sm text-slate-400">Try a different filter or add a new report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] transition hover:border-brand-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <IconFile className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                    <p className="text-xs text-slate-400">{timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <ReportStatusBadge value={r.status} />
              </div>

              <p className="mt-3 line-clamp-3 text-sm text-slate-500">{r.content || "No description."}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  {r.internName ? (
                    <>
                      <Avatar name={r.internName} size="sm" ring={false} />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{r.internName}</p>
                        <p className="text-[11px] text-slate-400">{r.internDepartment}</p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-slate-300">Unassigned</span>
                  )}
                </div>
                <Stars value={r.rating} />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <select
                  value={r.status}
                  onChange={(e) => patch(r.id, { status: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-500 outline-none focus:border-brand-400"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => patch(r.id, { status: "approved", rating: 5 })}
                  className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Approve
                </button>
                <div className="ml-auto flex gap-1">
                  <button
                    onClick={() => openEdit(r)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(r)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-500 transition hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Report" : "New Report"}
        description="Capture an intern's progress submission."
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
              {saving ? "Saving..." : editing ? "Save changes" : "Create report"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Weekly Progress — Week 5"
              className={inputCls}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Content</span>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              placeholder="Describe the progress, findings and next steps..."
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Intern</span>
              <select
                value={form.internId}
                onChange={(e) => setForm({ ...form, internId: e.target.value })}
                className={inputCls}
              >
                <option value="">Unassigned</option>
                {interns.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-600">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete report?"
        description="This action cannot be undone."
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
              {saving ? "Deleting..." : "Delete report"}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Delete <span className="font-semibold text-slate-900">“{deleting?.title}”</span>?
        </p>
      </Modal>
    </div>
  );
}
