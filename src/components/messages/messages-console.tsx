"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn, timeAgo, formatDateTime } from "@/lib/utils";
import { Avatar } from "@/components/avatar";
import { InternStatusBadge } from "@/components/badge";
import {
  IconSearch,
  IconSend,
  IconChevronLeft,
  IconMessage,
} from "@/components/icons";

type Intern = {
  id: number;
  name: string;
  department: string;
  email: string;
  university: string | null;
  status: string;
};

type Conversation = {
  intern: Intern;
  lastMessage: { content: string; role: string; createdAt: string | Date } | null;
  unread: number;
};

type Message = {
  id: number;
  internId: number;
  senderName: string;
  role: string;
  content: string;
  read: boolean;
  createdAt: string | Date;
};

export function MessagesConsole({
  conversations,
  initialId,
  supervisorName,
}: {
  conversations: Conversation[];
  initialId: number | null;
  supervisorName: string;
}) {
  const [convos, setConvos] = useState<Conversation[]>(conversations);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialId ?? conversations[0]?.intern.id ?? null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = convos.find((c) => c.intern.id === selectedId) ?? null;

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.conversations)) setConvos(data.conversations);
    } catch {
      /* ignore */
    }
  }, []);

  const loadMessages = useCallback(async (id: number) => {
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/messages/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages)) setMessages(data.messages);
    } catch {
      /* ignore */
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedId == null) return;
    loadMessages(selectedId);
    loadConversations();
  }, [selectedId, loadMessages, loadConversations]);

  // Poll for new activity
  useEffect(() => {
    const t = setInterval(() => {
      loadConversations();
      if (selectedId != null) loadMessages(selectedId);
    }, 5000);
    return () => clearInterval(t);
  }, [selectedId, loadConversations, loadMessages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMsgs]);

  const filtered = convos.filter((c) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      c.intern.name.toLowerCase().includes(q) ||
      c.intern.department.toLowerCase().includes(q) ||
      (c.lastMessage?.content ?? "").toLowerCase().includes(q)
    );
  });

  function selectConversation(id: number) {
    setSelectedId(id);
    setMobileView("chat");
  }

  async function send() {
    const content = input.trim();
    if (!content || selectedId == null || sending) return;
    setSending(true);
    const optimisticId = Date.now();
    const optimistic: Message = {
      id: optimisticId,
      internId: selectedId,
      senderName: supervisorName,
      role: "supervisor",
      content,
      read: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: selectedId, content, role: "supervisor", senderName: supervisorName }),
      });
      if (!res.ok) throw new Error();
      await loadMessages(selectedId);
      await loadConversations();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setInput(content);
    } finally {
      setSending(false);
    }
  }

  const conversationCount = convos.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
      <div className="flex h-[calc(100vh-8.5rem)] min-h-[520px]">
        {/* Conversation list */}
        <aside
          className={cn(
            "w-full flex-col border-r border-slate-200 md:flex md:w-80 lg:w-88",
            mobileView === "chat" ? "hidden" : "flex",
          )}
        >
          <div className="border-b border-slate-100 p-4">
            <h3 className="text-base font-semibold text-slate-800">Messages</h3>
            <p className="text-xs text-slate-400">{conversationCount} conversations</p>
            <div className="relative mt-3">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-slate-400">No conversations found.</p>
            )}
            {filtered.map((c) => {
              const active = c.intern.id === selectedId;
              return (
                <button
                  key={c.intern.id}
                  onClick={() => selectConversation(c.intern.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3.5 text-left transition",
                    active ? "bg-brand-50/70" : "hover:bg-slate-50",
                  )}
                >
                  <div className="relative">
                    <Avatar name={c.intern.name} size="md" />
                    {c.unread > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-slate-800">{c.intern.name}</p>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {c.lastMessage ? timeAgo(c.lastMessage.createdAt) : ""}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-400">
                      {c.lastMessage
                        ? `${c.lastMessage.role === "supervisor" ? "You: " : ""}${c.lastMessage.content}`
                        : c.intern.department}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat window */}
        <section className={cn("min-w-0 flex-1 flex-col", mobileView === "chat" ? "flex" : "hidden md:flex")}>
          {selected ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <button
                  onClick={() => setMobileView("list")}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 md:hidden"
                  aria-label="Back"
                >
                  <IconChevronLeft className="h-5 w-5" />
                </button>
                <Avatar name={selected.intern.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{selected.intern.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {selected.intern.department} · {selected.intern.email}
                  </p>
                </div>
                <InternStatusBadge value={selected.intern.status} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-slate-50/50 px-4 py-4">
                {loadingMsgs && messages.length === 0 && (
                  <div className="flex justify-center py-10">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                  </div>
                )}
                {messages.length === 0 && !loadingMsgs && (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                      <IconMessage className="h-6 w-6" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-slate-600">No messages yet</p>
                    <p className="text-xs text-slate-400">Start a conversation with {selected.intern.name.split(" ")[0]}.</p>
                  </div>
                )}
                <div className="space-y-3">
                  {messages.map((m) => {
                    const mine = m.role === "supervisor";
                    return (
                      <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                            mine
                              ? "rounded-br-sm bg-gradient-to-br from-brand-600 to-brand-500 text-white"
                              : "rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100",
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                          <p
                            className={cn(
                              "mt-1 flex items-center gap-1 text-[10px]",
                              mine ? "text-white/70" : "text-slate-400",
                            )}
                          >
                            {mine ? "You" : m.senderName} · {formatDateTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Composer */}
              <div className="border-t border-slate-100 p-3">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder={`Message ${selected.intern.name.split(" ")[0]}...`}
                    className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none"
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || sending}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <IconSend className="h-4.5 w-4.5" />
                  </button>
                </div>
                <p className="mt-1.5 px-1 text-[11px] text-slate-400">
                  Press Enter to send · Shift+Enter for a new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <IconMessage className="h-8 w-8" />
              </span>
              <p className="mt-4 font-semibold text-slate-700">Select a conversation</p>
              <p className="mt-1 text-sm text-slate-400">Choose an intern to start messaging.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
