import crypto from "crypto";
import { AuthSession } from "@/types";

export const AUTH_COOKIE_NAME = "sahaaya_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const SESSION_SECRET =
  process.env.SAHAAYA_SESSION_SECRET || "sahaaya_secure_default_session_secret_key_2026_x89";

/**
 * Hash password securely with scrypt and a unique salt.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

/**
 * Verify plaintext password against stored hash & salt using timing-safe comparison.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const hashBuffer = Buffer.from(hash, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");
    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

/**
 * Create a signed session token containing the session data.
 */
export function createSessionToken(session: AuthSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

/**
 * Verify and decode a signed session token.
 */
export function verifySessionToken(token: string): AuthSession | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payload, "base64url").toString("utf-8");
    const session: AuthSession = JSON.parse(jsonStr);

    // Check expiration
    if (session.expiresAt && session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
