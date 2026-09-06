"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Paperclip, Search, Send } from "lucide-react";
import { Avatar } from "../_components";
import { initials, timeAgo } from "@/lib/utils";

const INTERN_ID = 1;

type ChatMessage = {
  id: number;
  internId: number;
  senderName: string;
  role: string;
  content: string;
  isRead: boolean;
  createdAt: string | Date;
};

export function MessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [supervisorName, setSupervisorName] = useState("Engr. Ahmad Raza");
  const [internName, setInternName] = useState("Ayesha Khan");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const res = await fetch(`/api/intern/messages?internId=${INTERN_ID}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (data.supervisorName) setSupervisorName(data.supervisorName);
      if (data.internName) setInternName(data.internName);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (messages.length && !loading) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    const optimisticId = Date.now();
    const optimistic: ChatMessage = {
      id: optimisticId,
      internId: INTERN_ID,
      senderName: internName,
      role: "intern",
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    try {
      const res = await fetch(`/api/intern/messages?internId=${INTERN_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: INTERN_ID, content }),
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setInput(content);
    } finally {
      setSending(false);
    }
  }

  return <div className="animate-enter">
    <section><p className="text-sm font-semibold text-[#0c9f99]">Connect</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Messages</h1><p className="mt-2 text-[15px] text-[#6981a3]">Ask a question or keep your supervisor up to date.</p></section>
    <div className="mt-7 grid min-h-[570px] overflow-hidden rounded-[20px] border border-[#dfe8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)] md:grid-cols-[270px_1fr]">
      <aside className="border-b border-[#e5edf4] md:border-b-0 md:border-r">
        <div className="border-b border-[#e9eef4] p-4">
          <div className="flex items-center gap-2 rounded-xl bg-[#f4f7fb] px-3 py-2.5 text-[#8195af]">
            <Search className="h-4 w-4" /><span className="text-xs">Search conversations</span>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 border-b border-[#e9eef4] bg-[#ecf9f7] px-4 py-4 text-left transition hover:bg-[#f7fbfb]">
          <Avatar size="sm" initials={initials(supervisorName)} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#1b3553]">{supervisorName}</p>
            <p className="mt-1 truncate text-xs text-[#8095b0]">{messages.length ? messages[messages.length - 1].content : "Supervisor"}</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-[#10a59f]" />
        </button>
      </aside>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3 border-b border-[#e8eef4] px-5 py-4">
          <Avatar size="md" initials={initials(supervisorName)} />
          <div className="flex-1">
            <p className="text-sm font-bold text-[#193453]">{supervisorName}</p>
            <p className="mt-1 text-xs text-[#7990ad]">Supervisor <span className="mx-1">|</span> Online</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-[#8ba0b9]" />
        </div>
        <div className="flex-1 space-y-4 bg-[#fbfcfe] p-5">
          {loading && messages.length === 0 && (
            <div className="flex justify-center py-16">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0d9f99] border-t-transparent" />
            </div>
          )}
          {!loading && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-[#2b4664]">No messages yet</p>
              <p className="mt-1 text-xs text-[#8095b0]">Say hello to {supervisorName.split(" ")[0]} to get started.</p>
            </div>
          )}
          {messages.map((item) => {
            const mine = item.role === "intern";
            return (
              <div key={item.id} className={`max-w-[520px] rounded-2xl p-4 text-sm leading-6 shadow-sm ${mine ? "ml-auto rounded-br-sm bg-[#0d9f99] text-white" : "rounded-tl-sm bg-white text-[#294563]"}`}>
                <p>{item.content}</p>
                <span className={`mt-2 block text-[10px] font-medium ${mine ? "text-[#c5f4ef]" : "text-[#91a2b9]"}`}>{mine ? "You" : item.senderName} | {timeAgo(item.createdAt)}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-[#e8eef4] p-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#dce6ef] px-3 py-2">
            <button className="p-1 text-[#8197b3]"><Paperclip className="h-4 w-4" /></button>
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder={`Message ${supervisorName.split(" ")[0]}...`} className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#2b4664] outline-none placeholder:text-[#98a8be]" />
            <button onClick={send} disabled={!input.trim() || sending} className="grid h-8 w-8 place-items-center rounded-lg bg-[#0d9f99] text-white transition hover:bg-[#078e89] disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </div>
          <p className="mt-1.5 px-1 text-[11px] text-[#98a8be]">Messages are delivered to your supervisor in real time.</p>
        </div>
      </div>
    </div>
  </div>;
}