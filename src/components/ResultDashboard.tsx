"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Share2,
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HeartPulse,
  Siren,
  Building2,
  Car,
  Users,
  CloudRain,
  Shield,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Printer,
  Copy,
  Info,
  ShieldAlert,
  Flame,
  LifeBuoy,
  Bookmark,
  BookmarkCheck,
  Trash2,
  LogIn,
  UserPlus,
  X,
  RotateCcw,
  HardDrive,
  Download,
  ExternalLink,
  Globe,
  RefreshCw,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Send,
  FileText,
  Compass,
  Lightbulb,
  CheckSquare,
  Square,
} from "lucide-react";
import { SahaayaAnalysisResult, ActionStatus, ActionItem, VerifiedResource, HelpOption } from "@/types";
import { getPriorityStyles } from "@/lib/utils";
import { FieldDossier } from "./FieldDossier";
import { SmartHandoffModal } from "./SmartHandoffModal";
import { useLanguage } from "@/context/LanguageContext";
import { saveCaseOffline, isCaseSavedOffline } from "@/lib/offlineStore";

interface ResultDashboardProps {
  result: SahaayaAnalysisResult;
  onReset: () => void;
  rawInput?: string;
  caseId?: string;
  onDelete?: () => void;
  onRefine?: (additionalDetails: string) => void | Promise<void>;
  isRefining?: boolean;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onReset,
  rawInput,
  caseId,
  onDelete,
  onRefine,
  isRefining = false,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [selectedCtaMessage, setSelectedCtaMessage] = useState<string | null>(null);

  // Conversational Refinement state
  const [refineInputText, setRefineInputText] = useState("");
  const [isSubmittingRefine, setIsSubmittingRefine] = useState(false);

  // Collapsible Audit Section
  const [showAuditDetails, setShowAuditDetails] = useState(false);

  // Checked documents state (interactive checklist)
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  // Smart Human Handoff Modal state
  const [showHandoffModal, setShowHandoffModal] = useState(false);

  // Actions & status tracking
  const [actions, setActions] = useState<ActionItem[]>(result.actions || []);
  const [actionStatuses, setActionStatuses] = useState<Record<number, ActionStatus>>(() => {
    const initial: Record<number, ActionStatus> = {};
    (result.actions || []).forEach((a, idx) => {
      initial[idx] = a.status || "not_started";
    });
    return initial;
  });

  // Sync actions when result updates (e.g. after in-place refinement)
  useEffect(() => {
    setActions(result.actions || []);
    const initial: Record<number, ActionStatus> = {};
    (result.actions || []).forEach((a, idx) => {
      initial[idx] = a.status || "not_started";
    });
    setActionStatuses(initial);
  }, [result]);

  // Save state
  const [isSaved, setIsSaved] = useState<boolean>(!!caseId);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(caseId || null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Field Dossier & Offline storage state
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);
  const [isSavingOffline, setIsSavingOffline] = useState(false);

  // Phase 9: Verified Resource Bridge state
  const [verifiedResources, setVerifiedResources] = useState<VerifiedResource[]>(
    result.verifiedResources || []
  );
  const [isVerifyingResources, setIsVerifyingResources] = useState(false);
  const [resourceVerifyError, setResourceVerifyError] = useState<string | null>(null);

  // Auto-fetch verified resources if not provided
  useEffect(() => {
    if (result.verifiedResources && result.verifiedResources.length > 0) {
      setVerifiedResources(result.verifiedResources);
    } else if (result.situation && verifiedResources.length === 0) {
      handleFetchVerifiedResources();
    }
  }, [result.verifiedResources, result.situation]);

