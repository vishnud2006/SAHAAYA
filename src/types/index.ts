export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DetectedFact {
  label: string;
  value: string;
}

export type ActionStatus = "not_started" | "in_progress" | "completed";

export interface ActionItem {
  title: string;
  description: string;
  reason: string;
  ctaText?: string;
  ctaAction?: string;
  status?: ActionStatus;
}

export interface ResourceCategory {
  type: string;
  description: string;
}

export type SourceTrustLevel = "OFFICIAL" | "AUTHORITATIVE" | "OTHER" | "UNVERIFIED";

export type VerificationStatus = "SOURCE_FOUND" | "SOURCE_CHECKED" | "SOURCE_UNAVAILABLE";

export interface VerifiedResource {
  id?: string;
  category: string;
  title: string;
  url: string;
  domain?: string;
  sourceType: SourceTrustLevel;
  whyRelevant: string;
  confirmed: string[];
  needsConfirmation: string[];
  status?: VerificationStatus;
  checkedAt?: string;
  lastUpdated?: string;
  evidenceSummary?: string;
}

export interface HelpOption {
  title: string;
  description?: string;
  whyRelevant?: string;
  category?: string;
  portalUrl?: string;
}

export interface SahaayaAnalysisResult {
  situation: string;
  intent: string;
  priority: PriorityLevel;
  // Phase 13 Human-Centric Advisor Fields
  whatMayHelp?: HelpOption[] | string[];
  whyRelevant?: string[];
  informationStillNeeded?: string[];
  documentsNeeded?: string[];
  importantInfo?: string[];
  recommendedNextStep?: string;
  refinementPrompt?: string;
  // Core & Backwards Compatibility Fields
  detectedInformation: DetectedFact[];
  verified: string[];
  needsConfirmation: string[];
  actions: ActionItem[];
  resources: ResourceCategory[];
  verifiedResources?: VerifiedResource[];
  warnings: string[];
  // Metadata & Multimodal Tracking
  analyzedAt?: string;
  sourceType?: "text" | "voice" | "image" | "document" | "scenario" | "multimodal";
  inputSources?: Array<"text" | "voice" | "image" | "document">;
}

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size?: string;
  previewUrl?: string;
  base64?: string;
  extractedText?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  tagline: string;
  badgeText: string;
  category: "Medical" | "Disaster / Weather" | "Social Benefits" | "Community";
  iconName: string;
  priority: PriorityLevel;
  inputText: string;
  attachedFile?: AttachedFile;
  mockResult: SahaayaAnalysisResult;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  authProvider?: "email" | "google";
  avatarUrl?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider?: "email" | "google";
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  authProvider?: "email" | "google";
  createdAt: number;
  expiresAt: number;
}

export interface SavedCase {
  id: string;
  userId: string;
  title: string;
  rawInput: string;
  priority: PriorityLevel;
  inputSources: Array<"text" | "voice" | "image" | "document">;
  result: SahaayaAnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export type SahaayaAnalysis = SahaayaAnalysisResult;

export interface DashboardSummaryStats {
  totalAnalyses: number;
  highPriority: number;
  activeCases: number;
  completedActions: number;
}

export type HandoffRole =
  | "healthcare"
  | "emergency"
  | "volunteer"
  | "government"
  | "family";

export type SupportedLanguage = "en" | "hi" | "kn";

export interface HandoffSection {
  title: string;
  icon?: string;
  content?: string;
  items?: string[];
  badge?: string;
}

export interface HandoffBriefing {
  role: HandoffRole;
  roleName?: string;
  roleTitle: string;
  roleIcon: string;
  title: string;
  documentTitle: string;
  priority: PriorityLevel;
  caseId: string;
  generatedAt: string;
  sections: HandoffSection[];
  plainText: string;
  statutoryFooter: string;
  disclaimer?: string;
}
