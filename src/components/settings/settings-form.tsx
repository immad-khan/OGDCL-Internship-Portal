"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Sup = {
  name: string;
  email: string;
  designation: string;
  department: string;
  phone: string | null;
  region: string | null;
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export function SettingsForm({ supervisor }: { supervisor: Sup | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: supervisor?.name ?? "",
    email: supervisor?.email ?? "",
    designation: supervisor?.designation ?? "",
    department: supervisor?.department ?? "",
    phone: supervisor?.phone ?? "",
    region: supervisor?.region ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function save() {
    if (!form.name.trim() || !form.email.trim()) {
      setToast("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/supervisor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setToast("Profile updated.");
      router.refresh();
    } catch {
      setToast("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
          {toast}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Designation">
          <input
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Department">
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Region / Office">
          <input
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
