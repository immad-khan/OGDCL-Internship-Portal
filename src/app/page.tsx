import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { MarketingBrand as Brand } from "@/components/marketing-brand";
import { Reveal } from "@/components/reveal";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ClipboardCheck,
  FileText,
  Grid,
  Lock,
  MessageSquare,
  Search,
  ShieldCheck,
  TrendUp,
  UserPlus,
  Users,
} from "@/components/icons";

const HERO_IMAGE =
  "https://images.pexels.com/photos/18560234/pexels-photo-18560234.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1920";

const navLinks = [
  { href: "#programme", label: "Programme" },
  { href: "#workflow", label: "Workflow" },
  { href: "#portals", label: "Portals" },
  { href: "#governance", label: "Governance" },
];

const steps = [
  {
    n: "01",
    icon: UserPlus,
    title: "Onboard the intern",
    body: "HR registers the intern, attaches them to a department and a named supervising officer. Portal credentials are issued on the same day.",
    tags: ["HR registration", "Department mapping", "Credential issue"],
  },
  {
    n: "02",
    icon: ClipboardCheck,
    title: "Assign deliverables",
    body: "Supervisors define tasks with clear due dates and acceptance criteria. Interns see exactly what is expected, and when.",
    tags: ["Due dates", "Acceptance criteria", "Priority"],
  },
  {
    n: "03",
    icon: FileText,
    title: "Track weekly progress",
    body: "Interns update task status and submit weekly reports in the OGDCL template. Every update is time-stamped and attributable.",
    tags: ["Weekly reports", "Status updates", "Audit trail"],
  },
  {
    n: "04",
    icon: BarChart,
    title: "Review and evaluate",
    body: "Mid-point and final reviews are recorded against the placement plan, giving HR a consistent, comparable evaluation record.",
    tags: ["Mid-point review", "Final evaluation", "Structured scoring"],
  },
  {
    n: "05",
    icon: Award,
    title: "Close out and certify",
    body: "On completion the record is archived and the internship certificate is generated from verified data — no manual re-keying.",
    tags: ["Certificate", "Archive", "HR record"],
  },
];

const internFeatures = [
  { icon: ClipboardCheck, text: "Assigned deliverables with clear due dates and status" },
  { icon: FileText, text: "Weekly report submission in the OGDCL standard format" },
  { icon: BookOpen, text: "Department learning material and HSE induction content" },
  { icon: MessageSquare, text: "Direct, logged communication with the supervising officer" },
];

const supervisorFeatures = [
  { icon: Users, text: "Single view of every intern under supervision" },
  { icon: Activity, text: "Task completion and report status at a glance" },
  { icon: Calendar, text: "Placement calendar with review milestones" },
  { icon: ShieldCheck, text: "Structured evaluations retained for HR records" },
];

const governance = [
  {
    icon: Lock,
    title: "Role-based access",
    body: "Interns and supervisors see only what is relevant to their placement. Sessions are server-side, httpOnly and time-limited.",
  },
  {
    icon: Activity,
    title: "Complete audit trail",
    body: "Every task update, report submission and evaluation is time-stamped and attributable to a named user.",
  },
  {
    icon: ShieldCheck,
    title: "Data confidentiality",
    body: "Placement data is held within OGDCL infrastructure and handled in line with corporate information policy.",
  },
];

