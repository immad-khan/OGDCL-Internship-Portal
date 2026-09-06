import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MarketingBrand as Brand } from "@/components/marketing-brand";
import { Activity, Check, Lock, ShieldCheck } from "@/components/icons";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

const PANEL_IMAGE =
  "https://images.pexels.com/photos/10396416/pexels-photo-10396416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role === "supervisor" ? "supervisor" : "intern";

  return (
    <div className="grid min-h-screen bg-ink-900 text-ink-100 selection:bg-brand-500/30 lg:grid-cols-12">
      {/* Visual panel */}
      <aside className="relative hidden overflow-hidden lg:col-span-6 lg:flex lg:flex-col xl:col-span-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PANEL_IMAGE}
          alt=""
          aria-hidden
          className="panel-photo absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/30" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-900" aria-hidden />
        <div className="grid-overlay absolute inset-0" aria-hidden />
        <div
          className="absolute -left-20 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-500/15 blur-[140px]"
          aria-hidden
        />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="anim-fade-up">
            <Brand variant="dark" />
          </div>

          <div className="max-w-lg">
            <p className="anim-fade-up anim-delay-1 inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-500/10 py-1 pl-2 pr-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-400" />
              Secure portal
            </p>
            <h2 className="anim-fade-up anim-delay-2 mt-5 text-[38px] font-semibold leading-[1.1] tracking-tight text-white xl:text-[44px]">
              One secure record for <span className="text-brand-400">every placement.</span>
            </h2>
            <ul className="anim-fade-up anim-delay-3 mt-8 space-y-3.5 text-[15px] text-ink-100">
              {[
                "Deliverables and weekly reports in one place",
                "Supervisor reviews recorded against the placement plan",
                "Role-based access, server-side sessions, full audit trail",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-400">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="anim-fade-up anim-delay-4 mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: Lock, k: "TLS + httpOnly", l: "Session security" },
                { icon: Activity, k: "100%", l: "Actions logged" },
                { icon: ShieldCheck, k: "RBAC", l: "Access control" },
              ].map((s) => (
                <div key={s.l} className="card-dark rounded-xl p-3.5">
                  <s.icon className="h-4.5 w-4.5 text-brand-400" />
                  <p className="m-0 mt-3 text-[14px] font-semibold text-white">{s.k}</p>
                  <p className="m-0 text-[11px] text-ink-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[12px] text-ink-400">
            © {new Date().getFullYear()} Oil &amp; Gas Development Company Limited
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-col lg:col-span-6 xl:col-span-5">
        <div className="noise pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div
          className="absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-brand-500/10 blur-[120px]"
          aria-hidden
        />

        <div className="relative flex items-center justify-between px-6 py-5 sm:px-10 lg:hidden">
          <Brand variant="dark" />
        </div>

        <div className="relative flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="anim-fade-up w-full max-w-[460px]">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-300 transition hover:text-white"
              >
                <span aria-hidden>←</span> Back to overview
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-400">
                <Lock className="h-3.5 w-3.5" /> Authorised users only
              </span>
            </div>

            <div className="relative mt-8 rounded-2xl border border-white/10 bg-ink-850/80 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-9">
              <div
                className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
                aria-hidden
              />
              <h1 className="text-[30px] font-semibold tracking-tight text-white">
                Sign in to the portal
              </h1>
              <p className="mt-2 text-[14.5px] text-ink-300">
                Use the credentials issued by the Human Resources Department.
              </p>

              <Suspense fallback={null}>
                <SignInForm initialRole={initialRole} />
              </Suspense>
            </div>

            <p className="mt-8 text-[12px] leading-relaxed text-ink-400">
              This system is the property of Oil &amp; Gas Development Company Limited.
              Unauthorised access is prohibited and all activity is logged. By signing in
              you agree to OGDCL&apos;s acceptable use and information security policies.
            </p>
          </div>
        </div>

        <div className="relative border-t border-white/[0.06] px-6 py-4 text-[12px] text-ink-400 sm:px-10">
          Need access?{" "}
          <a href="mailto:internships@ogdcl.com" className="font-medium text-brand-300 hover:text-brand-200">
            Contact the portal support desk
          </a>
        </div>
      </main>
    </div>
  );
}