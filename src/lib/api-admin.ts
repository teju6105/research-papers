import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function requireAdmin(
  request: NextRequest,
): Promise<NextResponse | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Admin sign-in is required." }, { status: 401 });
  }

  let session: { userId: string; role: string };
  try {
    session = await verifySessionToken(token);
  } catch {
    return NextResponse.json({ error: "Admin sign-in is required." }, { status: 401 });
  }

  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access is required." }, { status: 403 });
    }
    return null;
  } catch (error) {
    console.error("Admin account verification failed.", error);
    return NextResponse.json(
      { error: "The account service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