function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.24em] text-brand-400">
      {index} — {text}
    </p>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 selection:bg-brand-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Brand variant="dark" />
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[14px] font-medium text-ink-200 transition hover:text-brand-400"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login?role=supervisor"
              className="hidden h-10 items-center rounded-md border border-white/10 px-4 text-[14px] font-medium text-ink-100 transition hover:border-brand-400/40 hover:text-white md:inline-flex"
            >
              Supervisor
            </Link>
            <Link
              href="/login?role=intern"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-500 px-4 text-[14px] font-semibold text-ink-950 transition hover:bg-brand-400"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative isolate overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden
            className="hero-photo absolute inset-0 -z-30 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 -z-20 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/55"
            aria-hidden
          />
          <div
            className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/60"
            aria-hidden
          />
          <div className="grid-overlay absolute inset-0 -z-10" aria-hidden />
          <div
            className="absolute -left-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-[140px]"
            aria-hidden
          />

          <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-32 lg:pt-28">
            <div className="lg:col-span-7">
              <p className="anim-fade-up inline-flex items-center gap-3 rounded-full border border-brand-400/25 bg-brand-500/10 py-1.5 pl-2 pr-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-brand-400" />
                Internship Programme · Corporate Portal
              </p>
              <h1 className="anim-fade-up anim-delay-1 mt-7 max-w-2xl text-[44px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[60px]">
                Internship <span className="text-brand-400">Management</span> System
              </h1>
              <p className="anim-fade-up anim-delay-2 mt-7 max-w-xl text-[17px] leading-relaxed text-ink-200">
                A single, secure platform for OGDCL to administer internship placements
                across exploration, production and corporate functions — from onboarding
                and task allocation to supervised evaluation and certification.
              </p>
              <div className="anim-fade-up anim-delay-3 mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-brand-500 px-6 text-[15px] font-semibold text-ink-950 transition hover:bg-brand-400"
                >
                  Sign in to the portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#workflow"
                  className="inline-flex h-12 items-center rounded-md border border-white/15 px-6 text-[15px] font-medium text-white transition hover:border-brand-400/50 hover:bg-white/5"
                >
                  See how it works
                </a>
              </div>
              <dl className="anim-fade-up anim-delay-4 mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  ["Placement", "6–12 weeks"],
                  ["Review cycle", "Weekly"],
                  ["Access", "Role-based"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px] uppercase tracking-wider text-ink-300">{k}</dt>
                    <dd className="mt-1 text-[22px] font-semibold text-white">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Access panel */}
            <div className="anim-fade-up anim-delay-2 lg:col-span-5">
              <div className="drift relative">
                <div
                  className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-400/40 via-white/5 to-transparent opacity-70"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850/90 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                  {/* Mini dashboard preview */}
                  <div className="border-b border-white/[0.06] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="pulse-dot h-2 w-2 rounded-full bg-brand-400" />
                        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-300">
                          Live placement view
                        </p>
                      </div>
                      <span className="rounded-full border border-brand-400/30 bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-300">
                        On track
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-5">
                      <div className="relative h-[84px] w-[84px] shrink-0">
                        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#2dd4bf"
                            strokeWidth="9"
                            strokeLinecap="round"
                            className="ring-draw"
                            style={
                              {
                                "--ring-total": 2 * Math.PI * 42,
                                strokeDasharray: 2 * Math.PI * 42,
                                strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.64),
                              } as CSSProperties
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="text-[18px] font-semibold text-white">64%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="m-0 text-[15px] font-semibold text-white">Placement progress</p>
                        <p className="m-0 mt-0.5 text-[12.5px] text-ink-300">Week 7 of 12 · Reservoir Engineering</p>
                        <div className="mt-3 space-y-2">
                          {[
                            ["Completed", 5, "bg-brand-400"],
                            ["Under review", 2, "bg-amber-400"],
                            ["In progress", 1, "bg-sky-400"],
                          ].map(([label, n, c]) => (
                            <div key={label as string} className="flex items-center gap-2 text-[12px]">
                              <span className={`h-1.5 w-1.5 rounded-full ${c}`} />
                              <span className="flex-1 text-ink-300">{label}</span>
                              <span className="font-semibold text-ink-100">{n}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        ["Interns", "148"],
                        ["Departments", "22"],
                        ["Reports / wk", "140+"],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                          <p className="m-0 text-[10.5px] uppercase tracking-wider text-ink-400">{k}</p>
                          <p className="m-0 text-[16px] font-semibold text-white">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Role entry */}
                  <div className="p-3">
                    <p className="m-0 px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                      Enter the portal
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="/login?role=intern"
                        className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition hover:border-brand-400/40 hover:bg-brand-500/[0.07]"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/30">
                          <BookOpen className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold text-white">Intern</span>
                          <span className="block text-[12.5px] text-ink-300">
                            Tasks · weekly reports · learning · schedule
                          </span>
                        </span>
                        <ArrowRight className="h-5 w-5 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-brand-300" />
                      </Link>
                      <Link
                        href="/login?role=supervisor"
                        className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition hover:border-brand-400/40 hover:bg-brand-500/[0.07]"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-ink-100 ring-1 ring-white/10">
                          <Users className="h-5 w-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold text-white">Supervisor</span>
                          <span className="block text-[12.5px] text-ink-300">
                            Roster · task allocation · reviews · evaluations
                          </span>
                        </span>
                        <ArrowRight className="h-5 w-5 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-brand-300" />
                      </Link>
                    </div>
                    <p className="m-0 flex items-center gap-2 px-2 pb-1 pt-3 text-[11.5px] text-ink-400">
                      <Lock className="h-3.5 w-3.5" />
                      Restricted to registered OGDCL interns and supervising officers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Programme ---------------- */}
        <section id="programme" className="relative border-t border-white/[0.06] bg-ink-900">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              <Reveal from="left" className="lg:col-span-5">
                <SectionLabel index="01" text="The programme" />
                <h2 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[42px]">
                  Structured placements with{" "}
                  <span className="text-brand-400">accountable supervision</span>
                </h2>
                <p className="mt-6 text-[16px] leading-relaxed text-ink-200">
                  Every intern is attached to a named supervising officer who sets
                  deliverables, reviews progress on a weekly cycle and completes a formal
                  evaluation at the end of the placement. The system replaces paper forms
                  and disconnected spreadsheets with one record for every placement.
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Exploration & Production",
                    "Engineering & Technical Services",
                    "Finance, HR & Corporate",
                    "Field locations & Head Office",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[14.5px] text-ink-100">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                {[
                  { icon: Users, k: "148", l: "Interns placed this cycle", d: 0 },
                  { icon: Grid, k: "22", l: "Departments participating", d: 100 },
                  { icon: TrendUp, k: "96%", l: "Weekly reports submitted on time", d: 200 },
                  { icon: Award, k: "100%", l: "Evaluations recorded against the plan", d: 300 },
                ].map((s) => (
                  <Reveal key={s.l} delay={s.d} className="card-dark rounded-2xl p-6 transition">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/10 text-brand-400 ring-1 ring-brand-400/20">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <p className="m-0 mt-6 text-[38px] font-semibold leading-none tracking-tight text-white">
                      {s.k}
                    </p>
                    <p className="m-0 mt-2 text-[13.5px] text-ink-300">{s.l}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Workflow timeline ---------------- */}
        <section id="workflow" className="relative overflow-hidden bg-ink-950">
          <div
            className="absolute left-1/2 top-0 -z-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/[0.07] blur-[160px]"
            aria-hidden
          />
          <div className="noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />

          <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-3xl text-center">
              <SectionLabel index="02" text="The workflow" />
              <h2 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[52px]">
                From onboarding to <span className="text-brand-400">certificate</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-200">
                One continuous, supervised journey — no more hopping between email threads,
                spreadsheets and paper forms to manage a single placement.
              </p>
            </Reveal>

            <div className="relative mt-20">
              {/* Vertical line */}
              <div
                className="timeline-line absolute left-[27px] top-0 h-full w-px md:left-1/2 md:-translate-x-px"
                aria-hidden
              />

              <ol className="space-y-16 md:space-y-24">
                {steps.map((s, i) => {
                  const left = i % 2 === 0;
                  return (
                    <li key={s.n} className="relative md:grid md:grid-cols-2 md:gap-16">
                      {/* Node */}
                      <div className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2">
                        <Reveal from="none" delay={80}>
                          <span className="glow-green grid h-14 w-14 place-items-center rounded-xl bg-ink-850 text-brand-400">
                            <s.icon className="h-6 w-6" />
                          </span>
                        </Reveal>
                      </div>

                      {/* Card */}
                      <div
                        className={`pl-20 md:pl-0 ${
                          left ? "md:col-start-1 md:pr-6" : "md:col-start-2 md:pl-6"
                        }`}
                      >
                        <Reveal from={left ? "left" : "right"}>
                          <article className="card-dark rounded-2xl p-7 transition sm:p-8">
                            <div className="flex items-start justify-between">
                              <span className="text-[40px] font-semibold italic leading-none tracking-tight text-white/10">
                                {s.n}
                              </span>
                              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                                Step {i + 1}
                              </span>
                            </div>
                            <h3 className="mt-5 text-[22px] font-semibold leading-tight text-white">
                              {s.title}
                            </h3>
                            <p className="mt-3 text-[15px] leading-relaxed text-ink-200">{s.body}</p>
                            <ul className="mt-6 flex flex-wrap gap-2">
                              {s.tags.map((t) => (
                                <li
                                  key={t}
                                  className="rounded-md border border-brand-400/25 bg-brand-500/10 px-2.5 py-1 text-[12px] font-semibold text-brand-300"
                                >
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </article>
                        </Reveal>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------- Portals ---------------- */}
        <section id="portals" className="border-t border-white/[0.06] bg-ink-900">
          <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
            <Reveal className="max-w-2xl">
              <SectionLabel index="03" text="Two portals, one record" />
              <h2 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[44px]">
                Built for the people <span className="text-brand-400">doing the work</span>
              </h2>
            </Reveal>

            {/* Intern */}
            <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
              <Reveal from="left" className="lg:col-span-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-500/10 px-3 py-1 text-[12px] font-semibold text-brand-300">
                  <BookOpen className="h-3.5 w-3.5" /> Intern portal
                </span>
                <h3 className="mt-5 text-[28px] font-semibold leading-tight text-white">
                  Know exactly what is expected — and how you are doing
                </h3>
                <ul className="mt-7 space-y-4">
                  {internFeatures.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                      <span className="text-[15px] text-ink-100">{text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login?role=intern"
                  className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-brand-500 px-5 text-[14px] font-semibold text-ink-950 hover:bg-brand-400"
                >
                  Intern sign in <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>

              <Reveal from="right" className="lg:col-span-7">
                <InternPreview />
              </Reveal>
            </div>

            {/* Supervisor */}
            <div className="mt-24 grid items-center gap-12 lg:grid-cols-12">
              <Reveal from="left" className="order-2 lg:order-1 lg:col-span-7">
                <SupervisorPreview />
              </Reveal>
              <Reveal from="right" className="order-1 lg:order-2 lg:col-span-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-ink-100">
                  <Users className="h-3.5 w-3.5" /> Supervisor portal
                </span>
                <h3 className="mt-5 text-[28px] font-semibold leading-tight text-white">
                  Supervise without the paperwork
                </h3>
                <ul className="mt-7 space-y-4">
                  {supervisorFeatures.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                      <span className="text-[15px] text-ink-100">{text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login?role=supervisor"
                  className="mt-8 inline-flex h-11 items-center gap-2 rounded-md border border-white/15 px-5 text-[14px] font-semibold text-white hover:border-brand-400/50 hover:bg-white/5"
                >
                  Supervisor sign in <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- Governance ---------------- */}
        <section id="governance" className="relative overflow-hidden bg-ink-950">
          <div className="noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
            <Reveal className="max-w-2xl">
              <SectionLabel index="04" text="Governance & security" />
              <h2 className="mt-4 text-[34px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[44px]">
                Built for a regulated, <span className="text-brand-400">listed enterprise</span>
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-200">
                Designed to meet OGDCL&apos;s internal control requirements for personnel
                records and information handling.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {governance.map((g, i) => (
                <Reveal key={g.title} delay={i * 120} className="card-dark group rounded-2xl p-7 transition">
                  <span className="glow-green grid h-12 w-12 place-items-center rounded-xl bg-ink-850 text-brand-400">
                    <g.icon className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-7 text-[19px] font-semibold text-white">{g.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-200">{g.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="relative overflow-hidden border-t border-white/[0.06] bg-ink-900">
          <div
            className="absolute left-1/2 top-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/15 blur-[140px]"
            aria-hidden
          />
          <Reveal className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 lg:px-8">
            <h2 className="text-[36px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[48px]">
              Access the <span className="text-brand-400">portal</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] text-ink-200">
              Use the credentials issued by the Human Resources Department. For access
              issues, contact the portal support desk.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/login?role=intern"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-brand-500 px-6 text-[15px] font-semibold text-ink-950 hover:bg-brand-400"
              >
                Intern sign in <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login?role=supervisor"
                className="inline-flex h-12 items-center rounded-md border border-white/15 px-6 text-[15px] font-semibold text-white hover:border-brand-400/50 hover:bg-white/5"
              >
                Supervisor sign in
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-white/[0.06] bg-ink-950 text-ink-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
          <div className="md:col-span-5">
            <Brand variant="dark" />
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed">
              Oil &amp; Gas Development Company Limited is Pakistan&apos;s leading exploration
              and production company, listed on the Pakistan Stock Exchange and the London
              Stock Exchange.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              Head Office
            </h4>
            <address className="mt-4 text-[13.5px] not-italic leading-relaxed">
              OGDCL House, Plot No. 3<br />
              F-6/G-6, Blue Area, Jinnah Avenue
              <br />
              Islamabad, Pakistan
            </address>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              Portal
            </h4>
            <ul className="mt-4 space-y-2 text-[13.5px]">
              <li><Link href="/login?role=intern" className="hover:text-brand-300">Intern sign in</Link></li>
              <li><Link href="/login?role=supervisor" className="hover:text-brand-300">Supervisor sign in</Link></li>
              <li><a href="#workflow" className="hover:text-brand-300">Workflow</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
              Support
            </h4>
            <ul className="mt-4 space-y-2 text-[13.5px]">
              <li><a href="mailto:internships@ogdcl.com" className="hover:text-brand-300">internships@ogdcl.com</a></li>
              <li><a href="https://ogdcl.com" target="_blank" rel="noreferrer" className="hover:text-brand-300">ogdcl.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12px] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="m-0">
              © {new Date().getFullYear()} Oil &amp; Gas Development Company Limited. All rights reserved.
            </p>
            <p className="m-0">Internal system · Authorised users only</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Portal preview mock-ups (pure markup, no images) ---------- */

function PreviewFrame({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-400/30 via-transparent to-transparent" aria-hidden />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <p className="m-0 text-[11px] font-medium text-ink-400">{title}</p>
          <span className="w-12" />
        </div>
        {children}
      </div>
    </div>
  );
}

function InternPreview() {
  return (
    <PreviewFrame title="portal.ogdcl.com / intern">
      <div className="grid grid-cols-[150px_1fr]">
        <aside className="hidden border-r border-white/[0.06] p-3 sm:block">
          <p className="m-0 px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-500">Workspace</p>
          {[
            ["Overview", Grid, true],
            ["My tasks", ClipboardCheck, false],
            ["Learning", BookOpen, false],
            ["Calendar", Calendar, false],
            ["Messages", MessageSquare, false],
          ].map(([label, Icon, active]) => {
            const I = Icon as typeof Grid;
            return (
              <div
                key={label as string}
                className={`mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                  active ? "bg-brand-500/15 font-semibold text-brand-300" : "text-ink-300"
                }`}
              >
                <I className="h-3.5 w-3.5" />
                {label as string}
              </div>
            );
          })}
        </aside>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="m-0 text-[10px] font-medium text-brand-300">Tuesday, 24 September</p>
              <p className="m-0 text-[16px] font-semibold text-white">Good morning, Ayesha.</p>
            </div>
            <span className="rounded bg-brand-500 px-2 py-1 text-[10px] font-semibold text-ink-950">View my tasks</span>
          </div>
          <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="rounded-full border border-brand-400/25 bg-brand-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-300">
              On track this week
            </span>
            <p className="m-0 mt-2 text-[13px] font-semibold text-white">Your internship is taking shape.</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-12 w-12">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2dd4bf" strokeWidth="10" strokeLinecap="round" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * 0.6} />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-white">40%</span>
              </div>
              <div className="flex-1 space-y-1.5">
                {[["Well log correlation", "Completed", "text-brand-300"], ["Material balance model", "In progress", "text-sky-300"], ["Weekly report — Wk 6", "Under review", "text-amber-300"]].map(([t, s, c]) => (
                  <div key={t as string} className="flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-200">{t}</span>
                    <span className={`font-semibold ${c}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

function SupervisorPreview() {
  const bars = [2, 4, 3, 5, 2, 1, 0];
  return (
    <PreviewFrame title="portal.ogdcl.com / supervisor">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="m-0 text-[14px] font-semibold text-white">Dashboard</p>
            <p className="m-0 text-[10px] text-ink-400">OGDCL Internship Management</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1 rounded-md border border-white/[0.08] px-2 text-[10px] text-ink-400"><Search className="h-3 w-3" /> Search…</span>
            <span className="relative grid h-6 w-6 place-items-center rounded-md border border-white/[0.08] text-ink-300"><Bell className="h-3 w-3" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-400" /></span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[["5", "Total interns", "+2 this month"], ["5", "Active tasks", "2 in progress"], ["2", "Reports to review", "awaiting"], ["1", "Unread", "from interns"]].map(([n, l, h]) => (
            <div key={l} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <p className="m-0 text-[9px] font-semibold text-brand-300">{h}</p>
              <p className="m-0 mt-1 text-[18px] font-semibold leading-none text-white">{n}</p>
              <p className="m-0 mt-1 text-[9.5px] text-ink-400">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-5 gap-2">
          <div className="col-span-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="m-0 text-[11px] font-semibold text-white">Weekly activity</p>
            <div className="mt-3 flex h-16 items-end gap-2">
              {bars.map((b, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-sm bg-brand-500/70" style={{ height: `${Math.max(6, b * 12)}px` }} />
                  <span className="text-[8px] text-ink-500">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="m-0 text-[11px] font-semibold text-white">Task completion</p>
            <div className="mt-2 space-y-1.5">
              {[["Completed", 60, "bg-brand-400"], ["Review", 20, "bg-amber-400"], ["In progress", 20, "bg-sky-400"]].map(([l, w, c]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-[9px] text-ink-300"><span>{l}</span><span>{w}%</span></div>
                  <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full ${c}`} style={{ width: `${w}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}