import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";

// Lightweight in-memory rate limiter: max 20 requests per minute per IP
const ipRequestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, validTimestamps);
    return true;
  }
  
  validTimestamps.push(now);
  ipRequestHistory.set(ip, validTimestamps);

  // Periodically cleanup stale entries
  if (ipRequestHistory.size > 2000) {
    for (const [key, times] of ipRequestHistory.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestHistory.delete(key);
      }
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Extract IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before submitting another analysis request.",
        },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload. Please provide a JSON body.",
        },
        { status: 400 }
      );
    }

    // Support both "input" (as per Phase 2/3/4 spec) and "text" / "files"
    const inputContent = body.input || body.text;
    const files = body.files;
    const inputSources = body.inputSources;
    const previousAnalysis = body.previousAnalysis;
    const previousContext = previousAnalysis
      ? {
          situation: previousAnalysis.situation,
          intent: previousAnalysis.intent,
          previousInput: body.rawInput || previousAnalysis.situation,
        }
      : body.previousContext;

    // Validate text length
    if (typeof inputContent === "string" && inputContent.length > 30000) {
      return NextResponse.json(
        {
          success: false,
          error: "Situation text is too long. Please limit your input to under 30,000 characters.",
        },
        { status: 400 }
      );
    }

    // Validate files payload
    if (files && Array.isArray(files)) {
      if (files.length > 5) {
        return NextResponse.json(
          {
            success: false,
            error: "Maximum 5 files can be attached per analysis request.",
          },
          { status: 400 }
        );
      }

      let totalFileSize = 0;
      for (const f of files) {
        if (typeof f.data === "string") {
          totalFileSize += f.data.length;
        }
      }

      // Max base64 payload ~14MB
      if (totalFileSize > 15 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            error: "Total attached files exceed the maximum allowed size (10MB). Please attach smaller files.",
          },
          { status: 400 }
        );
      }
    }

    if (
      (!inputContent || typeof inputContent !== "string" || inputContent.trim() === "") &&
      (!files || !Array.isArray(files) || files.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a situation description, voice transcript, image, or document.",
        },
        { status: 400 }
      );
    }

    const situationText = (inputContent || "").trim();

    // Perform Gemini analysis with server-side validation, multimodal handling, and conversational refinement context
    const result = await analyzeWithGemini(situationText, files, inputSources, previousContext);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Analysis API route error:", error?.message || error);

    const isApiKeyError =
      error?.message?.includes("API key") ||
      error?.message?.includes("API_KEY") ||
      error?.message?.includes("GEMINI_API_KEY");

    const errorMessage = isApiKeyError
      ? "Gemini API key is not configured or invalid. Please check your server environment."
      : "SAHAAYA couldn't complete this analysis right now. Please try again.";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
