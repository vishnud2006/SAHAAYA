import { SahaayaAnalysisResult, HandoffRole, HandoffBriefing, HandoffSection, SupportedLanguage } from "@/types";

export const HANDOFF_ROLES: Array<{
  id: HandoffRole;
  title: string;
  documentTitle: string;
  icon: string;
  purpose: string;
  targetAudience: string;
}> = [
  {
    id: "healthcare",
    title: "Healthcare Professional",
    documentTitle: "HEALTHCARE CASE BRIEF",
    icon: "🏥",
    purpose: "Clinical context and relevant information",
    targetAudience: "Physicians, ER triage staff, triage nurses, paramedic intake"
  },
  {
    id: "emergency",
    title: "Emergency Responder",
    documentTitle: "FIELD INCIDENT BRIEF",
    icon: "🚨",
    purpose: "Fast field situation briefing",
    targetAudience: "Police dispatch, fire rescue squads, disaster response units"
  },
  {
    id: "volunteer",
    title: "Community Volunteer",
    documentTitle: "COMMUNITY SUPPORT BRIEF",
    icon: "🤝",
    purpose: "Immediate community support",
    targetAudience: "Relief volunteers, community caseworkers, mutual aid coordinators"
  },
  {
    id: "government",
    title: "Government / Benefits Officer",
    documentTitle: "BENEFITS NAVIGATION BRIEF",
    icon: "🏛",
    purpose: "Benefits and documentation context",
    targetAudience: "Welfare caseworkers, Common Service Centers, municipal officers"
  },
  {
    id: "family",
    title: "Family / Caregiver",
    documentTitle: "FAMILY ACTION SUMMARY",
    icon: "👨‍👩‍👧",
    purpose: "Simple action summary",
    targetAudience: "Family members, caregivers, personal contacts"
  }
];

export function formatBriefingAsPlainText(briefing: HandoffBriefing): string {
  if (briefing.plainText) return briefing.plainText;

  let text = `${briefing.documentTitle || briefing.title}\n`;
  text += `Recipient: ${briefing.roleTitle || briefing.roleName}\n`;
  text += `Priority: ${briefing.priority}\n`;
  text += `Generated: ${briefing.generatedAt}\n`;
  text += `Case ID: ${briefing.caseId}\n\n`;

  briefing.sections.forEach((sec) => {
    text += `--- ${sec.title} ---\n`;
    if (sec.content) text += `${sec.content}\n`;
    if (sec.items && sec.items.length > 0) {
      sec.items.forEach((item) => {
        text += `• ${item}\n`;
      });
    }
    text += `\n`;
  });

  text += `\nDISCLAIMER:\n${briefing.statutoryFooter || briefing.disclaimer || ""}\n`;
  return text.trim();
}

export function generateHandoffBriefing(
  result: SahaayaAnalysisResult,
  role: HandoffRole,
  rawInput?: string,
  language: SupportedLanguage = "en",
  caseId?: string
): HandoffBriefing {
  return generateRoleBriefing(result, role, caseId);
}

