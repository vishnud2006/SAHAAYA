import { NextRequest, NextResponse } from "next/server";
import { verifyResourcesForSituation } from "@/lib/resourceVerifier";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const situation = body.situation || "";
    const intent = body.intent || "";
    const categories = Array.isArray(body.categories) ? body.categories : [];
    const detectedInformation = Array.isArray(body.detectedInformation) ? body.detectedInformation : [];

    if (!situation && !intent && categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide situation, intent, or resource categories for verification.",
        },
        { status: 400 }
      );
    }

    const verifiedResources = await verifyResourcesForSituation(
      situation,
      intent,
      categories,
      detectedInformation
    );

    return NextResponse.json(
      {
        success: true,
        resources: verifiedResources,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resource verification route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SAHAAYA couldn't check external resources right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

