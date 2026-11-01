import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const baseUrl = process.env.AUTH_TEST_BASE_URL ?? "http://127.0.0.1:3000";
const prisma = new PrismaClient();
const email = `stage3-auth-${randomUUID().replaceAll("-", "")}@example.invalid`;
const password = `Stage3Test-${randomUUID()}-only`;
let createdUserId;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sessionCookie(response) {
  const setCookie = response.headers.get("set-cookie");
  const cookie = setCookie?.match(/research_atlas_session=[^;]+/)?.[0];
  if (!cookie) throw new Error("Authentication response did not set a session cookie.");
  return cookie;
}

try {
  const registration = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Stage 3 auth test", email, password }),
  });
  assert(registration.status === 201, `Registration returned ${registration.status}.`);
  const registeredBody = await registration.json();
  assert(
    registeredBody.user?.email === email && !("passwordHash" in registeredBody.user),
    "Registration did not return the expected safe user profile.",
  );
  const registrationCookie = sessionCookie(registration);
  createdUserId = registeredBody.user.id;
  console.log("PASS registration creates MySQL user and HTTP-only session");

  const duplicate = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Stage 3 auth test", email, password }),
  });
  assert(duplicate.status === 409, `Duplicate registration returned ${duplicate.status}.`);
  console.log("PASS duplicate email returns 409");

  const currentSession = await fetch(`${baseUrl}/api/auth/session`, {
    headers: { cookie: registrationCookie },
  });
  assert(currentSession.status === 200, `Session check returned ${currentSession.status}.`);
  console.log("PASS session endpoint verifies signed cookie and MySQL user");

  const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: `${password}-wrong` }),
  });
  assert(invalidLogin.status === 401, `Invalid login returned ${invalidLogin.status}.`);
  console.log("PASS invalid password is rejected");

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert(login.status === 200, `Login returned ${login.status}.`);
  const loginCookie = sessionCookie(login);
  console.log("PASS login verifies bcrypt hash and issues session");

  const logout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { cookie: loginCookie },
  });
  assert(logout.status === 200, `Logout returned ${logout.status}.`);
  const loggedOut = await fetch(`${baseUrl}/api/auth/session`);
  assert(loggedOut.status === 401, `Logged-out session returned ${loggedOut.status}.`);
  console.log("PASS logout clears the session");
} finally {
  if (createdUserId) {
    await prisma.user.deleteMany({ where: { id: createdUserId } });
  }
  await prisma.$disconnect();
}

console.log("Authentication API smoke test passed.");
