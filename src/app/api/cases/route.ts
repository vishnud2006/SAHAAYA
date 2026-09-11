import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getCasesByUserId, createCase } from "@/lib/db";

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

    const cases = await getCasesByUserId(session.userId);
    return NextResponse.json({ success: true, cases });
  } catch (err: any) {
    console.error("Fetch cases error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, rawInput, priority, inputSources, result } = body;

    if (!rawInput || !result) {
      return NextResponse.json(
        { success: false, error: "Missing required analysis payload" },
        { status: 400 }
      );
    }

    const newCase = await createCase({
      userId: session.userId,
      title: title || result.situation?.slice(0, 60) || "Case Analysis",
      rawInput,
      priority: priority || result.priority || "MEDIUM",
      inputSources: inputSources || ["text"],
      result,
    });

    return NextResponse.json({ success: true, case: newCase });
  } catch (err: any) {
    console.error("Create case error:", err);
    return NextResponse.json({ success: false, error: "Failed to save case" }, { status: 500 });
  }
}
