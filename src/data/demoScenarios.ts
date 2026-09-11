import { DemoScenario } from "@/types";

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "medical-emergency",
    title: "MEDICAL RECORD",
    tagline: "Turn messy medical information into urgent next steps.",
    badgeText: "🏥 MEDICAL RECORD → ACTION",
    category: "Medical",
    iconName: "🏥",
    priority: "CRITICAL",
    inputText: "My father is 67. He has old prescriptions and medical reports. Today his blood pressure reading is 190/110 and he is dizzy. We are stuck in traffic while trying to reach a hospital.",
    attachedFile: {
      id: "demo-med-1",
      name: "prescription-history-cardiology.pdf",
      type: "application/pdf",
      size: "148 KB",
      extractedText: "Cardiology Consultation: Chronic Hypertension (Stage 2). Prior Rx: Telmisartan 40mg once daily, Amlodipine 5mg. High risk warning: BP > 180/100 requires urgent emergency triage."
    },
    mockResult: {
      situation: "A 67-year-old individual with documented historical hypertension is experiencing an acute hypertensive crisis (190/110 mmHg) and active dizziness, while family transit to an emergency trauma center is blocked in traffic gridlock.",
      intent: "Obtain immediate life-saving paramedic triage, manage severe hypertensive symptoms in-transit, and reach an active emergency department despite road obstruction.",
      priority: "CRITICAL",
      detectedInformation: [
        { label: "Patient Age", value: "67 years old" },
        { label: "Reported Vital", value: "Blood Pressure 190/110 mmHg" },
        { label: "Reported Symptoms", value: "Dizziness, acute hypertension" },
        { label: "Attached Document", value: "prescription-history-cardiology.pdf" },
        { label: "Transit Obstacle", value: "Immobilized in traffic congestion en route" }
      ],
      verified: [
        "Patient is 67 years old with reported BP reading of 190/110 mmHg.",
        "Dizziness is actively reported by caregiver.",
        "Historical cardiology prescriptions attached.",
        "Caregiver and patient are vehicle-bound in traffic."
      ],
      needsConfirmation: [
        "Presence of acute neurological red-flags (facial drooping, slurred speech, chest tightness, or unilateral weakness).",
        "Compliance timing of recent blood pressure medication doses.",
        "Exact GPS coordinates and nearest open cardiac emergency facility.",
        "Whether official emergency medical dispatch has been alerted for siren escort."
      ],
      actions: [
        {
          title: "Alert Official Emergency Medical Dispatch Immediately",
          description: "Call regional emergency dispatch services (dial emergency number) to request an ambulance interception or police siren escort through traffic gridlock.",
          reason: "Paramedics provide in-transit stabilization and possess statutory right-of-way through congested thoroughfares.",
          ctaText: "Find appropriate help",
          ctaAction: "dispatch"
        },
        {
          title: "Maintain Patient Seated, Calm, and Well-Ventilated",
          description: "Keep patient in a comfortable upright seated position. Loosen collar clothing and avoid sudden standing or neck movements.",
          reason: "Prevents orthostatic drops and reduces cardiovascular exertion.",
          ctaText: "Prepare information",
          ctaAction: "protocol"
        },
        {
          title: "Hand Over Attached Prescription Records upon Triage",
          description: "Have the attached cardiology records ready on the passenger seat for immediate intake by emergency physicians.",
          reason: "Allows emergency room physicians to evaluate chronic baseline drugs without counterproductive pharmaceutical clashes.",
          ctaText: "Review missing information",
          ctaAction: "records"
        }
      ],
      resources: [
        {
          type: "Emergency Medical Services (Ambulance Dispatch)",
          description: "Regional paramedic squads for urgent transit and life support."
        },
        {
          type: "24/7 Hospital Emergency Department",
          description: "Nearest accredited cardiac/trauma emergency center."
        },
        {
          type: "Traffic Police / Highway Patrol",
          description: "Municipal emergency traffic clearance unit."
        }
      ],
      verifiedResources: [
        {
          id: "gov-erss-112",
          category: "Public Safety & Emergency Dispatch",
          title: "National Emergency Response Support System (112 India)",
          url: "https://112.gov.in",
          domain: "112.gov.in",
          sourceType: "OFFICIAL",
          whyRelevant: "Urgent pre-hospital transit clearance or unified police traffic escort is required due to vehicle gridlock during acute crisis.",
          confirmed: [
            "Official emergency dispatch provides location tracking and siren escort for critical ambulance transports.",
            "Operates 24x7 pan-India emergency helpline without charge."
          ],
          needsConfirmation: [
            "Real-time location coordinates of the stranded vehicle in traffic.",
            "Immediate proximity of active highway patrol cruisers."
          ],
          evidenceSummary: "Unified national emergency response platform for coordinated paramedic dispatch and rapid traffic clearance.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        },
        {
          id: "gov-mohfw-emergency",
          category: "Healthcare & Emergency Systems",
          title: "Ministry of Health & Family Welfare (MoHFW) Official Portal",
          url: "https://mohfw.gov.in",
          domain: "mohfw.gov.in",
          sourceType: "OFFICIAL",
          whyRelevant: "Blood pressure reading of 190/110 with dizziness falls within acute clinical crisis triage protocols.",
          confirmed: [
            "Systolic BP > 180 mmHg or Diastolic > 110 mmHg is classified as a severe hypertensive urgency.",
            "Historical prescription records must be directly handed to intake triage physicians before changing medications."
          ],
          needsConfirmation: [
            "Baseline cardiovascular history and compliance timing of recent doses.",
            "Open cardiac emergency bed availability at nearest hospital."
          ],
          evidenceSummary: "National health authority clinical guidelines for acute hypertensive triage and pre-hospital management.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        }
      ],
      warnings: [
        "DO NOT administer borrowed or unprescribed blood pressure pills without direct physician direction; rapid drops in blood pressure can precipitate cerebral ischemia.",
        "SAHAAYA provides decision-support structure and does NOT issue medical diagnoses or replace licensed clinical evaluation.",
        "If the patient exhibits sudden facial weakness, arm drift, or speech changes, communicate potential stroke symptoms to dispatch immediately."
      ],
      analyzedAt: "Just now",
      sourceType: "multimodal",
      inputSources: ["text", "document"]
    }
  },
  {
    id: "flooded-road",
    title: "FLOOD PHOTO",
    tagline: "Turn a real-world image into a structured incident.",
    badgeText: "🌧 PHOTO → COMMUNITY ACTION",
    category: "Disaster / Weather",
    iconName: "🌧",
    priority: "HIGH",
    inputText: "Heavy rain has flooded this road. Traffic is not moving and elderly people are stuck nearby.",
    attachedFile: {
      id: "demo-flood-1",
      name: "flood-submerged-arterial-rd.jpg",
      type: "image/jpeg",
      size: "240 KB",
      previewUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Crect width='400' height='260' fill='%23101b2b'/%3E%3Cpath d='M0 160 Q100 140 200 160 T400 160 L400 260 L0 260 Z' fill='%231e3a5f'/%3E%3Cpath d='M0 190 Q120 170 240 190 T400 190 L400 260 L0 260 Z' fill='%232563eb' opacity='0.4'/%3E%3Ctext x='200' y='110' fill='%2393c5fd' font-size='16' font-family='sans-serif' font-weight='bold' text-anchor='middle'%3E🌊 Submerged Arterial Road%3C/text%3E%3Ctext x='200' y='135' fill='%2360a5fa' font-size='12' font-family='sans-serif' text-anchor='middle'%3EWater level approaching vehicle exhaust sills%3C/text%3E%3C/svg%3E"
    },
    mockResult: {
      situation: "Severe localized flash flooding shown in image has submerged the active thoroughfare, immobilizing multiple vehicles with elderly and vulnerable individuals trapped in the immediate danger zone.",
      intent: "Protect stranded individuals from rising water hazards, evacuate to high ground, and alert disaster relief response squads.",
      priority: "HIGH",
      detectedInformation: [
        { label: "Visual Hazard", value: "Surface water submerging road to vehicle sill level" },
        { label: "Attached Photo", value: "flood-submerged-arterial-rd.jpg" },
        { label: "Mobility Status", value: "Vehicular transit halted" },
        { label: "Vulnerable Population", value: "Elderly citizens stranded in immediate area" }
      ],
      verified: [
        "Photo shows water accumulation covering road surface and vehicle wheels.",
        "Traffic is completely stationary.",
        "Elderly individuals are present in the stranded perimeter."
      ],
      needsConfirmation: [
        "Water depth and rate of rise relative to drainage outlets.",
        "Exact landmark / cross-street coordinates of the stranded cluster.",
        "Presence of downed electrical lines or displaced sewer manhole covers.",
        "Presence of acute medical needs or mobility impairments among elderly occupants."
      ],
      actions: [
        {
          title: "Assess Water Depth & Move to High Ground if Safe",
          description: "If water level approaches vehicle door seals, assist elderly persons to solid, elevated structures before water pressure traps car doors.",
          reason: "Moving water as shallow as 6 inches can sweep people off feet; 12 inches can float vehicles.",
          ctaText: "Find appropriate help",
          ctaAction: "safety"
        },
        {
          title: "Transmit Precise Coordinates to Disaster Relief",
          description: "Report landmark landmarks or GPS pin to local disaster management, fire rescue, or municipal emergency helplines.",
          reason: "Allows rescue teams to prioritize high-clearance vehicle deployment for vulnerable elderly clusters.",
          ctaText: "Share situation",
          ctaAction: "dispatch"
        },
        {
          title: "Stay Clear of Electrical Infrastructure and Culverts",
          description: "Avoid walking through murky floodwaters near transformer posts or submerged roadside ditches.",
          reason: "Prevents unseen electrocution and suction entrapment in submerged drainage openings.",
          ctaText: "Review missing information",
          ctaAction: "hazard"
        }
      ],
      resources: [
        {
          type: "State / Local Disaster Management Authority",
          description: "Civil defense and municipal flood rescue squads deployed for evacuation operations."
        },
        {
          type: "Emergency Fire & Rescue Services",
          description: "Tactical response units equipped for high-water vehicle extraction."
        },
        {
          type: "Designated Public High-Ground Shelters",
          description: "Local community relief centers, schools, and dry municipal staging zones."
        }
      ],
      verifiedResources: [
        {
          id: "gov-ndma-flood",
          category: "Disaster Assistance & Flood Relief",
          title: "National Disaster Management Authority (NDMA) Official Portal",
          url: "https://ndma.gov.in",
          domain: "ndma.gov.in",
          sourceType: "OFFICIAL",
          whyRelevant: "Severe localized flash flooding and vehicle entrapment requires official civil defense evacuation procedures.",
          confirmed: [
            "Official civil defense protocols strictly warn against driving or wading through moving floodwaters ('Turn Around, Don't Drown').",
            "State & District Disaster Response Teams coordinate high-clearance extraction boats and rescue assets.",
            "Submerged roadside electrical transformers pose severe unseen electrocution hazards."
          ],
          needsConfirmation: [
            "Exact street GPS coordinates / landmark intersections of the stranded elderly cluster.",
            "Real-time rate of water rise relative to local storm drainage capacity."
          ],
          evidenceSummary: "Apex statutory authority for disaster management, flood rescue directives, and public evacuation safety standards.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        },
        {
          id: "gov-imd-weather",
          category: "Disaster Assistance & Flood Relief",
          title: "India Meteorological Department (IMD) Severe Weather Bulletin",
          url: "https://mausam.imd.gov.in",
          domain: "imd.gov.in",
          sourceType: "OFFICIAL",
          whyRelevant: "Real-time rainfall radar and flash flood color-coded warning alert status for active monsoon inundation.",
          confirmed: [
            "Color-coded warning scale (Yellow, Orange, Red) denotes mandatory emergency response readiness.",
            "Urban flash flood bulletins designate low-lying arterial transit zones at critical risk."
          ],
          needsConfirmation: [
            "Hourly micro-climate rainfall intensity duration for the specific drainage catchment zone."
          ],
          evidenceSummary: "National meteorological severe weather tracking, Doppler precipitation radar, and emergency flood bulletins.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        }
      ],
      warnings: [
        "Never attempt to drive through flooded roads regardless of vehicle size ('Turn Around, Don't Drown').",
        "Submerged roads may conceal collapsed asphalt, open sewer drains, or live electric currents.",
        "Official civil defense emergency bulletins supersede general guidance."
      ],
      analyzedAt: "Just now",
      sourceType: "multimodal",
      inputSources: ["text", "image"]
    }
  },
  {
    id: "social-benefits",
    title: "SOCIAL BENEFITS",
    tagline: "Turn confusing documents into a benefits-navigation plan.",
    badgeText: "🏛 DOCUMENTS → BENEFIT NAVIGATION",
    category: "Social Benefits",
    iconName: "🏛",
    priority: "MEDIUM",
    inputText: "My mother is a widow with limited income. I have some of her documents but I don't know what government benefits she might qualify for.",
    attachedFile: {
      id: "demo-doc-1",
      name: "widow-family-id-declaration.pdf",
      type: "application/pdf",
      size: "96 KB",
      extractedText: "Family Record: Deceased Spouse Death Certificate copy, Municipal Ward Resident Certificate. Income status: Low household income bracket declaration."
    },
    mockResult: {
      situation: "An adult child is seeking to discover and apply for legitimate public welfare, pension, and financial assistance schemes for their widowed mother with limited income, holding partial documentation.",
      intent: "Identify potential official government support programs, understand statutory eligibility criteria, and assemble required verification documents without risking scam or rejection.",
      priority: "MEDIUM",
      detectedInformation: [
        { label: "Beneficiary Profile", value: "Widowed mother (user-reported)" },
        { label: "Financial Status", value: "Limited / constrained household income" },
        { label: "Attached Document", value: "widow-family-id-declaration.pdf" },
        { label: "Primary Goal", value: "Eligibility discovery & documentation roadmap" }
      ],
      verified: [
        "Beneficiary is reported as a widow with constrained financial income.",
        "Family holds partial personal identity and family paperwork.",
        "User is seeking discovery of applicable public assistance."
      ],
      needsConfirmation: [
        "Mother's exact legal age and state/district of residence.",
        "Specific documents currently available (official Death Certificate, national identity proof, bank passbook).",
        "Whether she has an existing active bank account with direct benefit transfer (DBT) linking.",
        "Specific categories of assistance desired: widow pension, health insurance subsidy, food ration, or housing aid."
      ],
      actions: [
        {
          title: "Assemble Core Verification Document Dossier",
          description: "Collect and organize official Photo ID, deceased spouse's Death Certificate, Proof of Residence, and sole-name Bank Passbook.",
          reason: "Statutory benefit programs strictly require these primary evidentiary proofs before processing intake.",
          ctaText: "Prepare information",
          ctaAction: "docs"
        },
        {
          title: "Obtain an Official Income / Asset Certificate",
          description: "Visit the local municipal revenue office / Tehsildar / local ward administration to obtain an updated formal income certificate.",
          reason: "Income thresholds determine eligibility tiers for monthly widow pensions and healthcare subsidies.",
          ctaText: "Check official source",
          ctaAction: "revenue"
        },
        {
          title: "Apply Directly via Official Government Portal or Public Service Center",
          description: "Submit applications through designated government welfare portals or authorized citizen service kiosks (e.g., Common Service Centers), avoiding unofficial touts.",
          reason: "Guarantees zero-fee submission and ensures government tracking reference numbers for the application.",
          ctaText: "Check official source",
          ctaAction: "portal"
        }
      ],
      resources: [
        {
          type: "Department of Social Welfare & Women Development",
          description: "State and national government department administering widow pensions and widow rehabilitation schemes."
        },
        {
          type: "National Social Assistance Programme (NSAP) / Citizen Kiosks",
          description: "Authorized public service counters for direct benefit enrolment and biometric verification."
        },
        {
          type: "Legal Services Authority / Legal Aid Clinic",
          description: "Free government legal assistance for securing succession, death certificates, or title verification."
        }
      ],
      verifiedResources: [
        {
          id: "gov-nsap-pension",
          category: "Government Welfare & Social Benefits",
          title: "National Social Assistance Programme (NSAP) Official Portal",
          url: "https://nsap.nic.in",
          domain: "nsap.nic.in",
          sourceType: "OFFICIAL",
          whyRelevant: "Official statutory scheme administering the Indira Gandhi National Widow Pension Scheme (IGNWPS).",
          confirmed: [
            "Official widow pension criteria require applicant age between 40–79 years with below-poverty-line or designated income threshold certification.",
            "Mandates valid official death certificate of spouse and verified proof of residence.",
            "Disbursement operates via Direct Benefit Transfer (DBT) directly into the beneficiary's sole bank account."
          ],
          needsConfirmation: [
            "Mother's exact verified legal age against statutory entry cutoff.",
            "Specific state-level pension top-up rules for her designated resident district.",
            "Confirmed local income certificate issued by the competent municipal revenue authority."
          ],
          evidenceSummary: "Centrally sponsored social assistance scheme administered by Ministry of Rural Development for financial security of widowed citizens.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        },
        {
          id: "gov-myscheme-portal",
          category: "Government Welfare & Social Benefits",
          title: "myScheme — National Platform for Government Schemes",
          url: "https://www.myscheme.gov.in",
          domain: "myscheme.gov.in",
          sourceType: "OFFICIAL",
          whyRelevant: "National citizen gateway to discover and check active state and central government subsidies and social security benefits.",
          confirmed: [
            "Official discovery portal is 100% free with zero agent processing fees.",
            "Provides step-by-step checklist of required documents before application submission.",
            "Allows filtering schemes by gender (Female), marital status (Widow), and income bracket."
          ],
          needsConfirmation: [
            "User's specific state of residence and district jurisdiction.",
            "Availability of local Common Service Center (CSC) kiosk for assisted biometric submission."
          ],
          evidenceSummary: "National e-Governance platform consolidating 500+ verified central and state welfare programs with explicit eligibility guidelines.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        },
        {
          id: "gov-nalsa-legal",
          category: "Community & Legal Aid",
          title: "National Legal Services Authority (NALSA) Official Portal",
          url: "https://nalsa.gov.in",
          domain: "nalsa.gov.in",
          sourceType: "OFFICIAL",
          whyRelevant: "Statutory legal aid body providing free legal counsel and documentation support for widowed and low-income citizens.",
          confirmed: [
            "Women and economically weaker citizens are statutorily entitled to free legal assistance under Section 12 of Legal Services Authorities Act.",
            "Assists with surviving member certificates and succession documentation without private advocate charges."
          ],
          needsConfirmation: [
            "Location of the nearest Taluk or District Legal Services Committee (DLSC) office."
          ],
          evidenceSummary: "Statutory constitutional body offering free legal aid, affidavit verification, and documentation support to eligible citizens.",
          status: "SOURCE_CHECKED",
          checkedAt: "Just now",
          lastUpdated: "Official Registry 2026"
        }
      ],
      warnings: [
        "SAHAAYA does not grant government approvals or guarantee scheme eligibility; official determination rests solely with the competent government authority.",
        "Potential relevance does not mean confirmed eligibility. You must confirm user-specific details with the official authority.",
        "Never share bank account OTPs, passwords, or pay upfront commissions to agents claiming guaranteed approval for government grants.",
        "Ensure all submitted documents have matching name spelling and birth year across all official records to avoid processing delays."
      ],
      analyzedAt: "Just now",
      sourceType: "multimodal",
      inputSources: ["text", "document"]
    }
  }
];
