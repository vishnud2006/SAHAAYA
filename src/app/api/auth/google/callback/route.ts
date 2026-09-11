import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGoogleUser } from "@/lib/db";
import { createSessionToken, AUTH_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const baseUrl =
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${proto}://${host}`);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // 1. Handle user cancellation
  if (error) {
    if (error === "access_denied") {
      return NextResponse.redirect(new URL("/login?error=oauth_cancelled", baseUrl));
    }
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, baseUrl));
  }

  // 2. Validate code and state
  const stateCookie = req.cookies.get("sahaaya_oauth_state")?.value;
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", baseUrl));
  }

  let redirectPath = "/dashboard";
  try {
    const parsedState = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
    if (parsedState.redirect && typeof parsedState.redirect === "string" && parsedState.redirect.startsWith("/")) {
      redirectPath = parsedState.redirect;
    }
  } catch {
    // Ignore JSON parsing errors and use default
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=missing_oauth_config", baseUrl));
  }

  try {
    // 3. Exchange authorization code for Google access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google Token Exchange Failed:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", baseUrl));
    }

    // 4. Retrieve verified user identity from Google UserInfo endpoint
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userinfo = await userinfoRes.json();
    if (!userinfoRes.ok || !userinfo.email) {
      console.error("Google UserInfo Failed:", userinfo);
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", baseUrl));
    }

    // 5. Find or Create Google User (Preserves existing accounts with same email)
    const user = await findOrCreateGoogleUser({
      googleId: userinfo.sub || userinfo.id,
      email: userinfo.email,
      name: userinfo.name || userinfo.given_name || userinfo.email.split("@")[0],
      avatarUrl: userinfo.picture,
    });

    // 6. Create authenticated session token
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      authProvider: "google" as const,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    };

    const sessionToken = createSessionToken(session);
    const isProd = process.env.NODE_ENV === "production";

    const destinationUrl = new URL(redirectPath, baseUrl);
    const res = NextResponse.redirect(destinationUrl);

    // Set auth cookie
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    // Clear state cookie
    res.cookies.delete("sahaaya_oauth_state");

    return res;
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_processing_error", baseUrl));
  }
}

