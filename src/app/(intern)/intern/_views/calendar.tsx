"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function CalendarPage() {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const events: Record<number, string[]> = { 4: ["Team stand-up"], 8: ["Weekly review"], 12: ["Mid-point review"], 19: ["HSE briefing"], 24: ["Report due"], 27: ["Team stand-up"] };
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Schedule</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Calendar</h1><p className="mt-2 text-[15px] text-[#6981a3]">Plan around your team commitments and coursework.</p></div>
      <button className="inline-flex items-center gap-2 self-start rounded-xl bg-[#0d9f99] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,159,153,0.2)]"><Plus className="h-4 w-4" /> Add event</button>
    </section>
    <div className="mt-7 overflow-hidden rounded-[20px] border border-[#e0e8f1] bg-white shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
      <div className="flex items-center justify-between border-b border-[#e8eef4] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-1.5 text-[#6f87a7] hover:bg-[#f2f6f9]"><ChevronLeft className="h-4 w-4" /></button>
          <h2 className="text-lg font-bold text-[#17304f]">September 2026</h2>
          <button className="rounded-lg p-1.5 text-[#6f87a7] hover:bg-[#f2f6f9]"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <button className="rounded-lg border border-[#dde7f0] px-3 py-1.5 text-xs font-bold text-[#55718f]">Today</button>
      </div>
      <div className="grid grid-cols-7 border-l border-t border-[#e8eef4]">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="border-b border-r border-[#e8eef4] bg-[#f8fafc] px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#8a9db6]">{day}</div>
        ))}
        <div className="hidden min-h-[98px] border-b border-r border-[#e8eef4] p-2 sm:block" />
        {days.map((day) => (
          <div className={`min-h-[75px] border-b border-r border-[#e8eef4] p-2 sm:min-h-[102px] ${day === 24 ? "bg-[#f3fbfa]" : ""}`} key={day}>
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${day === 24 ? "bg-[#0d9f99] text-white" : "text-[#56708f]"}`}>{day}</span>
            {events[day]?.map((event) => (
              <p key={event} className="mt-2 truncate rounded bg-[#e9f7f5] px-1.5 py-1 text-[9px] font-bold text-[#078e89] sm:text-[10px]">{event}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>;
}