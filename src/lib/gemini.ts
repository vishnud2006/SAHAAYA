import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SahaayaAnalysisResult } from "@/types";
import { verifyResourcesForSituation } from "@/lib/resourceVerifier";

export const SAHAAYA_SYSTEM_INSTRUCTION = `You are SAHAAYA, an intelligent and empathetic decision bridge designed to convert messy real-world human situations into clear, structured, and actionable guidance.

You act like a compassionate, highly knowledgeable expert advisor helping a person take their next real-world steps.

When analyzing a situation:
1. Empathize and understand the person's real situation.
2. Formulate clear, human-readable explanations in direct, respectful second-person language ("You are looking for...", "You lost your...", "You are facing..."). Avoid robotic third-person phrasing like "The user wants..." or "Input intent: ...".
3. Identify legitimate programs, assistance categories, official government schemes, healthcare steps, document recovery pathways, or emergency measures that may help.
4. Explain clearly why these options are relevant to their situation.
5. Identify crucial missing parameters (state, income, course, age, specific symptoms, etc.) that would allow for more specific guidance.
6. Provide a sequenced, numbered, practical step-by-step action plan.
7. List commonly needed documents with conditional phrasing ("You may need:", "Keep these ready:").
8. Highlight important warnings, statutory notes, deadlines, zero intermediary fee reminders, and safety advice.
9. Formulate ONE clear, prominent single next step the person should take right now.

IMPORTANT SAFETY & TRUTH RULES:
* NEVER invent phone numbers (only use official universal numbers like 112 Emergency, 108 Ambulance, 181 Women Helpline when appropriate).
* NEVER invent fake government schemes, fake portal URLs, or fake addresses. Use real, well-known entities (e.g., National Scholarship Portal scholarships.gov.in, Parivahan Sewa parivahan.gov.in, UIDAI uidai.gov.in, PM-KISAN, Ayushman Bharat pmjay.gov.in, PMKVY, Digilocker, UMANG).
* NEVER guarantee eligibility, scheme approvals, or financial amounts.
* NEVER formulate medical diagnoses or prescribe medications. In medical situations, advise consulting a physician or emergency hospital.
* Treat user statements as reported information.
* Prioritize immediate life safety in emergency or crisis situations (mark priority as CRITICAL / HIGH).

Return ONLY valid JSON matching the schema. Do not include markdown code block formatting or explanation outside JSON.`;

export const SAHAAYA_JSON_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    situation: {
      type: SchemaType.STRING,
      description: "Empathetic, respectful natural-language explanation of what the user is experiencing (e.g., 'You are looking for financial support for your college education...').",
    },
    intent: {
      type: SchemaType.STRING,
      description: "Concise summary of the core goal or outcome being sought.",
    },
    priority: {
      type: SchemaType.STRING,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      description: "Conservative urgency and priority classification.",
    },
    whatMayHelp: {
      type: SchemaType.ARRAY,
      description: "Applicable programs, schemes, services, emergency help, or recovery pathways.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING, description: "Name of the scheme, service, or option" },
          description: { type: SchemaType.STRING, description: "Brief description of the option" },
          whyRelevant: { type: SchemaType.STRING, description: "Why this applies to the user's situation" },
          category: { type: SchemaType.STRING, description: "Category (e.g., Central Scheme, State Scheme, Emergency, Legal)" },
          portalUrl: { type: SchemaType.STRING, description: "Official domain if well-known (e.g. scholarships.gov.in)" },
        },
        required: ["title", "description", "whyRelevant"],
      },
    },
    whyRelevant: {
      type: SchemaType.ARRAY,
      description: "Reasons why the suggested options fit the user's context (income, student status, location, urgency).",
      items: { type: SchemaType.STRING },
    },
    informationStillNeeded: {
      type: SchemaType.ARRAY,
      description: "Specific missing details needed for exact resolution (e.g., State of residence, annual family income, caste/category, exact course).",
      items: { type: SchemaType.STRING },
    },
    actions: {
      type: SchemaType.ARRAY,
      description: "Sequenced, numbered step-by-step actionable plan.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING, description: "Action step title" },
          description: { type: SchemaType.STRING, description: "Clear explanation of how to execute this step" },
          reason: { type: SchemaType.STRING, description: "Why this step is important" },
          ctaText: { type: SchemaType.STRING, description: "Short button CTA text" },
        },
        required: ["title", "description", "reason"],
      },
    },
    documentsNeeded: {
      type: SchemaType.ARRAY,
      description: "Commonly needed documents to keep ready (e.g., Aadhaar card, Income certificate, Previous marksheet, Bank passbook).",
      items: { type: SchemaType.STRING },
    },
    importantInfo: {
      type: SchemaType.ARRAY,
      description: "Important warnings, deadlines, zero portal fee reminders, official domain verification, safety notes.",
      items: { type: SchemaType.STRING },
    },
    recommendedNextStep: {
      type: SchemaType.STRING,
      description: "ONE single, prominent immediate next step the user should take right now.",
    },
    refinementPrompt: {
      type: SchemaType.STRING,
      description: "Friendly prompt inviting the user to provide missing details.",
    },
    detectedInformation: {
      type: SchemaType.ARRAY,
      description: "Extracted entities, vital metrics, facts, and constraints.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: { type: SchemaType.STRING, description: "Category/Key label" },
          value: { type: SchemaType.STRING, description: "Extracted fact value" },
        },
        required: ["label", "value"],
      },
    },
    verified: {
      type: SchemaType.ARRAY,
      description: "Information directly supported by the input provided by the user.",
      items: { type: SchemaType.STRING },
    },
    needsConfirmation: {
      type: SchemaType.ARRAY,
      description: "Missing or unconfirmed details.",
      items: { type: SchemaType.STRING },
    },
    resources: {
      type: SchemaType.ARRAY,
      description: "Institutional or official categories of help.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING, description: "Help category or institution type" },
          description: { type: SchemaType.STRING, description: "Guidance on who to contact and why" },
        },
        required: ["type", "description"],
      },
    },
    warnings: {
      type: SchemaType.ARRAY,
      description: "Safety limitations, professional confirmation requirements, and statutory disclaimers.",
      items: { type: SchemaType.STRING },
    },
  },
  required: [
    "situation",
    "intent",
    "priority",
    "whatMayHelp",
    "actions",
    "informationStillNeeded",
    "documentsNeeded",
    "importantInfo",
    "recommendedNextStep",
    "detectedInformation",
    "verified",
    "needsConfirmation",
    "resources",
    "warnings",
  ],
};

/**
 * Validates and sanitizes raw JSON string into a verified SahaayaAnalysisResult
 */
