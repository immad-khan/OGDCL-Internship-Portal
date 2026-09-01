"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type TaskStatus = "To do" | "In progress" | "In review" | "Completed";
type Task = { id: number; title: string; description: string | null; category: string; priority: string; status: TaskStatus; dueDate: string | null };
type Message = { id: number; senderName: string; role: "supervisor" | "intern"; content: string; createdAt: string };
const internId = 1;

const statusStyle: Record<TaskStatus, string> = {
  "To do": "bg-slate-100 text-slate-600", "In progress": "bg-sky-100 text-sky-700",
  "In review": "bg-amber-100 text-amber-700", Completed: "bg-emerald-100 text-emerald-700",
};

export default function InternPortalPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("Intern");
  const [department, setDepartment] = useState("Internship Programme");
  const [supervisor, setSupervisor] = useState("Supervisor");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [taskResponse, messageResponse, profileResponse] = await Promise.all([
          fetch(`/api/intern/tasks?internId=${internId}`), fetch(`/api/intern/messages?internId=${internId}`), fetch(`/api/intern/profile?internId=${internId}`),
        ]);
        if (!taskResponse.ok || !messageResponse.ok || !profileResponse.ok) throw new Error("Could not load your workspace.");
        const [taskData, messageData, profileData] = await Promise.all([taskResponse.json(), messageResponse.json(), profileResponse.json()]);
        if (!mounted) return;
        setTasks(taskData.tasks); setMessages(messageData.messages); setName(profileData.intern.name);
        setDepartment(profileData.intern.department); setSupervisor(profileData.supervisor.name);
      } catch (cause) { if (mounted) setError(cause instanceof Error ? cause.message : "Could not load your workspace."); }
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const progress = useMemo(() => tasks.length ? Math.round((tasks.filter((task) => task.status === "Completed").length / tasks.length) * 100) : 0, [tasks]);
  const dueText = (date: string | null) => date ? new Intl.DateTimeFormat("en-PK", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`)) : "No due date";
  async function sendMessage(event: FormEvent) {
    event.preventDefault(); if (!draft.trim() || sending) return;
    setSending(true); setError("");
    try {
      const response = await fetch("/api/intern/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internId, content: draft.trim() }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Message could not be sent.");
      setMessages((current) => [...current, data.message]); setDraft("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Message could not be sent."); }
    finally { setSending(false); }
  }

  return <main className="min-h-screen bg-[#f5f8fb] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#142a47]">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#079b97] font-extrabold text-white">O</span><span><strong className="block text-lg leading-5">ogdcl</strong><small className="font-semibold uppercase tracking-wider text-slate-400">Internship portal</small></span></Link><div className="text-right"><p className="font-bold text-slate-800">{name}</p><p className="text-sm text-slate-500">{department}</p></div></div></header>
    <div className="mx-auto max-w-7xl px-5 py-8">
      <section className="animate-enter rounded-3xl bg-gradient-to-r from-[#0c7778] to-[#176ea9] p-7 text-white shadow-xl sm:p-10"><p className="text-sm font-semibold text-teal-100">Your internship workspace</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Welcome back, {name.split(" ")[0]}.</h1><p className="mt-3 max-w-xl text-teal-50">Keep your work moving, track assignments, and stay connected with {supervisor}.</p></section>
      {error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      <section className="mt-7 grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-slate-500">Assigned tasks</p><p className="mt-2 text-3xl font-extrabold">{loading ? "—" : tasks.length}</p></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-slate-500">Completed</p><p className="mt-2 text-3xl font-extrabold text-emerald-600">{progress}%</p></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-medium text-slate-500">Your supervisor</p><p className="mt-2 text-xl font-extrabold">{supervisor}</p></article></section>
      <section className="mt-8 grid gap-7 lg:grid-cols-[1.25fr_.75fr]"><div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="font-bold text-slate-900">My tasks</h2><p className="mt-1 text-sm text-slate-500">Assignments from your supervisor</p></div></div><div className="divide-y divide-slate-100">{loading ? <p className="p-6 text-sm text-slate-500">Loading tasks…</p> : tasks.length ? tasks.map((task) => <article key={task.id} className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-slate-800">{task.title}</h3><p className="mt-1 text-sm text-slate-500">{task.description || task.category}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[task.status]}`}>{task.status}</span></div><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{task.category} · {task.priority} priority · {dueText(task.dueDate)}</p></article>) : <p className="p-6 text-sm text-slate-500">No tasks have been assigned yet.</p>}</div></div>
      <div className="flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="font-bold text-slate-900">Messages</h2><p className="mt-1 text-sm text-slate-500">{supervisor}</p></div><div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">{messages.length ? messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-2xl p-3 text-sm ${message.role === "intern" ? "ml-auto bg-[#0d9f99] text-white" : "bg-white text-slate-700 shadow-sm"}`}><p>{message.content}</p><p className={`mt-2 text-[10px] ${message.role === "intern" ? "text-teal-100" : "text-slate-400"}`}>{message.role === "intern" ? "You" : message.senderName}</p></div>) : <p className="text-sm text-slate-500">No messages yet. Start the conversation below.</p>}</div><form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-4"><input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={4000} placeholder="Write a message…" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600"/><button disabled={sending} className="rounded-xl bg-[#0d9f99] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{sending ? "Sending" : "Send"}</button></form></div></section>
    </div>
  </main>;
}
