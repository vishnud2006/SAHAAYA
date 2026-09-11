import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/db";
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists. Please login." },
        { status: 409 }
      );
    }

    // Securely hash password with scrypt
    const { hash, salt } = hashPassword(password);
    const user = await createUser(name, email, hash, salt);

    // Create session
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    };

    const token = createSessionToken(session);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to complete registration. Please try again." },
      { status: 500 }
    );
  }
}
