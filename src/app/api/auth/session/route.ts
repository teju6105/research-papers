import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let session: { userId: string; role: string };
  try {
    session = await verifySessionToken(token);
  } catch {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session lookup failed.", error);
    return NextResponse.json(
      { error: "The account service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