export function generateRoleBriefing(
  result: SahaayaAnalysisResult,
  role: HandoffRole,
  caseId: string = "CASE-" + Math.random().toString(36).substring(2, 8).toUpperCase()
): HandoffBriefing {
  const generatedAt = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const statutoryFooter =
    "AI-assisted briefing. Verify critical information with the appropriate professional or authority.";

  switch (role) {
    // 1. HEALTHCARE PROFESSIONAL
    case "healthcare": {
      const sections: HandoffSection[] = [
        {
          title: "1. CLINICAL SITUATION & CHIEF PRESENTATION",
          content: result.situation,
          badge: "USER REPORTED",
        },
        {
          title: "2. REPORTED VITALS, SYMPTOMS & CONSTRAINTS",
          items: (result.detectedInformation || []).map((f) => `${f.label}: ${f.value}`),
          badge: "USER REPORTED",
        },
        {
          title: "3. KNOWN & VERIFIED INFORMATION",
          items: result.verified.length > 0 ? result.verified : ["No prior baseline data verified."],
        },
        {
          title: "4. CRITICAL CLINICAL GAPS & UNCERTAINTIES",
          items: result.needsConfirmation,
          badge: "REQUIRES PROFESSIONAL CONFIRMATION",
        },
        {
          title: "5. RECOMMENDED IMMEDIATE CLINICAL INTAKE STEPS",
          items: result.actions.map(
            (a, i) => `${i + 1}. ${a.title} — ${a.description} (Rationale: ${a.reason})`
          ),
        },
        {
          title: "6. SAFETY LIMITATIONS & CONTRAINDICATION WARNINGS",
          items: result.warnings,
          badge: "STRICT MEDICAL SAFETY",
        },
      ];

      const plainText = `SAHAAYA HEALTHCARE CASE BRIEF
Recipient: Healthcare Professional
Case ID: ${caseId}
Priority: ${result.priority}
Generated: ${generatedAt}

SITUATION (USER REPORTED):
${result.situation}

REPORTED METRICS & SYMPTOMS:
${(result.detectedInformation || []).map((f) => `• ${f.label}: ${f.value}`).join("\n")}

VERIFIED CONTEXT:
${result.verified.map((v) => `• ${v}`).join("\n")}

REQUIRES PROFESSIONAL CONFIRMATION:
${result.needsConfirmation.map((c) => `• ${c}`).join("\n")}

RECOMMENDED ACTION SEQUENCE:
${result.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join("\n")}

IMPORTANT WARNINGS:
${result.warnings.map((w) => `• ${w}`).join("\n")}

---
${statutoryFooter}`;

      return {
        role,
        roleTitle: "Healthcare Professional",
        roleName: "Healthcare Professional",
        roleIcon: "🏥",
        title: "HEALTHCARE CASE BRIEF",
        documentTitle: "HEALTHCARE CASE BRIEF",
        priority: result.priority,
        caseId,
        generatedAt,
        sections,
        plainText,
        statutoryFooter,
        disclaimer: statutoryFooter,
      };
    }

    // 2. EMERGENCY RESPONDER
    case "emergency": {
      const locationFacts = (result.detectedInformation || []).filter((f) =>
        f.label.toLowerCase().includes("location") ||
        f.label.toLowerCase().includes("road") ||
        f.label.toLowerCase().includes("transit") ||
        f.label.toLowerCase().includes("traffic")
      );

      const sections: HandoffSection[] = [
        {
          title: "1. FIELD INCIDENT SUMMARY",
          content: result.situation,
          badge: "INCIDENT OVERVIEW",
        },
        {
          title: "2. REPORTED LOCATION & TRANSIT OBSTACLES",
          items:
            locationFacts.length > 0
              ? locationFacts.map((f) => `${f.label}: ${f.value}`)
              : ["Specific street coordinates not confirmed in initial input. Check dispatch caller ID."],
        },
        {
          title: "3. PEOPLE AFFECTED & REPORTED HAZARDS",
          items: (result.detectedInformation || [])
            .filter((f) => !locationFacts.includes(f))
            .map((f) => `${f.label}: ${f.value}`),
        },
        {
          title: "4. KNOWN FACTS vs UNKNOWN FIELD PARAMETERS",
          items: [
            ...result.verified.map((v) => `[KNOWN] ${v}`),
            ...result.needsConfirmation.map((c) => `[UNKNOWN / NEEDS FIELD CHECK] ${c}`),
          ],
        },
        {
          title: "5. IMMEDIATE RECOMMENDED FIELD ACTIONS",
          items: result.actions.map((a, i) => `${i + 1}. ${a.title} (${a.reason})`),
        },
        {
          title: "6. TACTICAL SAFETY WARNINGS",
          items: result.warnings,
          badge: "LIFE SAFETY ADVISORY",
        },
      ];

      const plainText = `SAHAAYA FIELD INCIDENT BRIEF
Recipient: Emergency Responder
Case ID: ${caseId}
Priority: ${result.priority}
Generated: ${generatedAt}

INCIDENT SUMMARY:
${result.situation}

LOCATION & CONSTRAINTS:
${locationFacts.length > 0 ? locationFacts.map((f) => `• ${f.label}: ${f.value}`).join("\n") : "• Location coordinates require direct dispatcher verification."}

KNOWN & UNKNOWN PARAMETERS:
${result.verified.map((v) => `• [KNOWN] ${v}`).join("\n")}
${result.needsConfirmation.map((c) => `• [UNKNOWN] ${c}`).join("\n")}

RECOMMENDED FIELD ACTIONS:
${result.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join("\n")}

SAFETY WARNINGS:
${result.warnings.map((w) => `• ${w}`).join("\n")}

---
${statutoryFooter}`;

      return {
        role,
        roleTitle: "Emergency Responder",
        roleName: "Emergency Responder",
        roleIcon: "🚨",
        title: "FIELD INCIDENT BRIEF",
        documentTitle: "FIELD INCIDENT BRIEF",
        priority: result.priority,
        caseId,
        generatedAt,
        sections,
        plainText,
        statutoryFooter,
        disclaimer: statutoryFooter,
      };
    }

    // 3. COMMUNITY VOLUNTEER
    case "volunteer": {
      const sections: HandoffSection[] = [
        {
          title: "1. COMMUNITY SITUATION & PEOPLE AFFECTED",
          content: result.situation,
        },
        {
          title: "2. IMMEDIATE NON-CLINICAL SUPPORT NEEDS",
          content: result.intent,
        },
        {
          title: "3. WHAT IS CURRENTLY KNOWN",
          items: result.verified,
        },
        {
          title: "4. WHAT REQUIRES COMMUNITY CONFIRMATION",
          items: result.needsConfirmation,
        },
        {
          title: "5. SAFE VOLUNTEER ACTIONS & ACCOMPANIMENT",
          items: result.actions.map(
            (a, i) => `${i + 1}. ${a.title} — ${a.description}`
          ),
        },
        {
          title: "6. OFFICIAL VOLUNTEER BOUNDARIES & SAFETY",
          items: [
            ...result.warnings,
            "Do not accept money, administer medications, or promise guaranteed government disbursements on behalf of authorities.",
          ],
        },
      ];

      const plainText = `SAHAAYA COMMUNITY SUPPORT BRIEF
Recipient: Community Volunteer
Case ID: ${caseId}
Priority: ${result.priority}
Generated: ${generatedAt}

SITUATION:
${result.situation}

IMMEDIATE GOAL:
${result.intent}

KNOWN INFORMATION:
${result.verified.map((v) => `• ${v}`).join("\n")}

UNCERTAINTIES:
${result.needsConfirmation.map((c) => `• ${c}`).join("\n")}

SAFE ACTION CHECKLIST:
${result.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join("\n")}

VOLUNTEER SAFETY LIMITS:
${result.warnings.map((w) => `• ${w}`).join("\n")}

---
${statutoryFooter}`;

      return {
        role,
        roleTitle: "Community Volunteer",
        roleName: "Community Volunteer",
        roleIcon: "🤝",
        title: "COMMUNITY SUPPORT BRIEF",
        documentTitle: "COMMUNITY SUPPORT BRIEF",
        priority: result.priority,
        caseId,
        generatedAt,
        sections,
        plainText,
        statutoryFooter,
        disclaimer: statutoryFooter,
      };
    }

    // 4. GOVERNMENT / BENEFITS OFFICER
    case "government": {
      const sections: HandoffSection[] = [
        {
          title: "1. APPLICANT CONTEXT & WELFARE DISCOVERY GOAL",
          content: result.situation,
          badge: "CASE SUMMARY",
        },
        {
          title: "2. USER-PROVIDED DETAILS & PROFILE",
          items: (result.detectedInformation || []).map((f) => `${f.label}: ${f.value}`),
          badge: "REPORTED DECLARATION",
        },
        {
          title: "3. DOCUMENTS & EVIDENTIARY STATUS",
          items: result.verified.length > 0 ? result.verified : ["Applicant holds partial preliminary paperwork."],
        },
        {
          title: "4. MISSING ELIGIBILITY PARAMETERS (FOR INTAKE VERIFICATION)",
          items: result.needsConfirmation,
          badge: "REQUIRES OFFICIAL DETERMINATION",
        },
        {
          title: "5. POTENTIALLY RELEVANT OFFICIAL SCHEMES & GUIDELINES",
          items: (result.verifiedResources || []).map(
            (vr) => `• ${vr.title} (${vr.domain}): ${vr.whyRelevant}`
          ).concat(
            result.verifiedResources?.length ? [] : result.resources.map((r) => `• ${r.type}: ${r.description}`)
          ),
        },
        {
          title: "6. RECOMMENDED APPLICATION & DOCUMENTATION ROADMAP",
          items: result.actions.map((a, i) => `${i + 1}. ${a.title} — ${a.description}`),
        },
        {
          title: "7. STATUTORY DISCLAIMER",
          items: [
            "Potential scheme relevance does not constitute guaranteed eligibility. Final approval rests exclusively with the competent government authority.",
            ...result.warnings,
          ],
        },
      ];

      const plainText = `SAHAAYA BENEFITS NAVIGATION BRIEF
Recipient: Government / Benefits Officer
Case ID: ${caseId}
Priority: ${result.priority}
Generated: ${generatedAt}

APPLICANT SITUATION:
${result.situation}

REPORTED DETAILS:
${(result.detectedInformation || []).map((f) => `• ${f.label}: ${f.value}`).join("\n")}

VERIFIED DECLARATIONS:
${result.verified.map((v) => `• ${v}`).join("\n")}

MISSING PARAMETERS REQUIRING INTAKE CONFIRMATION:
${result.needsConfirmation.map((c) => `• ${c}`).join("\n")}

POTENTIALLY RELEVANT SCHEMES:
${(result.verifiedResources || []).map((vr) => `• [${vr.sourceType}] ${vr.title} (${vr.domain})`).join("\n")}

APPLICATION ROADMAP:
${result.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join("\n")}

IMPORTANT DISCLAIMER:
Potential relevance does not mean confirmed eligibility.
${result.warnings.map((w) => `• ${w}`).join("\n")}

---
${statutoryFooter}`;

      return {
        role,
        roleTitle: "Government / Benefits Officer",
        roleName: "Government / Benefits Officer",
        roleIcon: "🏛",
        title: "BENEFITS NAVIGATION BRIEF",
        documentTitle: "BENEFITS NAVIGATION BRIEF",
        priority: result.priority,
        caseId,
        generatedAt,
        sections,
        plainText,
        statutoryFooter,
        disclaimer: statutoryFooter,
      };
    }

    // 5. FAMILY / CAREGIVER
    case "family":
    default: {
      const sections: HandoffSection[] = [
        {
          title: "1. WHAT IS HAPPENING (IN SIMPLE WORDS)",
          content: result.situation,
        },
        {
          title: "2. URGENCY & IMPORTANCE",
          content: `Priority: ${result.priority}. Take prompt attention to the checklist below.`,
        },
        {
          title: "3. WHAT WE CURRENTLY KNOW",
          items: result.verified,
        },
        {
          title: "4. WHAT WE STILL NEED TO CHECK",
          items: result.needsConfirmation,
        },
        {
          title: "5. WHAT SHOULD HAPPEN NEXT (CHECKLIST FOR FAMILY)",
          items: result.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`),
        },
        {
          title: "6. IMPORTANT SAFETY RULES FOR FAMILY",
          items: result.warnings,
          badge: "PLEASE READ CAREFULLY",
        },
      ];

      const plainText = `SAHAAYA FAMILY ACTION SUMMARY
Recipient: Family / Caregiver
Case ID: ${caseId}
Priority: ${result.priority}
Generated: ${generatedAt}

WHAT IS HAPPENING:
${result.situation}

WHAT WE KNOW:
${result.verified.map((v) => `• ${v}`).join("\n")}

WHAT WE STILL NEED TO CHECK:
${result.needsConfirmation.map((c) => `• ${c}`).join("\n")}

WHAT SHOULD HAPPEN NEXT:
${result.actions.map((a, i) => `${i + 1}. ${a.title}: ${a.description}`).join("\n")}

SAFETY RULES FOR FAMILY:
${result.warnings.map((w) => `• ${w}`).join("\n")}

---
${statutoryFooter}`;

      return {
        role,
        roleTitle: "Family / Caregiver",
        roleName: "Family / Caregiver",
        roleIcon: "👨‍👩‍👧",
        title: "FAMILY ACTION SUMMARY",
        documentTitle: "FAMILY ACTION SUMMARY",
        priority: result.priority,
        caseId,
        generatedAt,
        sections,
        plainText,
        statutoryFooter,
        disclaimer: statutoryFooter,
      };
    }
  }
}
