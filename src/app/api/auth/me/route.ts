import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider || "email",
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
