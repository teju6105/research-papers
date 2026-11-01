import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "research_atlas_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getSigningKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export function assertAuthConfigured(): void {
  getSigningKey();
}

export async function createSessionToken(user: {
  id: string;
  role: string;
}): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSigningKey());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSigningKey());
  if (!payload.sub || typeof payload.role !== "string") {
    throw new Error("Session token is missing required claims.");
  }
  return { userId: payload.sub, role: payload.role };
}

export const sessionDurationSeconds = SESSION_DURATION_SECONDS;
