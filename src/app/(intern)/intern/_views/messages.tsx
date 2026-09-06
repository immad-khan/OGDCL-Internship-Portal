"use client";

import { useState } from "react";
import { MoreHorizontal, Paperclip, Search, Send } from "lucide-react";
import { Avatar } from "../_components";

export function MessagesPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ from: "supervisor", text: "Nice work, Ayesha. Please attach the sensitivity analysis when it is ready.", time: "10:02 AM" }]);
  const sendMessage = () => { if (message.trim()) { setMessages((current) => [...current, { from: "me", text: message.trim(), time: "Now" }]); setMessage(""); } };
  const contacts = [["Engr. Ahmad Raza", "Supervisor", "ER"], ["Fatima Noor", "Electrical Engineering", "FN"], ["Usman Malik", "IT Department", "UM"], ["HSE Support", "Safety & Environment", "HS"]];
  return <div className="animate-enter">
    <section><p className="text-sm font-semibold text-[#0c9f99]">Connect</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Messages</h1><p className="mt-2 text-[15px] text-[#6981a3]">Ask a question or keep your supervisor up to date.</p></section>
    <div className="mt-7 grid min-h-[570px] overflow-hidden rounded-[20px] border border-[#dfe8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)] md:grid-cols-[270px_1fr]">
      <aside className="border-b border-[#e5edf4] md:border-b-0 md:border-r">
        <div className="border-b border-[#e9eef4] p-4">
          <div className="flex items-center gap-2 rounded-xl bg-[#f4f7fb] px-3 py-2.5 text-[#8195af]">
            <Search className="h-4 w-4" /><span className="text-xs">Search conversations</span>
          </div>
        </div>
        {contacts.map(([name, role, initials], index) => (
          <button key={name} className={`flex w-full items-center gap-3 border-b border-[#e9eef4] px-4 py-4 text-left transition hover:bg-[#f7fbfb] ${index === 0 ? "bg-[#ecf9f7]" : ""}`}>
            <Avatar size="sm" initials={initials} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1b3553]">{name}</p>
              <p className="mt-1 truncate text-xs text-[#8095b0]">{index === 0 ? "Please attach the sensitivity..." : role}</p>
            </div>
            {index === 0 && <span className="h-2 w-2 rounded-full bg-[#10a59f]" />}
          </button>
        ))}
      </aside>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3 border-b border-[#e8eef4] px-5 py-4">
          <Avatar size="md" initials="ER" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[#193453]">Engr. Ahmad Raza</p>
            <p className="mt-1 text-xs text-[#7990ad]">Supervisor <span className="mx-1">|</span> Online</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-[#8ba0b9]" />
        </div>
        <div className="flex-1 space-y-4 bg-[#fbfcfe] p-5">
          <div className="max-w-[490px] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-[#284361] shadow-sm">
            <p>Sir, I finished the first simulation run of the separator train. The recovery improved by about 2.1%.</p>
            <span className="mt-2 block text-[10px] font-medium text-[#91a2b9]">Ayesha Khan | 10:02 AM</span>
          </div>
          {messages.map((item, index) => (
            <div key={index} className={`max-w-[520px] rounded-2xl p-4 text-sm leading-6 shadow-sm ${item.from === "me" ? "ml-auto rounded-br-sm bg-[#0d9f99] text-white" : "rounded-tl-sm bg-white text-[#294563]"}`}>
              <p>{item.text}</p>
              <span className={`mt-2 block text-[10px] font-medium ${item.from === "me" ? "text-[#c5f4ef]" : "text-[#91a2b9]"}`}>{item.from === "me" ? "You" : "Engr. Ahmad Raza"} | {item.time}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#e8eef4] p-4">
          <div className="flex items-center gap-2 rounded-xl border border-[#dce6ef] px-3 py-2">
            <button className="p-1 text-[#8197b3]"><Paperclip className="h-4 w-4" /></button>
            <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Write a message..." className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#2b4664] outline-none placeholder:text-[#98a8be]" />
            <button onClick={sendMessage} className="grid h-8 w-8 place-items-center rounded-lg bg-[#0d9f99] text-white hover:bg-[#078e89]"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>;
}