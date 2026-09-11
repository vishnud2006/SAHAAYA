import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getCaseById, deleteCase, updateCaseActions, updateCaseFull } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const savedCase = await getCaseById(id, session.userId);
    if (!savedCase) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: savedCase });
  } catch (err: any) {
    console.error("Fetch case by id error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch case" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updatedCase = await updateCaseFull(id, session.userId, {
      title: body.title,
      priority: body.priority,
      rawInput: body.rawInput,
      result: body.result,
      inputSources: body.inputSources,
    });

    if (!updatedCase) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (err: any) {
    console.error("PUT update case error:", err);
    return NextResponse.json({ success: false, error: "Failed to update case" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { actions } = body;

    if (!Array.isArray(actions)) {
      return NextResponse.json(
        { success: false, error: "Invalid actions format" },
        { status: 400 }
      );
    }

    const updatedCase = await updateCaseActions(id, session.userId, actions);
    if (!updatedCase) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (err: any) {
    console.error("Update case error:", err);
    return NextResponse.json({ success: false, error: "Failed to update case" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie || !cookie.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = verifySessionToken(cookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await deleteCase(id, session.userId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Case deleted successfully" });
  } catch (err: any) {
    console.error("Delete case error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete case" }, { status: 500 });
  }
}
