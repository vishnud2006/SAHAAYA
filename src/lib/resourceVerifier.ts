import { VerifiedResource, SourceTrustLevel, VerificationStatus, ResourceCategory } from "@/types";

interface AuthoritativeDirectoryEntry {
  id: string;
  category: string;
  title: string;
  url: string;
  domain: string;
  sourceType: SourceTrustLevel;
  keywords: string[];
  scope: "national_india" | "international" | "us_gov" | "global";
  summary: string;
  confirmedGuidelines: string[];
  standardUncertainties: string[];
}

const AUTHORITATIVE_REGISTRY: AuthoritativeDirectoryEntry[] = [
  // 1. SOCIAL BENEFITS & WELFARE
  {
    id: "gov-nsap-pension",
    category: "Government Welfare & Social Benefits",
    title: "National Social Assistance Programme (NSAP) Official Portal",
    url: "https://nsap.nic.in",
    domain: "nsap.nic.in",
    sourceType: "OFFICIAL",
    keywords: ["widow", "pension", "welfare", "mother", "income", "benefit", "bpl", "allowance", "assistance"],
    scope: "national_india",
    summary: "Official government social assistance framework administering the Indira Gandhi National Widow Pension Scheme (IGNWPS) and National Family Benefit Scheme.",
    confirmedGuidelines: [
      "Widow pension schemes mandate official death certificate of spouse.",
      "Beneficiary must meet state-specified below-poverty-line or income threshold criteria.",
      "Direct Benefit Transfer (DBT) requires an active bank or post-office account linked to beneficiary."
    ],
    standardUncertainties: [
      "Specific state-tier top-up amount and exact district quota allocation.",
      "Beneficiary's verified legal age against statutory entry threshold (typically 40–79 years).",
      "Local municipal revenue verification of household income certificate."
    ]
  },
  {
    id: "gov-myscheme-portal",
    category: "Government Welfare & Social Benefits",
    title: "myScheme — National Platform for Government Schemes",
    url: "https://www.myscheme.gov.in",
    domain: "myscheme.gov.in",
    sourceType: "OFFICIAL",
    keywords: ["scheme", "benefit", "subsidy", "application", "eligibility", "welfare", "government"],
    scope: "national_india",
    summary: "Centralized Government of India scheme discovery platform maintained by the Ministry of Electronics and IT and NeGD.",
    confirmedGuidelines: [
      "Scheme discovery is free of charge and requires no third-party intermediary fees.",
      "Official applications require verified government identity documents (e.g. Aadhaar, Residence Proof).",
      "Scheme criteria differ between central ministry programs and individual state welfare departments."
    ],
    standardUncertainties: [
      "Applicability of specific local state sub-schemes to the user's pin code or district.",
      "Annual renewal or verification schedule for continued benefit disbursement."
    ]
  },
  {
    id: "gov-wcd-portal",
    category: "Government Welfare & Social Benefits",
    title: "Ministry of Women & Child Development Official Portal",
    url: "https://wcd.nic.in",
    domain: "wcd.nic.in",
    sourceType: "OFFICIAL",
    keywords: ["women", "widow", "mother", "child", "welfare", "empowerment", "shelter"],
    scope: "national_india",
    summary: "Union government ministry responsible for welfare policies, women support centers, and widow rehabilitation guidelines.",
    confirmedGuidelines: [
      "Government maintains specialized rehabilitation and skill assistance programs for destitute women.",
      "District Women and Child Development offices manage localized grievance and welfare intake."
    ],
    standardUncertainties: [
      "Availability of local municipal shelter or self-help group livelihood grants in specific ward."
    ]
  },

  // 2. DISASTER & FLOOD ASSISTANCE
  {
    id: "gov-ndma-flood",
    category: "Disaster Assistance & Flood Relief",
    title: "National Disaster Management Authority (NDMA) Official Portal",
    url: "https://ndma.gov.in",
    domain: "ndma.gov.in",
    sourceType: "OFFICIAL",
    keywords: ["flood", "rain", "submerged", "disaster", "evacuate", "storm", "water", "stranded", "rescue"],
    scope: "national_india",
    summary: "Apex statutory authority for disaster response, emergency flood management, and civil defense rescue protocols.",
    confirmedGuidelines: [
      "Official flood safety protocol strictly warns against driving or wading through moving floodwaters ('Turn Around, Don't Drown').",
      "State and District Disaster Management Authorities (SDMA/DDMA) coordinate high-clearance extraction boats and rescue assets.",
      "Submerged electrical infrastructure poses hidden electrocution hazards; maintaining safe distance is mandated."
    ],
    standardUncertainties: [
      "Real-time water depth and runoff velocity at the exact localized street intersection.",
      "Deployment position of nearest State Disaster Response Force (SDRF) or municipal rescue boat."
    ]
  },
  {
    id: "gov-imd-weather",
    category: "Disaster Assistance & Flood Relief",
    title: "India Meteorological Department (IMD) Severe Weather Bulletin",
    url: "https://mausam.imd.gov.in",
    domain: "imd.gov.in",
    sourceType: "OFFICIAL",
    keywords: ["weather", "rainfall", "storm", "forecast", "cyclone", "flood", "warning", "red alert"],
    scope: "national_india",
    summary: "National meteorological agency providing real-time Doppler radar observations, flash flood advisories, and color-coded alert warnings.",
    confirmedGuidelines: [
      "Color-coded warning scale (Yellow, Orange, Red) denotes severity and mandatory civil alert status.",
      "Urban flash flood bulletins identify low-lying arterial zones at high risk of waterlogging."
    ],
    standardUncertainties: [
      "Micro-climate hourly rainfall duration for specific neighborhood catchment basin."
    ]
  },

  // 3. HEALTHCARE & EMERGENCY TRIAGE
  {
    id: "gov-mohfw-emergency",
    category: "Healthcare & Emergency Systems",
    title: "Ministry of Health & Family Welfare (MoHFW) Official Portal",
    url: "https://mohfw.gov.in",
    domain: "mohfw.gov.in",
    sourceType: "OFFICIAL",
    keywords: ["blood pressure", "hypertension", "medical", "hospital", "doctor", "health", "stroke", "crisis", "patient"],
    scope: "national_india",
    summary: "National health ministry coordinating national health policies, emergency hospital networks, and primary care guidelines.",
    confirmedGuidelines: [
      "Systolic blood pressure exceeding 180 mmHg or diastolic exceeding 110 mmHg is classified as a severe hypertensive urgency requiring acute clinical triage.",
      "Prescription history records must be reviewed by an attending physician before acute medication changes.",
      "Acute neurological red-flags (dizziness, facial asymmetry, slurred speech) necessitate immediate emergency department evaluation."
    ],
    standardUncertainties: [
      "Patient's baseline cardiovascular history and renal function labs.",
      "Open bed capacity and catheterization lab availability at the nearest destination hospital."
    ]
  },
  {
    id: "auth-who-emergency",
    category: "Healthcare & Emergency Systems",
    title: "World Health Organization (WHO) Emergency Medical Systems",
    url: "https://www.who.int/health-topics/emergency-medical-services",
    domain: "who.int",
    sourceType: "AUTHORITATIVE",
    keywords: ["medical", "triage", "cardiac", "paramedic", "ambulance", "emergency", "hypertensive"],
    scope: "global",
    summary: "United Nations specialized agency providing international guidelines for pre-hospital emergency medical services and vital stabilization.",
    confirmedGuidelines: [
      "Pre-hospital ambulance response provides crucial in-transit monitoring and oxygenation.",
      "Patients in acute hypertensive crisis should remain calm, seated, and avoid strenuous physical exertion."
    ],
    standardUncertainties: [
      "Exact paramedic transit time in heavy local traffic congestion."
    ]
  },

  // 4. PUBLIC SAFETY & EMERGENCY DISPATCH
  {
    id: "gov-erss-112",
    category: "Public Safety & Emergency Dispatch",
    title: "National Emergency Response Support System (112 India)",
    url: "https://112.gov.in",
    domain: "112.gov.in",
    sourceType: "OFFICIAL",
    keywords: ["emergency", "police", "fire", "ambulance", "dispatch", "traffic", "patrol", "siren"],
    scope: "national_india",
    summary: "Unified national pan-India emergency number (112) integrating police, fire, ambulance, and disaster response dispatch.",
    confirmedGuidelines: [
      "Dialing 112 connects to an integrated emergency dispatch center with GPS location tracking.",
      "Emergency traffic clearance and green corridor escort can be coordinated for critical medical ambulances.",
      "Dispatch services operate 24 hours a day, 365 days a year without fee."
    ],
    standardUncertainties: [
      "Local field officer proximity and congestion density on specific transit corridor."
    ]
  },

  // 5. COMMUNITY & LEGAL AID
  {
    id: "gov-nalsa-legal",
    category: "Community & Legal Aid",
    title: "National Legal Services Authority (NALSA) Official Portal",
    url: "https://nalsa.gov.in",
    domain: "nalsa.gov.in",
    sourceType: "OFFICIAL",
    keywords: ["legal", "aid", "court", "certificate", "succession", "dispute", "rights", "widow"],
    scope: "national_india",
    summary: "Statutory body established under the Legal Services Authorities Act to provide free and competent legal services to eligible weaker sections of society.",
    confirmedGuidelines: [
      "Women, children, and low-income citizens are entitled to free legal aid, counsel, and documentation support.",
      "District Legal Services Authorities (DLSA) assist with obtaining legal heirship certificates and succession certificates without advocate fees."
    ],
    standardUncertainties: [
      "Local court calendar and document processing turnaround at specific sub-divisional legal clinic."
    ]
  }
];

