"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession, destroySession } from "@/lib/auth";
import type { UserRole } from "@/db/schema";

export type SignInState = {
  error?: string;
  role?: UserRole;
  email?: string;
};

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const role = formData.get("role") === "supervisor" ? "supervisor" : "intern";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email address and password.", role, email };
  }

  const result = await authenticate(email, password, role);

  if (!result.ok) {
    if (result.reason === "wrong_portal") {
      const other = role === "intern" ? "Supervisor" : "Intern";
      return {
        error: `This account is registered for the ${other} portal. Switch the role above and try again.`,
        role,
        email,
      };
    }
    return {
      error: "The email address or password is incorrect.",
      role,
      email,
    };
  }

  await createSession(result.user.id);
  redirect(result.user.role === "supervisor" ? "/supervisor" : "/intern");
}

export async function signOut(): Promise<void> {
  await destroySession();
  redirect("/login");
}
