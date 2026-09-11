# SAHAAYA (सहाय)

> **"Messy human problems → verified actions that help."**

SAHAAYA is a multimodal decision-support engine powered by Google Gemini that acts as a universal bridge between unstructured, high-stress human intent and complex real-world institutional systems.

---

## 🌟 What is SAHAAYA?

When crises, medical escalations, climate disasters, or bureaucratic hurdles occur, humans do not communicate in structured forms or clean API requests. They communicate under stress—through frantic voice notes, photos of crumpled prescription slips, submerged road snapshots, broken sentences, and fragmented memories.

Standard chatbots treat these situations as open-ended conversational banter—frequently generating long paragraphs of text, hallucinating non-existent phone numbers, or providing dangerous unverified advice.

**SAHAAYA is NOT a chatbot.** It is a structured intelligence and action bridge that transforms messy multimodal inputs into:

1. **Understanding** — Clear, empathetic synthesis of the underlying situation
2. **Intent** — Precise extraction of what the user is trying to accomplish
3. **Structured Facts** — Entity extraction (age, vitals, location, timeline, documents)
4. **Evidence** — Direct facts strictly supported by user-provided input
5. **Uncertainties** — Explicit visibility into missing details that require verification
6. **Priority Triage** — Conservative risk assessment (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
7. **Action Checklist** — Interactive, step-by-step checklist with prioritized immediate next steps
8. **Resource Bridge** — Safe pathways to certified institutional support (emergency, health, government)
9. **Safety Disclaimers** — Strict boundary guardrails and life-safety advisories

```
MESSY HUMAN INPUT (Text · Voice · Photo · Document)
                     ↓
         GEMINI INTELLIGENCE ENGINE
                     ↓
                UNDERSTAND
                     ↓
                 EVIDENCE
                     ↓
                UNCERTAINTY
                     ↓
                 PRIORITY
                     ↓
             NEXT BEST ACTION
```

---

## 🎯 Universal Multimodal Intake

SAHAAYA accepts information in four unified intake modes within a single workspace:

- **✍ Text** — Free-form narrative, panic notes, fragmented summaries, traffic updates
- **🎙 Voice** — Live speech recognition via Web Speech API with real-time transcription
- **📷 Image** — Prescription photos, flooded streets, vehicle damage, warning signs (auto-compressed on client)
- **📄 Document** — Medical reports, identity cards, government notices, benefit letters (PDF/DOCX/TXT)

---

## 🚦 Priority Triage Standard

| Priority | UI Subtitle | Typical Scenarios |
| :--- | :--- | :--- |
| 🚨 **CRITICAL** | *Immediate attention recommended* | Severe vitals (BP 190/110), chest pain, acute danger, active disasters |
| ⚠️ **HIGH** | *Prompt attention recommended* | Rising floodwaters, stranded vulnerable persons, urgent time constraints |
| 🔷 **MEDIUM** | *Action recommended* | Welfare benefit navigation, document verification, civil inquiries |
| 🟢 **LOW** | *Informational / low urgency* | General guidance, non-urgent preparation, informational queries |

---

## 🧪 Benchmark Scenarios (1-Click Real Analysis)

SAHAAYA includes 3 built-in multimodal scenarios ready for live judge evaluation:

1. **🏥 Medical Record → Action (`CRITICAL`)**
   - *Input*: 67-year-old father with BP reading 190/110, dizziness, and traffic obstruction while trying to reach a hospital.
   - *Attached Document*: `cardiology_prescription_feb2026.pdf`
   - *Output*: Prioritizes emergency dispatch escort, highlights traffic clearance, and issues strict contraindication warnings against taking unprescribed pills.

2. **🌧 Photo → Community Action (`HIGH`)**
   - *Input*: Heavy rainfall with road submergence, stranded elderly citizens, and rising water levels.
   - *Attached Image*: `submerged_crossing_flood_alert.jpg`
   - *Output*: Directs evacuation to higher elevation, mobilizes emergency coordinates, and alerts to culvert/electrical current hazards.

3. **🏛 Documents → Benefit Navigation (`MEDIUM`)**
   - *Input*: Low-income widow seeking eligible government welfare schemes.
   - *Attached Document*: `family_income_declaration_2026.pdf`
   - *Output*: Outlines applicable state pension schemes, identifies missing Aadhaar/bank documents, and guides to authorized Common Service Centers (CSC).

---

## 🛡 Trust & Safety Architecture

> *"AI should not replace people or institutions. It should make them easier to reach."*

- **Zero Hallucination of Authority**: Never invents phone numbers, addresses, government eligibility claims, or clinical diagnoses.
- **Audited Evidence Separation**: Separates direct user evidence (`✓ SUPPORTED BY INPUT`) from unverified assumptions (`⚠ NEEDS CONFIRMATION`).
- **Conservative Triage**: Errs on the side of safety and urgent human protection.
- **Action-Oriented Execution**: Every action item includes an interactive status toggle (`Not started` → `In progress` → `Done`) and actionable rationale.

---

## ⚡ Tech Stack

- **Framework**: Next.js 15 (App Router, Server-side API routes, React 19)
- **Language**: TypeScript (Strict schema validation)
- **Styling**: Tailwind CSS (Custom dark theme, responsive grid layout)
- **AI Intelligence**: Google Gemini 1.5 Flash (`@google/genai` with strict structured JSON schema)
- **Audio Recognition**: Native Web Speech API
- **Icons**: Lucide React
- **Deployment**: Vercel ready (Zero external database or authentication requirements)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18+ installed

### 2. Installation
```bash
git clone https://github.com/your-username/sahaaya.git
cd sahaaya
npm install
```

### 3. Configure Gemini API Key
Create a `.env.local` file in the root directory:
```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```
> **Note**: If `GEMINI_API_KEY` is not provided, SAHAAYA falls back to an offline heuristic evaluation engine with identical schema parity, ensuring zero downtime during review.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📊 Phase 7: User Dashboard, Case History & Action Tracking

SAHAAYA functions as a persistent product for human situation management:

- **Authenticated Dashboard (`/dashboard`)**:
  - Hero header: *"WELCOME BACK"* & *"Turn your next messy situation into a clear next step."*
  - 4 Real-time metrics: `TOTAL ANALYSES`, `HIGH PRIORITY`, `ACTIVE CASES`, and `COMPLETED ACTIONS`.
  - Latest 5 recent analyses with priority tags, domain icons, timestamps, and input type badges.
  - Empty state with 1-click `START YOUR FIRST ANALYSIS` trigger.
- **Post-Analysis Save Flow**:
  - `ANALYSIS COMPLETE` verification badge.
  - `SAVE CASE` button with instant feedback (`Case saved ✓`).
  - Unauthenticated prompt modal enabling users to log in or sign up without losing their active analysis.
- **Interactive Action Tracking & Progress**:
  - Graphical `ACTION PROGRESS` indicator showing completed tasks (`X / Y completed (Z%)`).
  - Real-time persistence of 3-state action statuses (`○ Not started` → `→ In progress` → `✓ Done`) on `/cases/[id]`.
- **My Cases Archive (`/cases`)**:
  - Searchable by situation description, vital metrics, and keywords.
  - Filterable by urgency (`ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
  - Strict user-scoped isolation preventing cross-user data leakage.
- **Account & Security Management (`/profile`)**:
  - Edit display name with live session synchronization.
  - Secure password changing with current password verification and salted `scryptSync` hashing.

---

## 📄 Phase 8: Emergency Field Dossier & Offline Field Mode

SAHAAYA bridges AI-screen insights directly to **real-world field handoffs**:

- **Emergency Printable Field Dossier**:
  - Structured 8-section briefing designed for first responders, triage medics, flood rescue teams, and caseworkers:
    1. *Situation Overview*
    2. *Primary Intent & Goal*
    3. *Key Detected Information Table*
    4. *Supported by Input (Verified Facts)*
    5. *Needs Confirmation (Missing Information & Red Flags)*
    6. *Next Best Actions (Numbered sequence with rationale)*
    7. *Possible Help (Institutional pathways)*
    8. *Safety & Regulatory Warnings*
  - **Zero-Dependency Printable Format**: Uses clean semantic HTML and `@media print` CSS for standard A4 paper and PDF printing.
  - **Standalone Briefing Export**: Downloadable `.html` file containing self-contained styling for offline distribution via USB or messaging.

- **Offline Field Mode & Snapshots (`/field` & `/field/[id]`)**:
  - **Dual-Layer Browser Storage**: Transaction-safe IndexedDB partition (`sahaaya_offline_db`) with automatic `localStorage` fallback.
  - **Live Connectivity Detection**: Dynamic `● Online` / `○ Offline` indicator subscribing to browser network status.
  - **Honest AI & Offline Capability**: Clearly informs users that Gemini re-analysis requires connectivity while existing dossiers and checklists operate 100% locally.
  - **Field Mode Hub (`/field`)**: Inspect, print, or manage locally cached case snapshots with one-click sample scenario seeding for field drills.
  - **Read-Only Case Viewer (`/field/[id]`)**: Fast, resilient inspection of situation details, verified facts, and action items during network outages.

---

## 🏛 Phase 9: Verified Resource Bridge

SAHAAYA transforms Gemini from a standalone chat model into a **grounded bridge to real-world authorities**:

- **Strict Source Trust Classification**:
  - `🏛 OFFICIAL SOURCE`: Verified first-party `.gov`, `.nic.in`, `.gov.in`, `.gov.uk`, `.europa.eu` domains.
  - `🛡 AUTHORITATIVE SOURCE`: Accredited statutory bodies, global health organizations (`who.int`, `redcross.org`, `aiims.edu`).
  - `ℹ OTHER SOURCE` / `⚠️ UNVERIFIED`: Community portals and secondary informational directories.
- **Clear Evidentiary Separation**:
  - 👤 `USER REPORTED` — Raw inputs and constraints provided by the user under stress.
  - 🤖 `AI INTERPRETATION` — Gemini's situational understanding and prioritized action sequencing.
  - 🏛 `SOURCE CONFIRMED` — Concrete document requirements and statutory rules from official authorities.
  - ⚠️ `NEEDS CONFIRMATION` — Individual eligibility, domicile requirements, and district quotas that require personal validation.
- **Source-Aware Resource Cards (`ResultDashboard.tsx`)**:
  - Explanatory Banner: *"SAHAAYA separates AI guidance from information provided by external sources. Potential relevance does not mean confirmed eligibility."*
  - Compact **SOURCE EVIDENCE** block quoting official guidelines.
  - Direct `[ OPEN SOURCE ↗ ]` safe browser launch without third-party proxy tampering.
  - Freshness timestamp: `✓ Official source identified • Checked: Today`.
  - Server-side verification API (`/api/resources/verify`) with zero hallucinated links or fake eligibility claims.

---

## 🤝 Phase 10: Smart Human Handoff & Multilingual Access

SAHAAYA closes the loop between messy situations and real-world collaboration:

- **Role-Specific Handoff Generator (`SmartHandoffModal.tsx` & `handoffGenerator.ts`)**:
  - Automatically synthesizes cases into targeted, role-adapted briefings for 5 distinct recipients without fabricating facts:
    1. 🏥 **Healthcare Professional** (`HEALTHCARE CASE BRIEF`): Clinical presentation, vital metrics (`190/110 mmHg`), symptoms, timeline, medication history, clinical uncertainties, and acute medication contraindications.
    2. 🚨 **Emergency Responder** (`FIELD INCIDENT BRIEF`): Incident overview, transit obstacles, hazard assessment, casualty counts, and life safety advisories.
    3. 🤝 **Community Volunteer** (`COMMUNITY SUPPORT BRIEF`): Non-clinical support needs, shelter/food logistics, safe accompaniment tasks, and strict volunteer boundaries.
    4. 🏛 **Government / Benefits Officer** (`BENEFITS NAVIGATION BRIEF`): Applicant context, document status, missing parameters for official intake determination, and relevant statutory portals (`nsap.nic.in`, `myscheme.gov.in`).
    5. 👨‍👩‍👧 **Family / Caregiver** (`FAMILY ACTION SUMMARY`): Plain-language summary, urgency checklist, next steps, what to watch for, and simple safety rules.

- **Human Review & Safe Sharing Safeguards**:
  - **Mandatory Review Consent**: `[ I HAVE REVIEWED THIS ]` confirmation prevents accidental or unverified sharing.
  - **`[ 📋 COPY BRIEF ]`**: Copies a clean, structured plain-text document for messaging apps or email.
  - **`[ 📤 SHARE HANDOFF ]`**: Leverages the native Web Share API with clipboard fallback.
  - **`[ 🖨️ PRINT BRIEFING ]`**: Formats a clean printable briefing sheet.

- **Full Multilingual Access (`EN` · `हिन्दी` · `ಕನ್ನಡ`)**:
  - **Zero Loss of Factual Integrity**: Numbers, measurements, vital signs (`190/110 mmHg`, `67 years old`), file attachments, and official URLs remain unmodified across all languages.
  - **Language Selector in Header**: Seamless toggle across `EN` (English), `HI` (हिन्दी), and `KN` (ಕನ್ನಡ) with local storage persistence.
  - **Dynamic Voice Recognition**: Automatically binds speech recognition `lang` to `en-US`, `hi-IN`, or `kn-IN`.

---

## 🔑 Phase 12: Google Sign-In & Unified Account Foundation

SAHAAYA supports seamless single-click Google authentication alongside standard email/password authentication:

- **"Continue with Google" (`/login` & `/signup`)**:
  - Direct OAuth 2.0 / OIDC initiation with CSRF state protection (`sahaaya_oauth_state`).
  - Automatic account linking: if a user already registered with an email address, signing in with Google securely connects to their existing record without creating duplicate entries or losing case history.
  - Zero-friction sandbox mode for instant evaluation without external Cloud Console setup.
- **Unified Session Security**:
  - Issues the same HMAC SHA-256 signed session cookie (`sahaaya_session`).
  - Strict user-scoped authorization on all case endpoints (`/api/cases`, `/api/cases/[id]`, `/api/dashboard/stats`).
- **Profile Customization**:
  - Displays user avatar and Google Account Connected badge on `/profile` and navigation header.

---

## 🌐 Vercel Deployment

1. Push code to your Git repository (GitHub / GitLab).
2. Import project into [Vercel](https://vercel.com).
3. Add Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `GOOGLE_CLIENT_ID` (Optional): Google OAuth Client ID.
   - `GOOGLE_CLIENT_SECRET` (Optional): Google OAuth Client Secret.
   - `SAHAAYA_SESSION_SECRET` (Optional): A secure secret string for session signing.
4. Deploy! Next.js App Router serverless functions automatically handle multimodal payloads, auth cookies, case persistence, field dossier printing, multilingual localization, and Gemini analysis.

---

## ⚖️ Product Principle

**SAHAAYA is NOT a chatbot.**

It is a **Universal Bridge** between **Human Intent** and **Complex Real-World Systems**:

$$\text{MESSY INPUT} \longrightarrow \text{GEMINI UNDERSTANDING} \longrightarrow \text{EVIDENCE \& UNCERTAINTY} \longrightarrow \text{PRIORITY} \longrightarrow \text{ACTION} \longrightarrow \text{HUMAN HANDOFF}$$



