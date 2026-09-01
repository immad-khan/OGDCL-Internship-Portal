import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OGDCL Internship Portal — Welcome",
  description: "OGDCL unified internship management system for supervisors and interns.",
};

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a1628] px-4 py-16">
      {/* Background radial glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #16b9b0 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #2b7cb8 0%, transparent 70%)" }}
      />

      {/* Logo / Brand */}
      <div className="relative z-10 mb-12 flex flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-energy-500 shadow-[0_0_40px_rgba(22,185,176,0.4)]">
          <div className="relative h-7 w-7">
            <span className="absolute left-0 top-0 h-3 w-3 rounded-sm bg-white" />
            <span className="absolute right-0 top-0 h-3 w-3 rounded-sm bg-brand-200 opacity-80" />
            <span className="absolute bottom-0 left-0 h-3 w-3 rounded-sm bg-brand-200 opacity-80" />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-sm bg-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          OGDCL
        </h1>
        <p className="mt-2 text-lg font-medium tracking-[0.18em] text-brand-400 uppercase">
          Internship Portal
        </p>
        <p className="mt-4 max-w-md text-[15px] text-slate-400">
          One platform for supervisors to manage interns and for interns to track their progress.
        </p>
      </div>

      {/* Role selection cards */}
      <div className="relative z-10 grid w-full max-w-2xl gap-5 sm:grid-cols-2">
        {/* Supervisor card */}
        <Link
          href="/supervisor"
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(22,185,176,0.15)]"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 transition-colors group-hover:bg-brand-500/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Supervisor</h2>
          <p className="mt-2 text-sm text-slate-400">
            Manage interns, assign tasks, review reports, and communicate with your team.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-400 transition-colors group-hover:text-brand-300">
            Enter as Supervisor
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {/* Accent line */}
          <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* Intern card */}
        <Link
          href="/intern"
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-energy-500/50 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(43,124,184,0.15)]"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-energy-500/20 text-energy-400 transition-colors group-hover:bg-energy-500/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Intern</h2>
          <p className="mt-2 text-sm text-slate-400">
            View your assigned tasks, learning modules, schedule, files, and message your supervisor.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-energy-400 transition-colors group-hover:text-energy-300">
            Enter as Intern
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-energy-500 to-energy-400 transition-all duration-500 group-hover:w-full" />
        </Link>
      </div>

      <p className="relative z-10 mt-10 text-xs text-slate-600">
        Oil &amp; Gas Development Company Limited · Internship Management System
      </p>
    </div>
  );
}
