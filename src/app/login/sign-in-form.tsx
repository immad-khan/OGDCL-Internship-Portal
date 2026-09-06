"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Eye, EyeOff, Lock, Mail, Users } from "@/components/icons";

type Role = "intern" | "supervisor";

const ROLE_META: Record<Role, { label: string; hint: string; icon: typeof BookOpen }> = {
  intern: { label: "Intern", hint: "Tasks, reports & learning", icon: BookOpen },
  supervisor: { label: "Supervisor", hint: "Roster, reviews & evaluations", icon: Users },
};

const inputBase =
  "h-12 w-full rounded-lg border border-white/10 bg-white/[0.04] text-[15px] text-white placeholder:text-ink-400 transition focus:border-brand-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-brand-500/15";

export function SignInForm({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState(role === "supervisor" ? "supervisor@ogdcl.com" : "intern@ogdcl.com");
  const [password, setPassword] = useState(role === "supervisor" ? "Supervisor@123" : "Intern@123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function switchRole(next: Role) {
    setRole(next);
    setError("");
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", next);
    router.replace(`/login?${params.toString()}`, { scroll: false });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to sign in.");
        return;
      }
      
      router.push(role === "supervisor" ? "/supervisor" : "/intern");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8" noValidate>
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

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-center text-[13px] font-medium text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 text-[15px] font-semibold text-ink-950 shadow-[0_10px_30px_rgba(20,184,166,0.25)] transition hover:bg-brand-400 hover:shadow-[0_10px_36px_rgba(20,184,166,0.35)] disabled:pointer-events-none disabled:opacity-70"
      >
        {isLoading ? "Signing in..." : `Continue as ${ROLE_META[role].label}`}
        {!isLoading && <ArrowRight className="h-4 w-4" />}
      </button>

      <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-[12.5px] text-ink-300">
        <p className="m-0">
          <span className="font-semibold text-ink-100">Evaluation access:</span>{" "}
          <span className="font-mono text-ink-200">
            {role === "supervisor" ? "supervisor@ogdcl.com" : "intern@ogdcl.com"}
          </span>
          <span className="text-ink-500"> / </span>
          <span className="font-mono text-ink-200">
            {role === "supervisor" ? "Supervisor@123" : "Intern@123"}
          </span>
        </p>
      </div>
    </form>
  );
}