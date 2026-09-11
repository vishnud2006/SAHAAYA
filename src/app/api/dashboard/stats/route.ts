import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getDashboardStats(session.userId);
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
