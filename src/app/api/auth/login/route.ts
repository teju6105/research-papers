import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/auth-validation";
import {
  assertAuthConfigured,
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionDurationSeconds,
} from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email address and password." },
      { status: 400 },
    );
  }

  try {
    assertAuthConfigured();
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Email or password is incorrect." },
        { status: 401 },
      );
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = await createSessionToken(user);
    const response = NextResponse.json({ user: publicUser });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDurationSeconds,
    });
    return response;
  } catch (error) {
    console.error("Login failed.", error);
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
