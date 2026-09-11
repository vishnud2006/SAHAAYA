import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken, verifyPassword, hashPassword } from "@/lib/auth";
import { findUserById, changeUserPassword } from "@/lib/db";

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
    const { currentPassword, newPassword, confirmNewPassword } = body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { success: false, error: "Please fill in all password fields." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { success: false, error: "New passwords do not match." },
        { status: 400 }
      );
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const isCurrentValid = verifyPassword(currentPassword, user.passwordHash, user.salt);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(newPassword);
    await changeUserPassword(session.userId, hash, salt);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (err: any) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to update password right now." },
      { status: 500 }
    );
  }
}
