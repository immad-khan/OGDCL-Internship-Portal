"use client";

import { useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, type SignInState } from "./actions";
import type { UserRole } from "@/db/schema";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Users,
} from "@/components/icons";

const DEMO: Record<UserRole, { email: string; password: string }> = {
  intern: { email: "intern@ogdcl.com", password: "Intern@123" },
  supervisor: { email: "supervisor@ogdcl.com", password: "Supervisor@123" },
};

const ROLE_META: Record<UserRole, { label: string; hint: string; icon: typeof BookOpen }> = {
  intern: { label: "Intern", hint: "Tasks, reports & learning", icon: BookOpen },
  supervisor: { label: "Supervisor", hint: "Roster, reviews & evaluations", icon: Users },
};

const inputBase =
  "h-12 w-full rounded-lg border border-white/10 bg-white/[0.04] text-[15px] text-white placeholder:text-ink-400 transition focus:border-brand-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-brand-500/15";

export function SignInForm({ initialRole }: { initialRole: UserRole }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {
    role: initialRole,
  });
  const [role, setRole] = useState<UserRole>(state.role ?? initialRole);
  const [email, setEmail] = useState(state.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function switchRole(next: UserRole) {
    setRole(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", next);
    router.replace(`/login?${params.toString()}`, { scroll: false });
  }

  function fillDemo() {
    setEmail(DEMO[role].email);
    setPassword(DEMO[role].password);
  }

  return (
    <form action={formAction} className="mt-8" noValidate>
      <input type="hidden" name="role" value={role} />

      {/* Role selector */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-300">
          Sign in as
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(["intern", "supervisor"] as const).map((r) => {
            const active = role === r;
            const Icon = ROLE_META[r].icon;
            return (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                aria-pressed={active}
                className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                  active
                    ? "border-brand-400/50 bg-brand-500/10 shadow-[0_0_0_4px_rgba(20,184,166,0.08)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg transition ${
                    active
                      ? "bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/40"
                      : "bg-white/[0.05] text-ink-300 ring-1 ring-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[14px] font-semibold ${active ? "text-white" : "text-ink-100"}`}>
                    {ROLE_META[r].label}
                  </span>
                  <span className="block truncate text-[11.5px] text-ink-400">{ROLE_META[r].hint}</span>
                </span>
                <span
                  className={`absolute right-3 top-3 h-2 w-2 rounded-full transition ${
                    active ? "bg-brand-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" : "bg-white/10"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </fieldset>

      {state.error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-[13.5px] text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          <p className="m-0">{state.error}</p>
        </div>
      )}

      <div className="mt-7 space-y-5">
        <div>
          <label htmlFor="email" className="block text-[13px] font-semibold text-ink-100">
            {role === "supervisor" ? "Corporate email" : "Email address"}
          </label>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "supervisor" ? "name@ogdcl.com" : "you@ogdcl.com"}
              className={`${inputBase} pl-11 pr-4`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[13px] font-semibold text-ink-100">
              Password
            </label>
            <a
              href="mailto:internships@ogdcl.com?subject=Portal%20password%20reset"
              className="text-[12.5px] font-medium text-brand-300 hover:text-brand-200"
            >
              Forgotten password?
            </a>
          </div>
          <div className="relative mt-2">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className={`${inputBase} pl-11 pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-ink-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-[13px] text-ink-200">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-white/20 bg-transparent accent-brand-500"
          />
          Keep me signed in on this device
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 text-[15px] font-semibold text-ink-950 shadow-[0_10px_30px_rgba(20,184,166,0.25)] transition hover:bg-brand-400 hover:shadow-[0_10px_36px_rgba(20,184,166,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" />
            Signing in…
          </>
        ) : (
          <>
            Continue as {ROLE_META[role].label}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-[12.5px] text-ink-300">
        <div className="flex items-center justify-between gap-3">
          <p className="m-0">
            <span className="font-semibold text-ink-100">Evaluation access:</span>{" "}
            <span className="font-mono text-ink-200">{DEMO[role].email}</span>
            <span className="text-ink-500"> / </span>
            <span className="font-mono text-ink-200">{DEMO[role].password}</span>
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="shrink-0 rounded-md border border-white/10 px-2.5 py-1 text-[12px] font-semibold text-ink-100 transition hover:border-brand-400/50 hover:text-brand-300"
          >
            Fill
          </button>
        </div>
      </div>
    </form>
  );
}
