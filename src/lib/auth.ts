import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "ogdcl-intern-portal-secret-key-change-in-production"
);

const COOKIE_NAME = "auth_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: number;
  role: "supervisor" | "intern";
  email: string;
  name: string;
};

/** Create a signed JWT and set it as an HTTP-only cookie. */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

/** Verify and decode the JWT from the cookie. Returns null if invalid/absent. */
export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Delete the auth cookie (logout). */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Get the current user from the session cookie. Returns null if not logged in. */
export async function getCurrentUser(): Promise<SessionPayload | null> {
  return verifySession();
}