export function validateAndSanitizeGeminiResponse(rawText: string): SahaayaAnalysisResult {
  // Strip markdown code block wrappers if Gemini outputs ```json ... ```
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  cleaned = cleaned.trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err: any) {
    throw new Error(`Malformed JSON received from Gemini: ${err.message}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response format: root must be a JSON object.");
  }

  // Validate priority enum
  const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const priority = validPriorities.includes(parsed.priority?.toUpperCase())
    ? parsed.priority.toUpperCase()
    : "MEDIUM";

  // Validate and sanitize whatMayHelp
  const whatMayHelp = Array.isArray(parsed.whatMayHelp)
    ? parsed.whatMayHelp
        .filter((item: any) => item && (typeof item === "object" || typeof item === "string"))
        .map((item: any) => {
          if (typeof item === "string") {
            return {
              title: item.trim(),
              description: "Relevant program or assistance pathway.",
              whyRelevant: "Applies to the reported situation.",
            };
          }
          return {
            title: String(item.title || "Applicable Assistance").trim(),
            description: String(item.description || "").trim(),
            whyRelevant: String(item.whyRelevant || item.description || "").trim(),
            category: item.category ? String(item.category).trim() : undefined,
            portalUrl: item.portalUrl ? String(item.portalUrl).trim() : undefined,
          };
        })
        .filter((item: any) => item.title.length > 0)
    : [];

  // Validate whyRelevant
  const whyRelevant = Array.isArray(parsed.whyRelevant)
    ? parsed.whyRelevant.map((r: any) => String(r).trim()).filter((r: string) => r.length > 0)
    : [];

  // Validate informationStillNeeded
  const informationStillNeeded = Array.isArray(parsed.informationStillNeeded)
    ? parsed.informationStillNeeded.map((i: any) => String(i).trim()).filter((i: string) => i.length > 0)
    : Array.isArray(parsed.needsConfirmation)
    ? parsed.needsConfirmation.map((c: any) => String(c).trim()).filter((c: string) => c.length > 0)
    : [];

  // Validate documentsNeeded
  const documentsNeeded = Array.isArray(parsed.documentsNeeded)
    ? parsed.documentsNeeded.map((d: any) => String(d).trim()).filter((d: string) => d.length > 0)
    : [];

  // Validate importantInfo
  const importantInfo = Array.isArray(parsed.importantInfo)
    ? parsed.importantInfo.map((info: any) => String(info).trim()).filter((info: string) => info.length > 0)
    : Array.isArray(parsed.warnings)
    ? parsed.warnings.map((w: any) => String(w).trim()).filter((w: string) => w.length > 0)
    : [];

  // Validate actions array
  const actions = Array.isArray(parsed.actions)
    ? parsed.actions
        .filter((a: any) => a && typeof a === "object")
        .map((a: any) => ({
          title: String(a.title || "Next Step").trim(),
          description: String(a.description || "").trim(),
          reason: String(a.reason || "").trim(),
          ctaText: a.ctaText ? String(a.ctaText).trim() : undefined,
        }))
        .filter((a: any) => a.description.length > 0 || a.title.length > 0)
    : [];

  // Validate recommendedNextStep
  const recommendedNextStep = parsed.recommendedNextStep
    ? String(parsed.recommendedNextStep).trim()
    : actions.length > 0
    ? `👉 ${actions[0].title}: ${actions[0].description}`
    : "👉 Review the recommended next steps and check the official government or service portal.";

  // Validate detectedInformation array
  const detectedInformation = Array.isArray(parsed.detectedInformation)
    ? parsed.detectedInformation
        .filter((item: any) => item && typeof item === "object")
        .map((item: any) => ({
          label: String(item.label || "Detail").trim(),
          value: String(item.value || "").trim(),
        }))
        .filter((item: any) => item.value.length > 0)
    : [];

  // Validate verified array
  const verified = Array.isArray(parsed.verified)
    ? parsed.verified.map((v: any) => String(v).trim()).filter((v: string) => v.length > 0)
    : [];

  // Validate needsConfirmation array
  const needsConfirmation = Array.isArray(parsed.needsConfirmation)
    ? parsed.needsConfirmation.map((c: any) => String(c).trim()).filter((c: string) => c.length > 0)
    : informationStillNeeded;

  // Validate resources array
  const resources = Array.isArray(parsed.resources)
    ? parsed.resources
        .filter((r: any) => r && typeof r === "object")
        .map((r: any) => ({
          type: String(r.type || "Official Resource").trim(),
          description: String(r.description || "").trim(),
        }))
        .filter((r: any) => r.description.length > 0)
    : [];

  // Validate warnings array
  const warnings = Array.isArray(parsed.warnings)
    ? parsed.warnings.map((w: any) => String(w).trim()).filter((w: string) => w.length > 0)
    : importantInfo;

  return {
    situation: String(parsed.situation || "Situation processed by SAHAAYA.").trim(),
    intent: String(parsed.intent || "Clarify situation and proceed safely.").trim(),
    priority,
    whatMayHelp,
    whyRelevant,
    informationStillNeeded,
    documentsNeeded,
    importantInfo,
    recommendedNextStep,
    refinementPrompt: parsed.refinementPrompt ? String(parsed.refinementPrompt).trim() : undefined,
    detectedInformation,
    verified,
    needsConfirmation,
    actions,
    resources,
    warnings,
    analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export async function analyzeWithGemini(
  text: string,
  files?: Array<{ data: string; mimeType: string; filename?: string; extractedText?: string }>,
  inputSources?: Array<"text" | "voice" | "image" | "document">,
  previousContext?: { situation?: string; intent?: string; previousInput?: string }
): Promise<SahaayaAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Determine input sources
  const resolvedSources: Array<"text" | "voice" | "image" | "document"> = inputSources || [];
  if (resolvedSources.length === 0) {
    if (text) resolvedSources.push("text");
    if (files?.some((f) => f.mimeType?.startsWith("image/"))) resolvedSources.push("image");
    if (files?.some((f) => !f.mimeType?.startsWith("image/"))) resolvedSources.push("document");
  }

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Gemini intelligence engine is not configured. Please set GEMINI_API_KEY in environment variables.");
    }
    const fallback = generateFallbackAnalysis(text, previousContext);
    fallback.inputSources = resolvedSources;
    fallback.sourceType = resolvedSources.length > 1 ? "multimodal" : resolvedSources[0] || "text";
    return fallback;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SAHAAYA_SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      // @ts-expect-error responseSchema supported in Generative AI SDK
      responseSchema: SAHAAYA_JSON_SCHEMA,
      temperature: 0.1,
    },
  });

  let promptInstruction = `Analyze the following real-world human input according to SAHAAYA principles and return ONLY valid JSON matching the schema:`;

  if (previousContext && (previousContext.situation || previousContext.previousInput)) {
    promptInstruction += `\n\n[PRIOR CASE CONTEXT]\nPrevious Situation: ${previousContext.situation || ""}\nPrevious Input: ${previousContext.previousInput || ""}\n\n[NEW USER REFINEMENT / ADDITIONAL DETAILS]\nUpdate and refine the analysis incorporating both the previous context and these new details:`;
  }

  let combinedPrompt = `${promptInstruction}\n\n"""\n${text}\n"""`;

  if (files && files.length > 0) {
    for (const file of files) {
      if (file.extractedText) {
        combinedPrompt += `\n\n[ATTACHED DOCUMENT TEXT: "${file.filename || "file"}"]\n"""\n${file.extractedText}\n"""`;
      }
    }
  }

  const promptParts: any[] = [combinedPrompt];

  if (files && files.length > 0) {
    for (const file of files) {
      if (file.data) {
        const base64Data = file.data.includes("base64,")
          ? file.data.split("base64,")[1]
          : file.data;

        // Gemini 1.5 Flash supports image/png, image/jpeg, image/webp, application/pdf
        const validMime = file.mimeType?.startsWith("image/") || file.mimeType === "application/pdf"
          ? file.mimeType
          : "image/jpeg";

        promptParts.push({
          inlineData: {
            data: base64Data,
            mimeType: validMime,
          },
        });
      }
    }
  }

  const result = await model.generateContent(promptParts);
  const responseText = result.response.text();

  if (!responseText || responseText.trim() === "") {
    throw new Error("Received empty response from Gemini intelligence engine.");
  }

  const validatedResult = validateAndSanitizeGeminiResponse(responseText);
  validatedResult.inputSources = resolvedSources;
  validatedResult.sourceType = resolvedSources.length > 1 ? "multimodal" : resolvedSources[0] || "text";

  // Phase 9: Verified Resource Bridge
  try {
    validatedResult.verifiedResources = await verifyResourcesForSituation(
      validatedResult.situation,
      validatedResult.intent,
      validatedResult.resources,
      validatedResult.detectedInformation
    );
  } catch (err) {
    console.warn("Could not attach verified resources:", err);
  }

  return validatedResult;
}

/**
 * Intelligent benchmark evaluation used for offline development or when API key is unavailable.
 */
export function generateFallbackAnalysis(
  text: string,
  previousContext?: { situation?: string; intent?: string; previousInput?: string }
): SahaayaAnalysisResult {
  const lower = text.toLowerCase();

  const isScholarshipOrEducation =
    lower.includes("scholarship") ||
    lower.includes("college") ||
    lower.includes("university") ||
    lower.includes("engineering") ||
    lower.includes("student") ||
    lower.includes("fees") ||
    lower.includes("tuition") ||
    lower.includes("degree") ||
    lower.includes("marksheet");

  const isLostDocument =
    lower.includes("driving license") ||
    lower.includes("lost dl") ||
    lower.includes("lost my") ||
    lower.includes("lost aadhaar") ||
    lower.includes("lost passport") ||
    lower.includes("lost pan") ||
    lower.includes("stolen wallet") ||
    lower.includes("duplicate license") ||
    lower.includes("lost document");

  const isFarmerOrCrop =
    lower.includes("crop") ||
    lower.includes("farmer") ||
    lower.includes("agriculture") ||
    lower.includes("unseasonal rain") ||
    lower.includes("crop damage") ||
    lower.includes("compensation") ||
    lower.includes("pm-kisan") ||
    lower.includes("fasal bima");

  const isSkillOrJob =
    lower.includes("job") ||
    lower.includes("unemployed") ||
    lower.includes("skill") ||
    lower.includes("training") ||
    lower.includes("pmkvy") ||
    lower.includes("career") ||
    lower.includes("employment");

  const isMedical =
    lower.includes("blood pressure") ||
    lower.includes("dizzy") ||
    lower.includes("hospital") ||
    lower.includes("doctor") ||
    lower.includes("pain") ||
    lower.includes("prescription") ||
    lower.includes("medicine") ||
    lower.includes("injury") ||
    lower.includes("stroke") ||
    lower.includes("chest") ||
    lower.includes("fever") ||
    lower.includes("cough") ||
    lower.includes("symptoms");

  const isFloodOrDisaster =
    lower.includes("flood") ||
    lower.includes("rain") ||
    lower.includes("water") ||
    lower.includes("storm") ||
    lower.includes("disaster") ||
    lower.includes("stuck") ||
    lower.includes("weather") ||
    lower.includes("waterlogging");

  const isElectricalOrHazard =
    lower.includes("power cable") ||
    lower.includes("sparking") ||
    lower.includes("wire") ||
    lower.includes("fire") ||
    lower.includes("gas leak") ||
    lower.includes("collapse");

  const isVagueMoney =
    lower.trim() === "i need money" ||
    lower.trim() === "need money" ||
    lower.trim() === "money" ||
    lower.trim() === "help me" ||
    lower.trim() === "financial help";

  // Check if this is a follow-up refinement providing state or income
  const hasKarnataka = lower.includes("karnataka");
  const hasIncome = lower.includes("lakh") || lower.includes("income") || lower.includes("1.5") || lower.includes("1.2");

  if (isScholarshipOrEducation || (previousContext?.situation?.includes("college") && (hasKarnataka || hasIncome))) {
    const isRefinedWithKarnataka = hasKarnataka || (previousContext?.previousInput?.toLowerCase().includes("karnataka") ?? false);

    return {
      situation: isRefinedWithKarnataka
        ? "You are a college student in Karnataka from a low-income family seeking state and central government scholarship schemes to fund your education."
        : "You are a college student seeking financial assistance and scholarship opportunities to support your higher education expenses.",
      intent: "Identify verified scholarship schemes, clarify income & category requirements, and prepare for online application.",
      priority: "MEDIUM",
      whatMayHelp: [
        {
          title: isRefinedWithKarnataka ? "State Scholarship Portal (SSP Karnataka)" : "National Scholarship Portal (NSP)",
          description: isRefinedWithKarnataka
            ? "Unified Karnataka state portal for Post-Matric and Merit-cum-Means scholarships across Social Welfare, Tribal Welfare, and Minorities departments."
            : "Central government platform hosting Pre-Matric, Post-Matric, and Merit-cum-Means schemes across Central Ministries.",
          whyRelevant: "Designed for students enrolled in recognized higher education courses with family income below statutory thresholds.",
          category: isRefinedWithKarnataka ? "State Government Scheme" : "Central Government Scheme",
          portalUrl: isRefinedWithKarnataka ? "ssp.postmatric.karnataka.gov.in" : "scholarships.gov.in",
        },
        {
          title: "Central Sector Scheme of Scholarships for College and University Students",
          description: "Department of Higher Education scheme providing financial assistance to meritorious students from low-income families.",
          whyRelevant: "Direct benefit transfer for college tuition support based on board examination percentile.",
          category: "Central Ministry Scheme",
          portalUrl: "scholarships.gov.in",
        },
        {
          title: "AICTE Pragati / Saksham / Post-Graduate Scholarships",
          description: "Technical education grants for girl students, differently-abled scholars, and engineering degree students.",
          whyRelevant: "Applicable if studying in an AICTE-approved technical or engineering institution.",
          category: "Technical Education Support",
          portalUrl: "aicte-india.org",
        },
      ],
      whyRelevant: [
        "Your student status makes you eligible to explore merit-cum-means and post-matric fee reimbursement schemes.",
        "Your reported income bracket places you within standard eligibility tiers for government educational subsidies.",
        "Both Central (NSP) and State portals offer recurring annual grants directly deposited into Aadhaar-seeded bank accounts.",
      ],
      informationStillNeeded: isRefinedWithKarnataka
        ? [
            "Exact degree / course year and college affiliation (e.g., VTU / Bangalore University).",
            "Caste / Category certificate status (General / OBC / SC / ST / EWS).",
            "Whether you have an active Aadhaar-seeded bank account for Direct Benefit Transfer (DBT).",
          ]
        : [
            "Your State of domicile / residence (state scholarship schemes vary significantly).",
            "Approximate annual family income (most need-based schemes require under ₹2.5 Lakhs/year).",
            "Caste / Category (General / OBC / SC / ST / Minority / EWS).",
            "Current course and year of study (e.g., 2nd Year B.Tech / B.Sc).",
          ],
      actions: [
        {
          title: isRefinedWithKarnataka ? "Register on Karnataka SSP Portal" : "Check National Scholarship Portal (NSP) Eligibility",
          description: isRefinedWithKarnataka
            ? "Visit ssp.postmatric.karnataka.gov.in, create your Student ID using your Aadhaar number and college registration details."
            : "Visit scholarships.gov.in and browse 'Central Schemes' and 'State Schemes' matching your course and domicile.",
          reason: "Direct registration ensures you receive application alerts before seasonal deadlines expire.",
          ctaText: "Check Portal",
        },
        {
          title: "Obtain Verified Revenue Income Certificate",
          description:
            "Apply through your local citizen service center (e.g., Nadakacheri in Karnataka / CSC) or revenue department to obtain a certified digital income certificate.",
          reason: "Statutory scholarship schemes require a valid digital income certificate with an active verification barcode.",
          ctaText: "Prepare Certificate",
        },
        {
          title: "Link and Seed Your Bank Account with Aadhaar (DBT Enabled)",
          description:
            "Confirm with your bank branch that your savings account is NPCI-mapped for Direct Benefit Transfer (DBT).",
          reason: "Government scholarship grants are disbursed exclusively via Aadhaar-linked NPCI payment bridge.",
          ctaText: "Verify Bank Link",
        },
        {
          title: "Collect College Bonafide & Previous Marksheets",
          description:
            "Request a Bonafide Student Certificate and fee receipt from your college administrative office.",
          reason: "Required during document verification stage to confirm ongoing enrollment and academic standing.",
          ctaText: "Collect Documents",
        },
      ],
      documentsNeeded: [
        "Aadhaar Card (matching name on school records)",
        "Valid Income Certificate issued by Revenue Authority / Tehsildar",
        "Previous Year / Semester Marksheets with passing grades",
        "College Admission Fee Receipt & Bonafide Certificate",
        "Aadhaar-seeded Bank Passbook (showing Account No. & IFSC)",
        "Caste / Domicile Certificate (if applicable for reserved quotas)",
      ],
      importantInfo: [
        "All government scholarship portals (NSP, SSP) are completely FREE to apply — never pay middlemen or unofficial brokers.",
        "Applications usually open around August-October and close around November-December each academic year.",
        "Ensure your name, date of birth, and parents' names match exactly between Aadhaar and academic marksheets to prevent portal rejection.",
      ],
      recommendedNextStep: isRefinedWithKarnataka
        ? "👉 Visit ssp.postmatric.karnataka.gov.in with your Aadhaar and Nadakacheri Income Certificate number to begin your scholarship application."
        : "👉 Check the National Scholarship Portal (scholarships.gov.in) to verify if fresh application windows are currently active for your course.",
      refinementPrompt: "Tell us your State and family income below so we can pin down exact state schemes and eligibility criteria.",
      detectedInformation: [
        { label: "Education Level", value: "College / University Higher Education" },
        { label: "Financial Context", value: isRefinedWithKarnataka ? "Low income (≤ 2.5L)" : "Low / Constrained family income" },
        { label: "Assistance Type", value: "Merit-cum-Means & Post-Matric Scholarship" },
        { label: "State Focus", value: isRefinedWithKarnataka ? "Karnataka" : "National / Central" },
      ],
      verified: [
        "User is currently pursuing higher education.",
        "User is actively seeking financial scholarship support.",
      ],
      needsConfirmation: isRefinedWithKarnataka
        ? ["Course enrollment verification", "Aadhaar NPCI bank mapping status"]
        : ["State of domicile", "Specific annual income figure", "Category quota eligibility"],
      resources: [
        {
          type: "National Scholarship Portal (Ministry of Education)",
          description: "Central government portal administering nationwide educational assistance.",
        },
        {
          type: "State Higher Education & Social Welfare Department",
          description: "State nodal agency for state-specific tuition reimbursement.",
        },
      ],
      warnings: [
        "SAHAAYA provides decision-support information and does NOT approve scholarships or disburse funds.",
        "Always verify application status directly on official .gov.in portals.",
      ],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  if (isLostDocument) {
    return {
      situation:
        "You have lost your official document or driving license and need to know the proper procedure for securing a police lost report, preventing identity misuse, and obtaining an official replacement.",
      intent:
        "File a loss report, prevent fraudulent misuse of your identity, and apply for an official duplicate document through authorized government channels.",
      priority: "MEDIUM",
      whatMayHelp: [
        {
          title: "State Police Online Lost Document / Article Report (DDR)",
          description: "Free online citizen service to record missing documents and receive an official non-cognizable loss report certificate.",
          whyRelevant: "Official proof of loss required before any government department issues a duplicate.",
          category: "Police Citizen Services",
          portalUrl: "digitalpolice.gov.in",
        },
        {
          title: "Parivahan Sewa Duplicate Driving License Service",
          description: "Ministry of Road Transport & Highways portal for online application and doorstep delivery of duplicate smart-card DL.",
          whyRelevant: "The only authorized national platform for driving license services without visiting RTO multiple times.",
          category: "Transport & RTO Portal",
          portalUrl: "parivahan.gov.in",
        },
        {
          title: "DigiLocker Digital Document Access",
          description: "Government-authorized digital repository where digital copies of your DL, RC, and Aadhaar are legally valid under IT Act 2000.",
          whyRelevant: "Allows immediate legal driving while waiting for physical duplicate delivery.",
          category: "Digital Identity",
          portalUrl: "digilocker.gov.in",
        },
      ],
      whyRelevant: [
        "A formal police lost report protects you from legal liability if the lost document is misused by third parties.",
        "Online transport portals (Parivahan) allow seamless replacement without touts or extra charges.",
        "Digital copies via DigiLocker provide instant legal validity for road transit.",
      ],
      informationStillNeeded: [
        "Exact document type (Driving License, Aadhaar card, PAN, or Passport).",
        "Driving License Number or Registered Phone Number linked with Sarathi portal.",
        "State and RTO where the original license was issued.",
      ],
      actions: [
        {
          title: "File an Online Lost Article Report on State Police Portal",
          description:
            "Log in to your state police citizen service portal or app (e.g., Delhi Police / Karnataka Police / UP Cop) and submit a 'Lost Article Report'. Download the digitally signed PDF acknowledgement.",
          reason: "Provides statutory protection against identity theft and serves as mandatory attachment for duplicate issuance.",
          ctaText: "File Loss Report",
        },
        {
          title: "Access Temporary Digital Copy on DigiLocker / mParivahan",
          description:
            "Log in to DigiLocker with your Aadhaar, search for Ministry of Road Transport, and fetch your digital Driving License.",
          reason: "Legally valid under the Motor Vehicles Act for inspection by traffic authorities during the replacement window.",
          ctaText: "Open DigiLocker",
        },
        {
          title: "Submit Duplicate DL Application on Parivahan Sewa",
          description:
            "Go to parivahan.gov.in → 'Driving License Related Services' → Select your State → 'Apply for Duplicate DL'. Enter your DL number, upload the police report, and pay the nominal fee online.",
          reason: "Triggers official smart card printing and dispatch by your jurisdictional RTO.",
          ctaText: "Apply on Parivahan",
        },
      ],
      documentsNeeded: [
        "Police Lost Article Report / Daily Diary (DDR) acknowledgement copy",
        "Photocopy of lost DL (if available) or DL Number",
        "Valid proof of identity and address (Aadhaar / Voter ID / Passport)",
        "Passport size photograph and digital signature scan",
      ],
      importantInfo: [
        "Do NOT pay agents or touts outside the RTO; duplicate DL fees are fixed government tariffs paid directly on Parivahan.",
        "Never drive without a valid digital or physical driving permit.",
        "If you suspect theft or foul play, file a formal FIR instead of a simple lost report.",
      ],
      recommendedNextStep:
        "👉 File an online Lost Article Report on your state police citizen app to secure your official reference number immediately.",
      refinementPrompt: "Tell us your State and whether you know your document/DL number so we can provide exact RTO steps.",
      detectedInformation: [
        { label: "Document Status", value: "Lost / Missing official license" },
        { label: "Priority Need", value: "Police loss report & duplicate issuance" },
        { label: "Transit Risk", value: "Temporary inability to produce physical DL" },
      ],
      verified: ["User reports lost driving license / identity document."],
      needsConfirmation: ["Document identification number", "Issuing RTO jurisdiction", "Access to DigiLocker"],
      resources: [
        {
          type: "Ministry of Road Transport & Highways (Parivahan Sewa)",
          description: "Official central repository for Sarathi driving license duplicate applications.",
        },
        {
          type: "State Police Citizen Portal",
          description: "Online portal for issuing non-cognizable lost property reports.",
        },
      ],
      warnings: [
        "Always ensure you apply exclusively on parivahan.gov.in and avoid unofficial imitation websites.",
      ],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  if (isFarmerOrCrop) {
    return {
      situation:
        "You are a farmer experiencing crop damage or seasonal loss and seeking official relief, insurance claims, and government compensation support.",
      intent:
        "Report crop loss within statutory deadlines, file insurance claims under PMFBY, and verify eligibility for state disaster relief compensation.",
      priority: "HIGH",
      whatMayHelp: [
        {
          title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          description: "Government crop insurance scheme providing comprehensive financial risk coverage against localized natural calamities and post-harvest losses.",
          whyRelevant: "Covers localized crop inundation, hailstorms, and unseasonal rainfall for insured farmers.",
          category: "Agricultural Insurance",
          portalUrl: "pmfby.gov.in",
        },
        {
          title: "State Disaster Response Fund (SDRF) Input Subsidy",
          description: "Government disaster relief subsidy disbursed directly to affected farmers facing >33% crop loss due to declared natural disasters.",
          whyRelevant: "Applicable even for un-insured farmers through local revenue and agriculture department surveys.",
          category: "State Disaster Relief",
          portalUrl: "agricoop.nic.in",
        },
        {
          title: "Kisan Credit Card (KCC) Crop Loan Restructuring",
          description: "Provision to convert short-term crop loans into medium-term relief loans during severe crop loss without default penalties.",
          whyRelevant: "Prevents bank recovery pressure during crop failure periods.",
          category: "Institutional Credit Relief",
        },
      ],
      whyRelevant: [
        "Timely reporting ensures insurance surveyors inspect the field before crop residue clears.",
        "SDRF input subsidy provides direct financial assistance to recover preliminary input costs.",
      ],
      informationStillNeeded: [
        "Date and exact cause of crop damage (e.g. unseasonal rain, flood, pest, drought).",
        "Sown crop name, acreage, and estimated percentage of damage.",
        "Whether you have an active PMFBY insurance policy linked to your KCC or bank loan.",
        "Village, Taluk/Tehsil, and District location.",
      ],
      actions: [
        {
          title: "Intimate Crop Loss within 72 Hours on PMFBY App",
          description:
            "Open the 'Crop Insurance' mobile app or call the PMFBY toll-free helpline (14447) within 72 hours of damage to lodge your claim intimation.",
          reason: "Insurance rules strictly mandate intimation within 72 hours for localized natural calamities.",
          ctaText: "Lodge Claim",
        },
        {
          title: "Notify Village Administrative Officer / Krishi Vigyan Kendra",
          description:
            "Submit written intimation with field survey number to the Village Accountant / Patwari / Agriculture Extension Officer.",
          reason: "Initiates the official joint field inspection team (Revenue + Agriculture + Insurance).",
          ctaText: "Notify Officer",
        },
        {
          title: "Photograph and Document Field Damage with Geo-Tags",
          description:
            "Take clear, wide-angle photos and videos of the damaged field showing waterlogging, broken stems, or spoiled harvest with date stamps.",
          reason: "Acts as vital secondary evidence during insurance claim assessment.",
          ctaText: "Record Photos",
        },
      ],
      documentsNeeded: [
        "Land Record / RoR / Patta / 7-12 extract copy showing survey number",
        "Sowing Certificate issued by Village Patwari / Agriculture Officer",
        "PMFBY Insurance Policy Receipt / KCC Bank Loan Passbook entry",
        "Aadhaar Card and Aadhaar-seeded Bank Account Passbook",
        "Geo-tagged photographs of crop damage",
      ],
      importantInfo: [
        "CRITICAL: Individual localized crop loss claims must be lodged within 72 hours of the calamity.",
        "Never burn or clear damaged crop residue until the official joint inspection survey is complete.",
        "Input subsidy from SDRF is distributed without commission directly to farmer bank accounts.",
      ],
      recommendedNextStep:
        "👉 Call the PMFBY helpline 14447 or open the Crop Insurance App to register your 72-hour crop loss intimation right now.",
      refinementPrompt: "Share your crop type, damage date, and district below to get specific local extension officer guidance.",
      detectedInformation: [
        { label: "Domain", value: "Agriculture & Crop Loss Relief" },
        { label: "Urgency Factor", value: "72-hour statutory claim intimation deadline" },
        { label: "Primary Need", value: "PMFBY claim & SDRF input subsidy" },
      ],
      verified: ["Farmer reports crop damage due to weather / natural factors."],
      needsConfirmation: ["Insurance policy status", "Exact survey number", "72-hour intimation status"],
      resources: [
        {
          type: "Ministry of Agriculture & Farmers Welfare (PMFBY)",
          description: "Central portal for crop insurance registration and claim tracking.",
        },
        {
          type: "District Agriculture Department / Krishi Bhavan",
          description: "Local agricultural officers responsible for field survey verification.",
        },
      ],
      warnings: [
        "Claims reported after 72 hours of localized damage face severe risk of insurance rejection under PMFBY guidelines.",
      ],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  if (isSkillOrJob) {
    return {
      situation:
        "You are seeking government-recognized skill development programs, vocational training, or subsidized employment initiatives to enhance career prospects.",
      intent:
        "Identify certified vocational courses, check free government sponsorship, and enroll in recognized skill centers with placement support.",
      priority: "LOW",
      whatMayHelp: [
        {
          title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
          description: "Flagship skill certification scheme providing industry-relevant skill training with government sponsorship and certification reward.",
          whyRelevant: "Free certified courses in healthcare, IT, automotive, electronics, logistics, and management sectors.",
          category: "Central Skill Mission",
          portalUrl: "skillindia.gov.in",
        },
        {
          title: "National Apprenticeship Promotion Scheme (NAPS)",
          description: "Government portal linking candidates with certified industrial apprenticeships with monthly stipend support.",
          whyRelevant: "Provides hands-on on-the-job training with stipend sharing by government.",
          category: "Apprenticeship & On-Job Training",
          portalUrl: "apprenticeshipindia.gov.in",
        },
        {
          title: "National Career Service (NCS Portal)",
          description: "Free job search and career counseling portal run by Ministry of Labour & Employment.",
          whyRelevant: "Verified job vacancies, job fairs, and free career guidance workshops.",
          category: "Employment Portal",
          portalUrl: "ncs.gov.in",
        },
      ],
      whyRelevant: [
        "Government-recognized certifications (NSQF aligned) improve industry hiring employability.",
        "All PMKVY training programs are 100% sponsored without student tuition fees.",
      ],
      informationStillNeeded: [
        "Highest educational qualification (10th, 12th, Graduate, Diploma).",
        "Preferred sector / trade of interest (e.g. IT, Healthcare, Solar, Welding, Digital Marketing).",
        "State and City of residence.",
      ],
      actions: [
        {
          title: "Explore Active Courses on Skill India Portal",
          description:
            "Visit skillindia.gov.in and search for accredited training centers in your district.",
          reason: "Enables you to identify upcoming batch start dates and available trade courses.",
          ctaText: "Search Courses",
        },
        {
          title: "Register on National Career Service (NCS)",
          description:
            "Create your free Jobseeker profile on ncs.gov.in using your Aadhaar number.",
          reason: "Connects you to nationwide job fairs and government-verified private employer listings.",
          ctaText: "Create Profile",
        },
        {
          title: "Visit Nearest Pradhan Mantri Kaushal Kendra (PMKK)",
          description:
            "Visit your district PMKK center for in-person counseling and free biometric enrollment.",
          reason: "Center counselors help match your aptitude with high-demand local trade vacancies.",
          ctaText: "Find Center",
        },
      ],
      documentsNeeded: [
        "Aadhaar Card",
        "Educational Marksheets / Certificates (10th, 12th, or Degree)",
        "Passport size photographs",
        "Bank Account details (for apprenticeship stipend credits)",
      ],
      importantInfo: [
        "All PMKVY training is 100% free — beware of private agencies demanding advance registration or placement fees.",
        "Look for NSQF (National Skills Qualifications Framework) certification badges on course completion certificates.",
      ],
      recommendedNextStep:
        "👉 Visit skillindia.gov.in to search for active PMKVY certified skill training centers in your district.",
      refinementPrompt: "Tell us your qualification and sector of interest below to find matching courses near you.",
      detectedInformation: [
        { label: "Assistance Type", value: "Skill Training & Employment Discovery" },
        { label: "Program Framework", value: "Skill India / NSQF Aligned" },
      ],
      verified: ["User is seeking vocational skill training and employment pathways."],
      needsConfirmation: ["Educational level", "Trade specialization", "District location"],
      resources: [
        {
          type: "National Skill Development Corporation (NSDC)",
          description: "Government nodal agency administering PMKVY training centers.",
        },
      ],
      warnings: ["Do not pay fees to unauthorized brokers claiming guaranteed government job appointments."],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  if (isVagueMoney) {
    return {
      situation:
        "You are seeking financial assistance or economic support. Because your specific situation is broad, we have outlined the main legitimate public welfare, livelihood, and emergency aid pathways available.",
      intent:
        "Clarify personal context to identify whether student aid, agricultural relief, small vendor support, senior welfare, or emergency assistance applies.",
      priority: "LOW",
      whatMayHelp: [
        {
          title: "Direct Benefit Transfer (DBT) Welfare Schemes",
          description: "Government subsistence support for eligible categories including pensions, maternity support, disability aid, and ration assistance.",
          whyRelevant: "Provides regular statutory subsidies directly into beneficiary bank accounts.",
          category: "Social Welfare",
          portalUrl: "dbtbharat.gov.in",
        },
        {
          title: "PM SVANidhi / Mudra Scheme (Micro & Small Enterprise)",
          description: "Collateral-free subsidized micro-credit and working capital loans for small vendors, artisans, and self-employed individuals.",
          whyRelevant: "Official low-interest working capital support without private loan sharks.",
          category: "Livelihood Support",
          portalUrl: "pmsvanidhi.mohua.gov.in",
        },
        {
          title: "National Scholarship Portal & Education Subsidies",
          description: "Need-based fee waivers and educational stipends for students enrolled in schools or colleges.",
          whyRelevant: "Applicable if the financial need relates to tuition, exam fees, or study expenses.",
          category: "Education Support",
          portalUrl: "scholarships.gov.in",
        },
      ],
      whyRelevant: [
        "Government assistance is categorized by target beneficiary group (students, farmers, artisans, seniors, patients).",
        "Narrowing down your context will unlock precise scheme applications.",
      ],
      informationStillNeeded: [
        "What is the specific purpose of the financial need? (e.g., college education, medical bills, small business capital, farmer relief, or elderly support).",
        "Your State of residence.",
        "Your approximate annual family income.",
      ],
      actions: [
        {
          title: "Specify Your Category in the Box Below",
          description:
            "Provide brief details about your situation (e.g., 'I am a 3rd year student in UP' or 'I want to start a street vending business in Delhi').",
          reason: "Enables SAHAAYA to match you with exact targeted government schemes.",
          ctaText: "Refine Details",
        },
        {
          title: "Ensure You Have an Aadhaar-Seeded Bank Account",
          description:
            "Visit your bank branch and request an NPCI Aadhaar seeding form.",
          reason: "Mandatory for all government Direct Benefit Transfer (DBT) disbursements.",
          ctaText: "Check Bank",
        },
      ],
      documentsNeeded: [
        "Aadhaar Card",
        "Ration Card / BPL Card (if applicable)",
        "Active Bank Account Passbook",
        "Income Certificate from Revenue Authority",
      ],
      importantInfo: [
        "BEWARE OF LOAN SCAMS: Never download unverified instant loan apps from messages or pay advance processing fees.",
        "All legitimate government welfare schemes are free to apply on official .gov.in domains.",
      ],
      recommendedNextStep:
        "👉 Tell us your specific situation below (e.g., student education, small business, agriculture, or medical aid) so we can guide you accurately.",
      refinementPrompt: "Please tell us what kind of support you need (e.g., student scholarship, small business loan, agriculture aid, or medical assistance) and your state.",
      detectedInformation: [
        { label: "Request Type", value: "General Financial Support" },
        { label: "Stage", value: "Needs context refinement" },
      ],
      verified: ["User expressed a need for financial or economic assistance."],
      needsConfirmation: ["Specific category of need", "State of residence", "Family income"],
      resources: [
        {
          type: "Direct Benefit Transfer (DBT) Mission",
          description: "Government directory of central and state benefit schemes.",
        },
      ],
      warnings: [
        "Never pay advance registration money to individuals promising government grant approvals.",
      ],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  if (isMedical) {
    return {
      situation:
        "You are seeking immediate guidance regarding a medical situation involving reported severe blood pressure (190/110 mmHg) and dizziness while in transit to emergency medical care.",
      intent:
        "Secure acute clinical evaluation, maintain safe in-transit stabilization, and reach the nearest hospital emergency department without delay.",
      priority: "CRITICAL",
      whatMayHelp: [
        {
          title: "Emergency Medical Services (Ambulance / Dispatch 108 / 112)",
          description: "Official emergency paramedic transit equipped with active resuscitation tools and siren traffic priority.",
          whyRelevant: "Essential for acute in-transit stabilization when traffic gridlock prevents rapid private vehicle arrival.",
          category: "Emergency Medical Care",
        },
        {
          title: "24/7 Hospital Emergency & Trauma Triage Department",
          description: "Nearest tertiary healthcare facility with continuous clinical physician evaluation and cardiac monitoring.",
          whyRelevant: "Immediate intravenous pressure regulation under clinical supervision.",
          category: "Hospital Emergency",
        },
        {
          title: "Ayushman Bharat PM-JAY Emergency Health Coverage",
          description: "National health protection scheme covering secondary and tertiary emergency hospitalizations up to ₹5 Lakhs per family.",
          whyRelevant: "Ensures cashless emergency admission at all empaneled public and private hospitals.",
          category: "Healthcare Subsidy",
          portalUrl: "pmjay.gov.in",
        },
      ],
      whyRelevant: [
        "A blood pressure reading of 190/110 mmHg with dizziness represents a hypertensive emergency requiring urgent clinical evaluation.",
        "Paramedic escort provides emergency siren right-of-way in dense traffic.",
      ],
      informationStillNeeded: [
        "Presence of severe red-flag symptoms: chest tightness, acute breathlessness, slurred speech, or facial weakness.",
        "Recent medication history and timing of last antihypertensive dose.",
        "Current exact GPS location and proximity to the nearest cardiac center.",
      ],
      actions: [
        {
          title: "Contact Emergency Medical Dispatch (Dial 108 / 112) Immediately",
          description:
            "Call 108 / 112 immediately to request paramedic interception or lane clearance if traffic is stationary.",
          reason: "Paramedics have transit authority and can initiate stabilization before reaching the hospital.",
          ctaText: "Call 112",
        },
        {
          title: "Keep Patient Seated Upright, Calm, and Loosen Tight Clothing",
          description:
            "Ensure the person remains comfortably seated upright. Avoid sudden standing, stairs, or rapid head turns. Loosen tight neck collars.",
          reason: "Minimizes postural pressure spikes and reduces cerebral hypoperfusion fall risk.",
          ctaText: "Stabilize Patient",
        },
        {
          title: "Hand Over Prescription History to Hospital Triage",
          description:
            "Place all historical medical documents, drug strips, and government health cards in hand for instant triage handover.",
          reason: "Enables emergency doctors to choose safe intravenous agents without adverse drug interactions.",
          ctaText: "Prepare Records",
        },
      ],
      documentsNeeded: [
        "Current daily prescription strips and historical medical files",
        "Ayushman Bharat Card / Health Insurance Card",
        "Aadhaar Card or Photo ID for emergency admission desk",
      ],
      importantInfo: [
        "SAHAAYA provides decision-support structure and does NOT issue medical diagnoses or replace licensed clinical evaluation.",
        "DO NOT administer borrowed or unprescribed blood pressure pills without direct physician direction; rapid drops in blood pressure can precipitate severe hypoperfusion.",
        "If the patient exhibits sudden facial drooping, arm drift, or speech changes, communicate potential stroke symptoms to dispatch immediately.",
      ],
      recommendedNextStep:
        "👉 Call 108 / 112 or proceed immediately to the nearest hospital Emergency Department for professional clinical triage.",
      refinementPrompt: "If you have medical records or new symptom updates, share them below to refine this briefing.",
      detectedInformation: [
        { label: "Reported Vital", value: "Blood Pressure 190/110 mmHg" },
        { label: "Reported Symptom", value: "Dizziness, acute hypertension" },
        { label: "Logistical Context", value: "Trapped in traffic en route to hospital" },
      ],
      verified: [
        "Caregiver reports patient is experiencing dizziness with 190/110 mmHg BP reading.",
        "Transit is currently impeded by road traffic.",
      ],
      needsConfirmation: ["Presence of chest pain or neurological deficits", "Timing of last medications"],
      resources: [
        {
          type: "Emergency Medical Services (108 / 112 Ambulance)",
          description: "Official paramedic transit for rapid medical extraction.",
        },
        {
          type: "Hospital Emergency Department",
          description: "24/7 tertiary care hospital for clinical stabilization.",
        },
      ],
      warnings: [
        "SAHAAYA is not a doctor. Seek emergency medical evaluation immediately for acute symptoms.",
      ],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  if (isFloodOrDisaster) {
    return {
      situation:
        "You are facing active roadway flash flooding and heavy rainfall resulting in immobilized vehicles and vulnerable individuals exposed to rising water.",
      intent:
        "Ensure immediate physical safety on high ground, avoid submerged electrical hazards, and alert disaster response teams.",
      priority: "CRITICAL",
      whatMayHelp: [
        {
          title: "Disaster Management & Rescue Helpline (Dial 112 / State Disaster Control Room)",
          description: "State and National Disaster Response Force (NDRF / SDRF) equipped with high-clearance rescue rafts and emergency extraction gear.",
          whyRelevant: "Coordinated evacuation for vulnerable elderly occupants trapped in rising water.",
          category: "Emergency Disaster Relief",
        },
        {
          title: "Designated High-Ground Community Evacuation Shelters",
          description: "Government schools, community halls, and dry municipal staging areas equipped with basic relief supplies.",
          whyRelevant: "Immediate shelter from rising water and ongoing heavy precipitation.",
          category: "Public Evacuation Shelters",
        },
      ],
      whyRelevant: [
        "Water rising towards vehicle door sills poses immediate entrapment and flotation hazards.",
        "Elderly individuals require prioritized assistance to avoid hypothermia and mobility hazards.",
      ],
      informationStillNeeded: [
        "Water depth trend (rising rapidly vs stabilized).",
        "Exact landmark or street intersection coordinates.",
        "Number of stranded occupants needing mobility assistance.",
      ],
      actions: [
        {
          title: "Move to High Ground Sturdy Structure if Safe",
          description:
            "If water level is approaching vehicle floorboards, safely guide occupants out to a nearby multi-story building or elevated dry ground before water pressure traps car doors.",
          reason: "As little as 6 inches of fast water sweeps individuals; 12 inches floats small cars.",
          ctaText: "Move to Safety",
        },
        {
          title: "Call Emergency Services (112) with Exact Landmark",
          description:
            "Contact 112 or local Disaster Control Room. Clearly state: 'Stranded elderly individuals in rising water at [Landmark]'.",
          reason: "Enables rescue dispatch to assign high-clearance boats or disaster rescue squads.",
          ctaText: "Call 112",
        },
        {
          title: "Stay Clear of Submerged Transformers and Culverts",
          description:
            "Do not wade near fallen wires, utility poles, or bubbling roadside drains.",
          reason: "Prevents unseen electrocution and suction entrapment in submerged drainage openings.",
          ctaText: "Avoid Hazards",
        },
      ],
      documentsNeeded: [
        "Mobile phone in a sealed plastic bag",
        "Essential identification cards kept in waterproof pockets",
        "Prescription medicines for elderly family members",
      ],
      importantInfo: [
        "NEVER attempt to drive through flooded roads ('Turn Around, Don't Drown').",
        "Always follow instructions from civil defense and disaster management personnel.",
      ],
      recommendedNextStep:
        "👉 Move occupants to higher ground immediately and dial 112 with your specific landmark coordinates.",
      refinementPrompt: "Share your exact landmark or water level changes below to update safety guidance.",
      detectedInformation: [
        { label: "Hazard", value: "Roadway inundation & rising water" },
        { label: "At-Risk Population", value: "Stranded individuals / elderly occupants" },
      ],
      verified: ["Heavy rain has caused roadway flooding.", "Traffic is stationary."],
      needsConfirmation: ["Current water depth", "Exact GPS coordinates", "Medical needs of elderly occupants"],
      resources: [
        {
          type: "State Disaster Management Authority (SDMA / NDRF)",
          description: "Emergency rescue personnel equipped for flood extractions.",
        },
      ],
      warnings: ["Treat all floodwaters near electrical poles as potentially energized."],
      analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sourceType: "text",
    };
  }

  // General fallback
  return {
    situation: `You are facing a real-world situation regarding: "${text.slice(0, 160)}${text.length > 160 ? "..." : ""}". We have structured your next actions and relevant official resources to help you resolve this efficiently.`,
    intent: "Extract key facts, identify relevant support categories, and sequence practical next actions.",
    priority: "MEDIUM",
    whatMayHelp: [
      {
        title: "Designated Public Administration / Citizen Portal",
        description: "Official government department or municipal portal governing this domain.",
        whyRelevant: "Provides authorized procedures, forms, and verified tracking.",
        category: "Public Administration",
      },
      {
        title: "Legal Aid & Citizen Advisory Clinics",
        description: "District Legal Services Authority or accredited community advisory services.",
        whyRelevant: "Free initial guidance for administrative or procedural disputes.",
        category: "Citizen Advisory",
      },
    ],
    whyRelevant: [
      "Official institutional channels ensure your case is documented with an auditable reference number.",
      "Direct engagement prevents reliance on unverified third-party intermediaries.",
    ],
    informationStillNeeded: [
      "Specific geographic location and municipal jurisdiction.",
      "Exact dates, formal document reference numbers, or notices involved.",
      "Specific outcome or remedy you are seeking.",
    ],
    actions: [
      {
        title: "Assemble Core Identification & Supporting Records",
        description:
          "Gather all relevant documents, receipts, dates, and official notices into a single folder.",
        reason: "Ensures institutional inquiries are supported by concrete evidentiary records.",
        ctaText: "Organize Records",
      },
      {
        title: "Engage the Authorized Department Directly",
        description:
          "Visit the official government or service portal for your jurisdiction to initiate your request.",
        reason: "Direct institutional engagement avoids misdirection and unnecessary intermediary costs.",
        ctaText: "Check Portal",
      },
      {
        title: "Maintain a Written Log of Reference Numbers",
        description:
          "Record application IDs, dates submitted, and official contact names for follow-up.",
        reason: "Provides a reliable trail for administrative tracking.",
        ctaText: "Log Reference",
      },
    ],
    documentsNeeded: [
      "Aadhaar Card or Government Photo Identity Card",
      "Relevant bills, receipts, or correspondence records",
      "Proof of address / residence",
    ],
    importantInfo: [
      "Always verify portal domains end in official government designations (.gov.in / .nic.in).",
      "Do not share confidential OTPs, passwords, or banking credentials.",
    ],
    recommendedNextStep:
      "👉 Organize your relevant documents and check the official government or service portal for your jurisdiction.",
    refinementPrompt: "Provide more details below (location, documents in hand, or specific goal) to refine your plan.",
    detectedInformation: [
      { label: "Reported Topic", value: text.slice(0, 100) },
      { label: "Status", value: "Initial assessment" },
    ],
    verified: ["User provided situational description."],
    needsConfirmation: ["Specific location", "Key document numbers"],
    resources: [
      {
        type: "Designated Public Authority",
        description: "Official agency governing this domain.",
      },
    ],
    warnings: [
      "This analysis is structured guidance and requires validation with certified local authorities.",
    ],
    analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    sourceType: "text",
  };
}
