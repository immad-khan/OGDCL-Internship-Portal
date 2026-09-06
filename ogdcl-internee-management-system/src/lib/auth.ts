import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User, type UserRole } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { ensureSeeded } from "@/lib/seed";

export const SESSION_COOKIE = "ogdcl_imp_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export type SafeUser = Omit<User, "passwordHash">;

function toSafeUser(user: User): SafeUser {
  const { passwordHash: _omit, ...rest } = user;
  void _omit;
  return rest;
}

export async function authenticate(
  email: string,
  password: string,
  role: UserRole,
): Promise<
  | { ok: true; user: SafeUser }
  | { ok: false; reason: "invalid" | "wrong_portal" }
> {
  await ensureSeeded();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { ok: false, reason: "invalid" };
  }
  if (user.role !== role) {
    return { ok: false, reason: "wrong_portal" };
  }
  return { ok: true, user: toSafeUser(user) };
}

export async function createSession(userId: number): Promise<void> {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({ id, userId, expiresAt });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (id) {
    await db.delete(sessions).where(eq(sessions.id, id));
  }
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (rows.length === 0) return null;
  return toSafeUser(rows[0].user);
}
