"use client";

import { ArrowRight, Check, CircleHelp } from "lucide-react";
import { Metric, PanelTitle, ProgressRing } from "../_components";

export function LearningPage() {
  const modules = [["Introduction to process safety", "18 min", true], ["Hazard identification and controls", "32 min", true], ["Permit to Work systems", "28 min", false], ["Isolation and lockout procedures", "24 min", false]] as const;
  return <div className="animate-enter">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0c9f99]">Development plan</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.045em] text-[#10223f]">Learning</h1><p className="mt-2 text-[15px] text-[#6981a3]">Build the core knowledge you need for a strong field placement.</p></div>
      <button className="inline-flex items-center gap-2 self-start rounded-xl border border-[#d9e6ef] bg-white px-4 py-3 text-sm font-bold text-[#486887] hover:bg-[#f7fbfb]"><CircleHelp className="h-4 w-4" /> Need help?</button>
    </section>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="overflow-hidden rounded-[22px] bg-[#243e6b] p-6 text-white sm:p-8">
        <div className="flex max-w-xl flex-col justify-between gap-10 sm:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9db8e7]">Current pathway</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">Process safety essentials</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#c4d3ed]">Understand the everyday controls that protect people, plant and the environment.</p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#28476f] transition hover:bg-[#e9f6f5]">Resume module <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="flex justify-center"><ProgressRing value={75} size={126} stroke={10} color="#a59bff" /></div>
        </div>
      </div>
      <div className="rounded-[20px] border border-[#e0e8f1] bg-white p-6 shadow-[0_8px_22px_rgba(30,62,100,0.035)]">
        <PanelTitle eyebrow="Programme" title="Learning record" />
        <div className="mt-6 space-y-5">
          <Metric label="Modules completed" value="5 / 6" />
          <Metric label="Learning time" value="3h 42m" />
          <Metric label="Assessment score" value="92%" />
        </div>
      </div>
    </div>
    <div className="mt-6 rounded-[20px] border border-[#e0e8f1] bg-white p-5 shadow-[0_8px_22px_rgba(30,62,100,0.035)] sm:p-6">
      <PanelTitle title="Course modules" action={<span className="text-xs font-medium text-[#8195b2]">4 lessons</span>} />
      <div className="mt-4 divide-y divide-[#e9eef4]">
        {modules.map(([title, duration, complete], index) => (
          <div className="flex items-center gap-4 py-4" key={title}>
            <div className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${complete ? "bg-[#e5f8ef] text-[#2d9a66]" : "bg-[#f1f5fa] text-[#6f87a8]"}`}>
              {complete ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#1b3452]">{title}</p>
              <p className="mt-1 text-xs text-[#8398b2]">{duration} {complete ? "| Completed" : "| Ready to start"}</p>
            </div>
            {complete ? <span className="text-xs font-bold text-[#319967]">Done</span> : <button className="rounded-lg bg-[#eaf8f7] px-3 py-2 text-xs font-bold text-[#078e89] hover:bg-[#d8f2ef]">Start</button>}
          </div>
        ))}
      </div>
    </div>
  </div>;
}