  const handleFetchVerifiedResources = async () => {
    setIsVerifyingResources(true);
    setResourceVerifyError(null);
    try {
      const res = await fetch("/api/resources/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: result.situation,
          intent: result.intent,
          categories: result.resources,
          detectedInformation: result.detectedInformation,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.resources)) {
        setVerifiedResources(data.resources);
      } else {
        setResourceVerifyError(data.error || "Could not verify resources right now.");
      }
    } catch {
      setResourceVerifyError("SAHAAYA couldn't check external resources right now.");
    } finally {
      setIsVerifyingResources(false);
    }
  };

  // Check if case is stored offline
  useEffect(() => {
    const checkOffline = async () => {
      const activeId = caseId || savedCaseId;
      if (activeId) {
        const exists = await isCaseSavedOffline(activeId);
        setIsOfflineSaved(exists);
      }
    };
    checkOffline();
  }, [caseId, savedCaseId]);

  const priorityStyles = getPriorityStyles(result.priority);

  const completedCount = Object.values(actionStatuses).filter(
    (status) => status === "completed"
  ).length;

  const totalActions = actions.length || 1;
  const progressPercent = Math.round((completedCount / totalActions) * 100);

  const setSpecificStatus = async (idx: number, status: ActionStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const newStatuses = {
      ...actionStatuses,
      [idx]: status,
    };
    setActionStatuses(newStatuses);

    const updatedActions = actions.map((act, i) =>
      i === idx ? { ...act, status } : act
    );
    setActions(updatedActions);

    // If viewing or saved to a case ID, persist actions via PATCH
    const targetCaseId = caseId || savedCaseId;
    if (targetCaseId && user) {
      try {
        await fetch(`/api/cases/${targetCaseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actions: updatedActions }),
        });
      } catch (err) {
        console.warn("Failed to persist action status update:", err);
      }
    }
  };

  const handleSaveOffline = async () => {
    setIsSavingOffline(true);
    try {
      const activeId = caseId || savedCaseId || `field-case-${Date.now().toString(36)}`;
      await saveCaseOffline({
        id: activeId,
        userId: user?.id || "local-device",
        title: result.situation?.slice(0, 60) || "Field Case Briefing",
        rawInput: rawInput || result.situation,
        priority: result.priority,
        inputSources: result.inputSources || ["text"],
        result: {
          ...result,
          actions,
        },
      });
      setIsOfflineSaved(true);
      if (!savedCaseId && !caseId) {
        setSavedCaseId(activeId);
      }
      setShareFeedback("Case saved for offline Field Mode on this device.");
      setTimeout(() => setShareFeedback(null), 3500);
    } catch (err) {
      setShareFeedback("Failed to save case locally.");
    } finally {
      setIsSavingOffline(false);
    }
  };

  const handleSaveCase = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isSaved || isSaving) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.situation?.slice(0, 60) || "Case Analysis",
          rawInput: rawInput || result.situation,
          priority: result.priority,
          inputSources: result.inputSources || ["text"],
          result: {
            ...result,
            actions,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.case) {
        setIsSaved(true);
        setSavedCaseId(data.case.id);
        // Also ensure it is stored locally for immediate field resilience
        await saveCaseOffline(data.case);
        setIsOfflineSaved(true);
        setShareFeedback("Case saved to your dashboard & offline storage.");
        setTimeout(() => setShareFeedback(null), 3000);
      } else {
        setShareFeedback(data.error || "Could not save case.");
      }
    } catch (err) {
      setShareFeedback("Network error saving case.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCase = async () => {
    if (!caseId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`, { method: "DELETE" });
      if (res.ok) {
        if (onDelete) {
          onDelete();
        } else {
          router.push("/cases");
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getResourceIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (
      lower.includes("health") ||
      lower.includes("medical") ||
      lower.includes("hospital") ||
      lower.includes("doctor")
    ) {
      return HeartPulse;
    }
    if (
      lower.includes("emergency") ||
      lower.includes("ambulance") ||
      lower.includes("police") ||
      lower.includes("siren")
    ) {
      return Siren;
    }
    if (
      lower.includes("government") ||
      lower.includes("welfare") ||
      lower.includes("department") ||
      lower.includes("pension") ||
      lower.includes("revenue")
    ) {
      return Building2;
    }
    if (
      lower.includes("traffic") ||
      lower.includes("transport") ||
      lower.includes("patrol") ||
      lower.includes("road")
    ) {
      return Car;
    }
    if (
      lower.includes("disaster") ||
      lower.includes("flood") ||
      lower.includes("weather") ||
      lower.includes("fire")
    ) {
      return CloudRain;
    }
    if (
      lower.includes("community") ||
      lower.includes("legal") ||
      lower.includes("shelter")
    ) {
      return Users;
    }
    return LifeBuoy;
  };

  const handleToggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = refineInputText.trim();
    if (!query || isRefining || isSubmittingRefine) return;

    if (onRefine) {
      setIsSubmittingRefine(true);
      try {
        await onRefine(query);
        setRefineInputText("");
      } finally {
        setIsSubmittingRefine(false);
      }
    }
  };

  const generateSummaryText = () => {
    const helpText = Array.isArray(result.whatMayHelp)
      ? result.whatMayHelp
          .map((item) =>
            typeof item === "string"
              ? `• ${item}`
              : `• ${item.title}: ${item.description || item.whyRelevant || ""}`
          )
          .join("\n")
      : "";

    const docsText = (result.documentsNeeded || []).map((d) => `• ${d}`).join("\n");
    const neededInfo = (result.informationStillNeeded || result.needsConfirmation || []).map((i) => `• ${i}`).join("\n");

    return `SAHAAYA CASE BRIEFING & ACTION PLAN
Priority: ${result.priority} (${priorityStyles.subtitle})

SITUATION UNDERSTOOD:
${result.situation}

IMMEDIATE NEXT STEP:
${result.recommendedNextStep || (actions[0] ? `${actions[0].title}: ${actions[0].description}` : "Consult official portal.")}

WHAT MAY HELP YOU:
${helpText || result.resources.map((r) => `• [${r.type}] ${r.description}`).join("\n")}

RECOMMENDED NEXT STEPS:
${actions
  .map(
    (a, i) =>
      `${i + 1}. [${a.status === "completed" ? "DONE" : a.status === "in_progress" ? "IN PROGRESS" : "NOT STARTED"}] ${a.title}\n   - Details: ${a.description}\n   - Why it matters: ${a.reason}`
  )
  .join("\n")}

${docsText ? `DOCUMENTS YOU MAY NEED:\n${docsText}\n` : ""}
${neededInfo ? `INFORMATION STILL NEEDED FOR EXACT RESOLUTION:\n${neededInfo}\n` : ""}
${
  result.importantInfo && result.importantInfo.length > 0
    ? `IMPORTANT INFORMATION:\n${result.importantInfo.map((w) => `• ${w}`).join("\n")}`
    : result.warnings && result.warnings.length > 0
    ? `IMPORTANT INFORMATION:\n${result.warnings.map((w) => `• ${w}`).join("\n")}`
    : ""
}
`;
  };

  const handleShareSummary = async () => {
    const summary = generateSummaryText();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `SAHAAYA Case Summary - ${result.priority} Priority`,
          text: summary,
        });
        setShareFeedback("Summary shared");
        setTimeout(() => setShareFeedback(null), 2500);
        return;
      } catch (err) {
        // Fallback to clipboard if share cancelled
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setShareFeedback("Summary copied to clipboard");
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 2500);
    }
  };

  const handleCtaClick = (actionTitle: string, defaultCta: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCtaMessage(`Step focus: "${actionTitle}". Focus on completing this step.`);
    setTimeout(() => setSelectedCtaMessage(null), 3000);
  };

  // Normalized help options
  const helpOptions: HelpOption[] = Array.isArray(result.whatMayHelp)
    ? result.whatMayHelp.map((item) => {
        if (typeof item === "string") {
          return {
            title: item,
            description: "Applicable program or service pathway.",
            whyRelevant: "Directly matches the context you provided.",
          };
        }
        return item;
      })
    : (result.resources || []).map((r) => ({
        title: r.type,
        description: r.description,
        whyRelevant: "Official institutional help category for your situation.",
      }));

  // Normalized missing info
  const missingInfoList =
    result.informationStillNeeded && result.informationStillNeeded.length > 0
      ? result.informationStillNeeded
      : result.needsConfirmation || [];

  // Normalized documents list
  const documentsList = result.documentsNeeded || [];

  // Normalized important info / warnings
  const importantNotices =
    result.importantInfo && result.importantInfo.length > 0
      ? result.importantInfo
      : result.warnings || [];

  // Recommended Next Step string
  const primaryNextStep =
    result.recommendedNextStep ||
    (actions.length > 0
      ? `👉 ${actions[0].title}: ${actions[0].description}`
      : "👉 Check the official government or service portal for your jurisdiction.");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.08] mb-8 no-print">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all group shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>{caseId ? "← Back to My Cases" : "← New analysis"}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Analysis Complete / Status Tag */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wider">
              {caseId ? "SAVED CASE RECORD" : "ANALYSIS COMPLETE"}
            </span>
          </div>

          {/* INPUT SOURCES Chips */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 text-[11px] font-mono text-blue-700 dark:text-blue-300">
            <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] mr-0.5">INPUT:</span>
            {result.inputSources && result.inputSources.length > 0 ? (
              result.inputSources.map((source, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200">
                  {source === "text" && "✍ Text"}
                  {source === "voice" && "🎙 Voice"}
                  {source === "image" && "📷 Image"}
                  {source === "document" && "📄 Document"}
                </span>
              ))
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200">
                ✍ Text
              </span>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* SMART HUMAN HANDOFF Modal Trigger */}
          <button
            onClick={() => setShowHandoffModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-gradient-to-r dark:from-cyan-600/20 dark:to-blue-600/20 dark:hover:from-cyan-600/30 dark:hover:to-blue-600/30 border border-cyan-200 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white text-xs font-mono font-bold transition-all shadow-sm"
            title="Create targeted handoff briefing for Healthcare, Responders, Volunteers, or Family"
          >
            <span className="text-sm">🤝</span>
            <span>{t("create_handoff") || "CREATE HANDOFF"}</span>
          </button>

          {/* FIELD DOSSIER Export & Print Modal Trigger */}
          <button
            onClick={() => setShowDossierModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/15 dark:hover:bg-blue-600/25 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white text-xs font-mono font-bold transition-all shadow-sm"
            title="Open printable Emergency Field Dossier"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>FIELD DOSSIER</span>
          </button>

          {/* OFFLINE SAVE Button */}
          <button
            onClick={handleSaveOffline}
            disabled={isSavingOffline || isOfflineSaved}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isOfflineSaved
                ? "bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 cursor-default"
                : "bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Save encrypted snapshot for offline Field Mode"
          >
            {isSavingOffline ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-400 dark:border-white/30 border-t-slate-800 dark:border-t-white rounded-full animate-spin" />
            ) : isOfflineSaved ? (
              <HardDrive className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <HardDrive className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            )}
            <span>{isOfflineSaved ? "Offline ready ✓" : "SAVE OFFLINE"}</span>
          </button>

          {/* SAVE CASE Button (if not already viewing a saved case) */}
          {!caseId && (
            <button
              onClick={handleSaveCase}
              disabled={isSaving || isSaved}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isSaved
                  ? "bg-emerald-50 dark:bg-emerald-600/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 cursor-default"
                  : "bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-400 dark:border-white/30 border-t-slate-800 dark:border-t-white rounded-full animate-spin" />
              ) : isSaved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
              <span>{isSaved ? "Saved ✓" : "SAVE CLOUD"}</span>
            </button>
          )}

          {isSaved && savedCaseId && !caseId && (
            <Link
              href={`/cases/${savedCaseId}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white text-xs font-mono font-semibold transition-all"
            >
              <span>VIEW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={handleShareSummary}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "SHARE"}</span>
          </button>
        </div>
      </div>

      {/* Temporary Toast Message */}
      {(shareFeedback || selectedCtaMessage) && (
        <div className="mb-6 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/40 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between shadow-md animate-fadeIn no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{shareFeedback || selectedCtaMessage}</span>
          </div>
          <button
            onClick={() => {
              setShareFeedback(null);
              setSelectedCtaMessage(null);
            }}
            className="text-xs font-semibold underline text-blue-600 dark:text-blue-300 ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Intelligent Decision Experience Stack */}
      <div className="space-y-7">
        {/* 1. URGENCY / PRIORITY BANNER */}
        <div
          className={`rounded-2xl p-6 border transition-all ${priorityStyles.bg} ${priorityStyles.glow}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-md ${priorityStyles.badge}`}
              >
                <span>{priorityStyles.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest font-bold opacity-80">
                  <span>{t("priority_title") || "URGENCY ASSESSMENT"}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  {priorityStyles.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium mt-1 opacity-90">
                  “{priorityStyles.subtitle}”
                </p>
              </div>
            </div>

            {/* Urgency Level Ticker */}
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/40 p-2 rounded-xl border border-slate-200 dark:border-white/10 self-start sm:self-auto font-mono text-xs shadow-sm">
              <div
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  result.priority === "LOW"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                LOW
              </div>
              <span className="text-slate-400 dark:text-slate-600">›</span>
              <div
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  result.priority === "MEDIUM"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                MEDIUM
              </div>
              <span className="text-slate-400 dark:text-slate-600">›</span>
              <div
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  result.priority === "HIGH"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                HIGH
              </div>
              <span className="text-slate-400 dark:text-slate-600">›</span>
              <div
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  result.priority === "CRITICAL"
                    ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                CRITICAL
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECTION H: PROMINENT SPOTLIGHT — YOUR IMMEDIATE NEXT STEP */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 border border-blue-400/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                <span className="text-base">🎯</span>
                <span>YOUR IMMEDIATE NEXT STEP</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                {primaryNextStep.replace(/^👉\s*/, "")}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium max-w-2xl">
                This is the single most effective action you can take right now to begin resolving your situation.
              </p>
            </div>

            <div className="flex-shrink-0 self-start md:self-auto">
              <button
                onClick={() => {
                  const firstAction = actions[0];
                  if (firstAction) {
                    handleCtaClick(firstAction.title, firstAction.ctaText || "Take action", { stopPropagation: () => {} } as any);
                  }
                }}
                className="px-5 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-mono font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Focus On This Step</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Decorative subtle background elements */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 3. SECTION A: SITUATION UNDERSTOOD */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-white/[0.08] shadow-md bg-white dark:bg-[#0b0e17]">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-3">
            <Info className="w-4 h-4" />
            <span>SITUATION UNDERSTOOD</span>
          </div>
          <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
            {result.situation}
          </p>
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Synthesis of your reported details & context</span>
            {result.analyzedAt && <span>Analyzed at {result.analyzedAt}</span>}
          </div>
        </div>

        {/* 4. SECTION B & C: WHAT MAY HELP YOU & WHY THESE OPTIONS ARE RELEVANT */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/[0.08] shadow-md bg-white dark:bg-[#0b0e17] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.07] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  APPLICABLE ASSISTANCE & SCHEMES
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>What May Help You</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Programs, government schemes, healthcare steps, or official service pathways designed for this situation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFetchVerifiedResources}
                disabled={isVerifyingResources}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
                title="Re-check verified authoritative sources"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingResources ? "animate-spin text-blue-600 dark:text-blue-400" : ""}`} />
                <span>{isVerifyingResources ? "Checking..." : "RE-CHECK SOURCES"}</span>
              </button>
            </div>
          </div>

          {/* Why Relevant Rationale Banner */}
          {result.whyRelevant && result.whyRelevant.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/25 space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Why These Options May Be Relevant:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {result.whyRelevant.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Program / Scheme / Assistance Cards */}
          <div className="grid grid-cols-1 gap-4">
            {helpOptions.map((opt, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0f1322] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {opt.title}
                  </h4>

                  {opt.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-[11px] font-mono font-semibold text-blue-800 dark:text-blue-300">
                      {opt.category}
                    </span>
                  )}
                </div>

                {opt.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {opt.description}
                  </p>
                )}

                {opt.whyRelevant && (
                  <div className="p-3 rounded-xl bg-white dark:bg-[#090b14] border border-slate-200/80 dark:border-white/[0.05] text-xs text-slate-700 dark:text-slate-300">
                    <strong className="font-mono font-bold uppercase text-[11px] text-blue-600 dark:text-blue-400 mr-1.5">
                      Why it applies to you:
                    </strong>
                    <span>{opt.whyRelevant}</span>
                  </div>
                )}

                {opt.portalUrl && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-white/[0.05] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Official Portal: {opt.portalUrl}
                    </span>
                    <a
                      href={`https://${opt.portalUrl.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs"
                    >
                      <span>Check Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Verified Official Resources from Registry (Phase 9 Bridge) */}
          {verifiedResources.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Verified Authoritative Registry Sources</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Verified Domain
                </span>
              </div>

              <div className="space-y-3">
                {verifiedResources.map((vRes, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f1c] border border-slate-200 dark:border-white/[0.06] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {vRes.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                          {vRes.sourceType || "OFFICIAL"}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {vRes.whyRelevant}
                      </p>
                    </div>

                    {vRes.url && (
                      <a
                        href={vRes.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs flex-shrink-0"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. SECTION E: RECOMMENDED NEXT STEPS (SEQUENCED & INTERACTIVE CHECKLIST) */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-white/[0.08] shadow-md bg-white dark:bg-[#0b0e17]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-white/[0.07] mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  STEP-BY-STEP ACTION PLAN
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
                Recommended Next Steps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sequenced practical steps to execute in order. Track your progress as you complete each step.
              </p>
            </div>

            {/* ACTION PROGRESS Graphic Indicator */}
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  PROGRESS:
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {completedCount} / {totalActions} ({progressPercent}%)
                </span>
              </div>

              {/* Progress Bar Strip */}
              <div className="w-44 h-2.5 bg-slate-200 dark:bg-black/60 rounded-full border border-slate-300 dark:border-white/10 overflow-hidden p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {actions.map((action, idx) => {
              const status: ActionStatus = actionStatuses[idx] || "not_started";
              const isFirst = idx === 0;
              const stepNumber = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={idx}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    isFirst
                      ? "bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-blue-50/90 dark:from-blue-950/30 dark:via-[#121624] dark:to-[#121624] border-blue-300 dark:border-blue-500/40 shadow-md dark:shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20"
                      : "bg-slate-50/80 dark:bg-[#0d1019] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/15"
                  } ${status === "completed" ? "opacity-60" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Big Step Number */}
                      <div
                        className={`text-2xl sm:text-3xl font-black font-mono tracking-tighter ${
                          isFirst ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {stepNumber}
                      </div>

                      {/* Action Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {isFirst && (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-sm">
                              RECOMMENDED IMMEDIATE NEXT STEP
                            </span>
                          )}
                          <h4
                            className={`text-sm sm:text-base font-bold ${
                              status === "completed"
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {action.title}
                          </h4>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {action.description}
                        </p>

                        {/* Why this matters */}
                        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-xs">
                          <span className="font-mono font-bold uppercase text-[11px] text-blue-600 dark:text-blue-400 mr-1.5">
                            Why this matters:
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{action.reason}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3-State Action Status Selector & CTA */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/[0.05]">
                      {/* Action Status Pill Group */}
                      <div className="flex items-center gap-1 bg-white dark:bg-[#07090f] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] text-[11px] font-mono shadow-sm">
                        <button
                          type="button"
                          onClick={(e) => setSpecificStatus(idx, "not_started", e)}
                          title="Mark Not Started"
                          className={`px-2 py-1 rounded-lg transition-all ${
                            status === "not_started"
                              ? "bg-slate-700 text-white font-bold"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                          }`}
                        >
                          ○
                        </button>
                        <button
                          type="button"
                          onClick={(e) => setSpecificStatus(idx, "in_progress", e)}
                          title="Mark In Progress"
                          className={`px-2 py-1 rounded-lg transition-all ${
                            status === "in_progress"
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                          }`}
                        >
                          → In progress
                        </button>
                        <button
                          type="button"
                          onClick={(e) => setSpecificStatus(idx, "completed", e)}
                          title="Mark Completed"
                          className={`px-2 py-1 rounded-lg transition-all ${
                            status === "completed"
                              ? "bg-emerald-600 text-white font-bold"
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                          }`}
                        >
                          ✓ Done
                        </button>
                      </div>

                      {/* Action CTA Button */}
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCtaClick(action.title, action.ctaText || "Prepare information", e)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-all font-mono"
                      >
                        <span>
                          {action.ctaText ||
                            (idx === 0
                              ? "Check portal"
                              : idx === 1
                              ? "Prepare records"
                              : "Verify requirement")}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. SECTION D: INFORMATION WE STILL NEED */}
        {missingInfoList.length > 0 && (
          <div className="rounded-2xl p-6 sm:p-7 bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 shadow-md">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Information We Still Need</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium mb-4">
              To give you more specific guidance and check exact eligibility, we would need to know:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missingInfoList.map((infoItem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/90 dark:bg-[#0c0f1c] border border-amber-200/80 dark:border-amber-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{infoItem}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-amber-700 dark:text-amber-400 font-mono">
              💡 Tip: You can type these missing details in the &quot;Refine Analysis&quot; box below to update your plan instantly.
            </p>
          </div>
        )}

        {/* 7. SECTION F: DOCUMENTS YOU MAY NEED (INTERACTIVE CHECKLIST) */}
        {documentsList.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-white/[0.08] shadow-md bg-white dark:bg-[#0b0e17]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.07] mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>DOCUMENTS YOU MAY NEED</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Keep these ready before applying or visiting official centers. Tap to check off what you have.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400">
                {Object.values(checkedDocs).filter(Boolean).length} / {documentsList.length} ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documentsList.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleDoc(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isChecked
                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                        : "bg-slate-50 dark:bg-[#0e1220] border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/15 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm leading-snug ${isChecked ? "line-through opacity-80" : "font-medium"}`}>
                      {doc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. SECTION G: IMPORTANT INFORMATION & STATUTORY NOTICES */}
        {importantNotices.length > 0 && (
          <div className="rounded-2xl p-6 bg-rose-50/90 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 shadow-md">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Important Information & Safety Notes</span>
            </div>

            <div className="space-y-2.5">
              {importantNotices.map((warn, idx) => (
                <div
                  key={idx}
                  className="text-xs sm:text-sm text-rose-900 dark:text-rose-200/90 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-rose-600 dark:text-rose-400 font-bold text-base leading-none mt-0.5">•</span>
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. SECTION: CONVERSATIONAL FOLLOW-UP / REFINE ANALYSIS */}
        <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-blue-200 dark:border-blue-500/30 shadow-lg bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-[#0b0e1a] dark:via-[#090b14] dark:to-[#0f1325]">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>REFINE ANALYSIS / PROVIDE MORE DETAILS</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4">
            {result.refinementPrompt ||
              "Have more details (e.g., your state, family income, course, or updates)? Provide them below to refine this plan."}
          </p>

          <form onSubmit={handleRefineSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={refineInputText}
              onChange={(e) => setRefineInputText(e.target.value)}
              placeholder="e.g. I am from Karnataka, 3rd year BE, family income 1.5 Lakhs..."
              disabled={isRefining || isSubmittingRefine}
              className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#070910] border border-slate-300 dark:border-white/15 focus:border-blue-500 dark:focus:border-blue-400 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!refineInputText.trim() || isRefining || isSubmittingRefine}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs sm:text-sm font-mono font-bold transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 flex-shrink-0"
            >
              {isRefining || isSubmittingRefine ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isRefining || isSubmittingRefine ? "Refining..." : "Refine Plan"}</span>
            </button>
          </form>
        </div>

        {/* 10. COLLAPSIBLE AUDIT & TECHNICAL GROUNDING SECTION */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.02] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAuditDetails(!showAuditDetails)}
            className="w-full p-4 sm:px-6 flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Audit & Technical Grounding Details</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-normal lowercase">
              <span>{showAuditDetails ? "hide details" : "show details"}</span>
              {showAuditDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAuditDetails && (
            <div className="p-6 pt-2 border-t border-slate-200 dark:border-white/[0.06] space-y-5 animate-fadeIn">
              {/* Detected Facts */}
              {result.detectedInformation && result.detectedInformation.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                    Extracted Situational Metrics & Entities:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {result.detectedInformation.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.06] text-xs"
                      >
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          {item.label}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Reported Data */}
              {result.verified && result.verified.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>USER REPORTED (Information Provided in Input):</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {result.verified.map((v, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Needs Human Confirmation */}
              {result.needsConfirmation && result.needsConfirmation.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>NEEDS CONFIRMATION (Requires Human / Official Verification):</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {result.needsConfirmation.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 11. BOTTOM ACTION BAR */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 no-print border-t border-slate-200 dark:border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onReset}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{caseId ? "← All Cases" : "← New analysis"}</span>
            </button>

            <button
              onClick={() => setShowDossierModal(true)}
              className="px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/15 dark:hover:bg-blue-600/25 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white text-xs sm:text-sm font-mono font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>PRINT DOSSIER</span>
            </button>

            {caseId && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-600/15 dark:hover:bg-rose-600/25 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Delete Case"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">DELETE CASE</span>
              </button>
            )}
          </div>

          <button
            onClick={handleShareSummary}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE SUMMARY</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY FIELD DOSSIER MODAL */}
      <FieldDossier
        result={result}
        caseId={caseId || savedCaseId || undefined}
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        rawInput={rawInput}
      />

      {/* ANONYMOUS USER AUTH PROMPT MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/[0.1] shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Bookmark className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create an account to save your analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Your analysis results will stay active. Log in or sign up to keep this case in your verified history and track action plans.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/login?redirect=/"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
              >
                <LogIn className="w-4 h-4" />
                <span>LOGIN</span>
              </Link>

              <Link
                href="/signup?redirect=/"
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-slate-800 dark:text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>SIGN UP</span>
              </Link>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full mt-3 text-center text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 py-1 font-mono"
            >
              Continue without saving
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-[#0b0e17] border border-rose-200 dark:border-rose-500/30 shadow-2xl">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Delete this case?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Are you sure you want to permanently remove this case and action plan? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCase}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-1.5 font-mono font-bold"
              >
                {isDeleting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMART HUMAN HANDOFF MODAL */}
      <SmartHandoffModal
        isOpen={showHandoffModal}
        onClose={() => setShowHandoffModal(false)}
        analysis={result}
        originalInput={rawInput}
      />
    </div>
  );
};