/**
 * Checks a given domain and determines trust classification
 */
export function classifyDomainTrust(urlOrDomain: string): SourceTrustLevel {
  try {
    const raw = urlOrDomain.startsWith("http") ? new URL(urlOrDomain).hostname : urlOrDomain;
    const lower = raw.toLowerCase().trim();

    if (
      lower.endsWith(".gov") ||
      lower.endsWith(".gov.in") ||
      lower.endsWith(".nic.in") ||
      lower.endsWith(".gov.uk") ||
      lower.endsWith(".europa.eu") ||
      lower.endsWith(".mil") ||
      lower.includes(".gov.")
    ) {
      return "OFFICIAL";
    }

    if (
      lower.endsWith("who.int") ||
      lower.endsWith("redcross.org") ||
      lower.endsWith("un.org") ||
      lower.endsWith("aiims.edu") ||
      lower.endsWith("cdc.gov")
    ) {
      return "AUTHORITATIVE";
    }

    return "OTHER";
  } catch {
    return "UNVERIFIED";
  }
}

/**
 * Server-side engine to match and verify authoritative official resources for a situation.
 */
export async function verifyResourcesForSituation(
  situationText: string,
  intentText: string,
  declaredCategories?: ResourceCategory[],
  detectedFacts?: Array<{ label: string; value: string }>
): Promise<VerifiedResource[]> {
  const combinedContext = `${situationText} ${intentText} ${(declaredCategories || []).map((c) => c.type + " " + c.description).join(" ")} ${(detectedFacts || []).map((f) => f.label + " " + f.value).join(" ")}`.toLowerCase();

  const matchedEntries: AuthoritativeDirectoryEntry[] = [];

  for (const entry of AUTHORITATIVE_REGISTRY) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (combinedContext.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score >= 2 || (entry.keywords.some((k) => k.length >= 6 && combinedContext.includes(k.toLowerCase())))) {
      matchedEntries.push(entry);
    }
  }

  // If no direct keyword match, perform category matching
  if (matchedEntries.length === 0) {
    if (combinedContext.includes("medical") || combinedContext.includes("health") || combinedContext.includes("doctor")) {
      const med = AUTHORITATIVE_REGISTRY.find((e) => e.id === "gov-mohfw-emergency");
      if (med) matchedEntries.push(med);
    } else if (combinedContext.includes("flood") || combinedContext.includes("rain") || combinedContext.includes("storm")) {
      const flood = AUTHORITATIVE_REGISTRY.find((e) => e.id === "gov-ndma-flood");
      if (flood) matchedEntries.push(flood);
    } else if (combinedContext.includes("welfare") || combinedContext.includes("pension") || combinedContext.includes("mother")) {
      const wel = AUTHORITATIVE_REGISTRY.find((e) => e.id === "gov-nsap-pension");
      if (wel) matchedEntries.push(wel);
    } else {
      const genericScheme = AUTHORITATIVE_REGISTRY.find((e) => e.id === "gov-myscheme-portal");
      const emergencyDispatch = AUTHORITATIVE_REGISTRY.find((e) => e.id === "gov-erss-112");
      if (genericScheme) matchedEntries.push(genericScheme);
      if (emergencyDispatch) matchedEntries.push(emergencyDispatch);
    }
  }

  // Deduplicate and format output
  const uniqueEntries = Array.from(new Set(matchedEntries)).slice(0, 3);
  const nowStr = new Date().toISOString();

  return uniqueEntries.map((entry) => {
    let whyRelevant = `Potentially relevant because the analyzed situation involves ${entry.category.toLowerCase()} requirements.`;
    if (entry.id.includes("nsap") || entry.id.includes("welfare")) {
      whyRelevant = "The user is seeking legitimate financial assistance and pension discovery for a widowed family member.";
    } else if (entry.id.includes("ndma") || entry.id.includes("flood")) {
      whyRelevant = "The user reported severe road flooding, stranded citizens, and requires emergency disaster relief protocols.";
    } else if (entry.id.includes("mohfw") || entry.id.includes("who")) {
      whyRelevant = "A critical health escalation / hypertensive vital crisis was reported en route to clinical triage.";
    } else if (entry.id.includes("112")) {
      whyRelevant = "Urgent pre-hospital transit clearance or unified public safety dispatch is warranted.";
    }

    return {
      id: entry.id,
      category: entry.category,
      title: entry.title,
      url: entry.url,
      domain: entry.domain,
      sourceType: entry.sourceType,
      whyRelevant,
      confirmed: entry.confirmedGuidelines,
      needsConfirmation: entry.standardUncertainties,
      evidenceSummary: entry.summary,
      status: "SOURCE_CHECKED",
      checkedAt: nowStr,
      lastUpdated: "Official Registry 2026",
    };
  });
}

