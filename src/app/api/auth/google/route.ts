import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Resolve base application URL
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const baseUrl =
      process.env.APP_URL ||
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${proto}://${host}`);
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // 1. If Google OAuth credentials are NOT configured
    if (!clientId || clientId === "your_google_client_id_here" || !clientSecret || clientSecret === "your_google_client_secret_here") {
      console.warn("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not configured in server environment.");
      return NextResponse.redirect(new URL("/login?error=google_oauth_not_configured", baseUrl));
    }

    // 2. Production Google OAuth Flow
    const statePayload = JSON.stringify({
      nonce: crypto.randomBytes(16).toString("hex"),
      redirect: redirectPath.startsWith("/") ? redirectPath : "/dashboard",
      timestamp: Date.now(),
    });

    const stateToken = Buffer.from(statePayload).toString("base64url");

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", stateToken);
    googleAuthUrl.searchParams.set("prompt", "select_account");

    const res = NextResponse.redirect(googleAuthUrl);

    // Set secure state cookie for CSRF validation (10 min expiry)
    res.cookies.set({
      name: "sahaaya_oauth_state",
      value: stateToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Google Auth start error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", req.url));
  }
}

