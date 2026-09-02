import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

const SESSION_COOKIE = "noire_session";
const SESSION_DAYS = 7;

interface SessionClaims {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Add it to your environment.");
  }
  return new TextEncoder().encode(secret);
}

async function sign(payload: SessionClaims): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());
}

async function verify(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const p = payload as JWTPayload & SessionClaims;
    if (!p.sub || !p.email || !p.role) return null;
    return { sub: p.sub, email: p.email, role: p.role, name: p.name };
  } catch {
    return null;
  }
}

export interface SessionContext {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

/** Read and verify the session from the request cookies. */
export async function getSession(): Promise<SessionContext | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = await verify(token);
  if (!claims) return null;
  return {
    userId: claims.sub,
    email: claims.email,
    role: claims.role,
    name: claims.name,
  };
}

/** Create a signed session token and set it as a secure httpOnly cookie. */
export async function createSession(input: SessionClaims): Promise<void> {
  const token = await sign(input);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/** Clear the session cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}