"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getOfflineCaseById, deleteOfflineCase } from "@/lib/offlineStore";
import { FieldDossier } from "@/components/FieldDossier";
import { getPriorityStyles } from "@/lib/utils";
import {
  ArrowLeft,
  Printer,
  HardDrive,
  Clock,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HeartPulse,
  Siren,
  Building2,
  Car,
  CloudRain,
  Users,
  LifeBuoy,
  Shield,
  ShieldAlert,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function OfflineFieldCasePage() {
  const params = useParams();
  const router = useRouter();
  const { isOnline } = useNetworkStatus();

  const caseId = params?.id as string;
  const [caseData, setCaseData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDossierModal, setShowDossierModal] = useState(false);

  useEffect(() => {
    async function loadOfflineCase() {
      setIsLoading(true);
      try {
        // Try local storage first
        let data = await getOfflineCaseById(caseId);

        // If not in local storage and online, try fetching from server
        if (!data && isOnline) {
          const res = await fetch(`/api/cases/${caseId}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.case) {
              data = {
                ...json.case,
                savedOfflineAt: json.case.updatedAt,
              };
            }
          }
        }

        setCaseData(data);
      } catch (err) {
        console.error("Failed to load offline case:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (caseId) {
      loadOfflineCase();
    }
  }, [caseId, isOnline]);

  const handleDelete = async () => {
    if (confirm("Remove this case from local offline storage?")) {
      await deleteOfflineCase(caseId);
      router.push("/field");
    }
  };

  const getResourceIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("health") || lower.includes("medical") || lower.includes("hospital")) {
      return HeartPulse;
    }
    if (lower.includes("emergency") || lower.includes("ambulance") || lower.includes("police")) {
      return Siren;
    }
    if (lower.includes("government") || lower.includes("welfare") || lower.includes("department")) {
      return Building2;
    }
    if (lower.includes("traffic") || lower.includes("transport") || lower.includes("patrol")) {
      return Car;
    }
    if (lower.includes("disaster") || lower.includes("flood") || lower.includes("weather")) {
      return CloudRain;
    }
    if (lower.includes("community") || lower.includes("legal") || lower.includes("shelter")) {
      return Users;
    }
    return LifeBuoy;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Loading offline field record...</p>
        </div>
      </div>
    );
  }

  if (!caseData || !caseData.result) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <Header />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Offline Record Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            This case snapshot was not found in your local offline storage partition.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 font-mono text-xs">
            <Link
              href="/field"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/20"
            >
              ← Back to Field Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = caseData.result;
  const priorityStyles = getPriorityStyles(result.priority);
  const cachedTime = new Date(caseData.savedOfflineAt || caseData.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {/* TOP NAVIGATION & OFFLINE BADGE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.08] mb-6">
          <Link
            href="/field"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-300 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all group font-mono shadow-sm dark:shadow-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>← Field Mode Hub</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-xs font-mono text-indigo-700 dark:text-indigo-300 font-semibold">
              <HardDrive className="w-3.5 h-3.5" />
              <span>OFFLINE SNAPSHOT</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                isOnline
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 animate-pulse"
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? "Network Active" : "Offline Field Mode"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDossierModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT DOSSIER</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-600/15 dark:hover:bg-rose-600/25 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 transition-all"
              title="Remove from offline cache"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OFFLINE NOTICE BANNER */}
        <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>
              Cached locally: <strong>{cachedTime}</strong> • Case ID: <strong className="text-slate-900 dark:text-white">{caseId}</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-400 hidden sm:inline">
            Read-only resilient field view
          </span>
        </div>

        {/* PRIORITY BANNER */}
        <div className={`rounded-2xl p-6 border mb-7 shadow-sm ${priorityStyles.bg} ${priorityStyles.glow}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-lg ${priorityStyles.badge}`}
              >
                <span>{priorityStyles.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest font-bold opacity-75">
                  <span>URGENCY CLASSIFICATION</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  {priorityStyles.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium mt-1">
                  “{priorityStyles.subtitle}”
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 font-mono text-xs font-bold text-slate-900 dark:text-white self-start sm:self-auto shadow-sm">
              {result.priority} PRIORITY
            </div>
          </div>
        </div>

        {/* STRUCTURED INTELLIGENCE CARDS */}
        <div className="space-y-6">
          {/* Situation & Intent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-[#090b14]/80 rounded-2xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">
                1. Situation Overview
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">{result.situation}</p>
            </div>

            <div className="bg-white dark:bg-[#090b14]/80 rounded-2xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2">
                2. User Intent & Goal
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">{result.intent}</p>
            </div>
          </div>

          {/* Detected Key Information */}
          {result.detectedInformation && result.detectedInformation.length > 0 && (
            <div className="bg-white dark:bg-[#090b14]/80 rounded-2xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>3. Detected Key Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.detectedInformation.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d101a] border border-slate-200 dark:border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                      {item.label}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification / Evidence Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>4. Supported by Input</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                {result.verified?.map((v: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>5. Needs Confirmation</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                {result.needsConfirmation?.map((c: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Sequence */}
          <div className="bg-white dark:bg-[#090b14]/80 rounded-2xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-sm">
            <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-4">
              6. Next Best Actions
            </div>
            <div className="space-y-3">
              {result.actions?.map((act: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0d1019] border border-slate-200 dark:border-white/[0.08]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{act.title}</h4>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 pl-6 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="text-[11px] text-blue-700 dark:text-blue-300/80 mt-1.5 pl-6 font-mono">
                    <strong className="text-blue-600 dark:text-blue-400">Why:</strong> {act.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Possible Help & Verified Source Pathways */}
          {((result.verifiedResources && result.verifiedResources.length > 0) || (result.resources && result.resources.length > 0)) && (
            <div className="bg-white dark:bg-[#090b14]/80 rounded-2xl p-6 border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <LifeBuoy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>7. Possible Help & Verified Source Pathways</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Cached Snapshot View
                </span>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Source information shown from the saved snapshot. Live external verification requires active network connectivity.
              </div>

              {result.verifiedResources && result.verifiedResources.length > 0 ? (
                <div className="space-y-3">
                  {result.verifiedResources.map((vr: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200 dark:border-white/[0.06]">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <strong className="text-sm font-bold text-slate-900 dark:text-white">{vr.title}</strong>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 uppercase">
                          {vr.sourceType} • {vr.domain || "Official Domain"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                        {vr.whyRelevant}
                      </p>
                      {vr.confirmed && vr.confirmed.length > 0 && (
                        <div className="text-xs text-emerald-700 dark:text-emerald-300/90 mb-1">
                          <strong className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400">Source Confirms:</strong>{" "}
                          {vr.confirmed.join(" • ")}
                        </div>
                      )}
                      {vr.needsConfirmation && vr.needsConfirmation.length > 0 && (
                        <div className="text-xs text-amber-700 dark:text-amber-300/90">
                          <strong className="font-mono text-[10px] uppercase text-amber-600 dark:text-amber-400">Requires User Verification:</strong>{" "}
                          {vr.needsConfirmation.join(" • ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {result.resources.map((res: any, idx: number) => {
                    const Icon = getResourceIcon(res.type);
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0c0f18] border border-slate-200 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                          <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{res.type}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{res.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Safety Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>8. Safety & Regulatory Warnings</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-800 dark:text-rose-200">
                {result.warnings.map((warn: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* EMERGENCY DOSSIER MODAL */}
      <FieldDossier
        result={result}
        caseId={caseId}
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        rawInput={caseData.rawInput}
      />
    </div>
  );
}

