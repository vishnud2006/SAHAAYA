"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getOfflineCases, deleteOfflineCase, saveCaseOffline } from "@/lib/offlineStore";
import {
  Radio,
  Wifi,
  WifiOff,
  HardDrive,
  FileText,
  Printer,
  Trash2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
} from "lucide-react";
import { FieldDossier } from "@/components/FieldDossier";

export default function FieldModePage() {
  const { isOnline } = useNetworkStatus();
  const [offlineCases, setOfflineCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaseForDossier, setSelectedCaseForDossier] = useState<any | null>(null);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const cases = await getOfflineCases();
      setOfflineCases(cases);
    } catch (err) {
      console.error("Failed to load offline cases:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Remove this case from local offline storage?")) {
      await deleteOfflineCase(id);
      await loadCases();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* NETWORK & FIELD MODE STATUS BANNER */}
        <div
          className={`p-6 rounded-3xl border mb-8 transition-all ${
            isOnline
              ? "bg-white dark:bg-[#0b101d] border-slate-200 dark:border-blue-500/25 shadow-sm dark:shadow-xl dark:shadow-blue-500/5"
              : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/40 shadow-sm dark:shadow-xl dark:shadow-amber-500/10 ring-1 ring-amber-300 dark:ring-amber-500/30"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isOnline
                    ? "bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400"
                    : "bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 animate-pulse"
                }`}
              >
                {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
              </div>

              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  <span className={isOnline ? "text-blue-700 dark:text-blue-300" : "text-amber-700 dark:text-amber-300 font-bold"}>
                    {isOnline ? "NETWORK CONNECTED • FIELD READY" : "OFFLINE FIELD MODE ACTIVE"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Offline Field Operations Hub
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Field Mode provides high-resilience local storage for emergency briefings, evidence verification, and action plans on this device. Saved cases remain 100% accessible and printable without an internet connection.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto font-mono text-xs">
              <button
                onClick={loadCases}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-300 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 shadow-sm dark:shadow-none"
                title="Refresh local cache"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>SYNC LOCAL</span>
              </button>
              {isOnline && (
                <Link
                  href="/#workspace"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/25"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>NEW CASE</span>
                </Link>
              )}
            </div>
          </div>

          {/* Honest AI Capability Note */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                Gemini Live Analysis requires connectivity. Cached field dossiers & action items operate 100% locally.
              </span>
            </div>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500">
              Storage: IndexedDB local partition
            </span>
          </div>
        </div>

        {/* CACHED CASES SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Locally Cached Case Snapshots</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {offlineCases.length} case{offlineCases.length === 1 ? "" : "s"} stored on this device
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Loading local offline storage...</p>
            </div>
          ) : offlineCases.length === 0 ? (
            <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.06] shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto mb-4">
                <HardDrive className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No offline cases saved yet</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                When you analyze a situation or view a case, click <strong>SAVE OFFLINE</strong> or <strong>SAVE CASE</strong> to cache the full dossier on this device.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
                {isOnline && (
                  <Link
                    href="/#workspace"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold transition-all shadow-sm"
                  >
                    Start New Analysis
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {offlineCases.map((c) => {
                const priorityBadge =
                  c.priority === "CRITICAL"
                    ? "border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40"
                    : c.priority === "HIGH"
                    ? "border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40"
                    : "border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40";

                const cachedTime = new Date(c.savedOfflineAt || c.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl bg-white dark:bg-[#0c0f18] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md dark:shadow-lg"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${priorityBadge}`}
                        >
                          {c.priority} PRIORITY
                        </span>

                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{cachedTime}</span>
                        </span>
                      </div>

                      {/* Title & Situation */}
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {c.result?.situation || c.rawInput}
                      </p>

                      {/* Summary Metrics */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.05] grid grid-cols-3 gap-2 font-mono text-[11px]">
                        <div className="bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg border border-slate-200 dark:border-white/[0.04]">
                          <span className="text-slate-500 block text-[10px] uppercase">Actions</span>
                          <span className="text-slate-800 dark:text-slate-200 font-bold">
                            {c.result?.actions?.length || 0} steps
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg border border-slate-200 dark:border-white/[0.04]">
                          <span className="text-slate-500 block text-[10px] uppercase">Verified</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {c.result?.verified?.length || 0} facts
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg border border-slate-200 dark:border-white/[0.04]">
                          <span className="text-slate-500 block text-[10px] uppercase">Review</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {c.result?.needsConfirmation?.length || 0} items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCaseForDossier(c)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 text-blue-700 hover:text-white dark:text-blue-300 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm dark:shadow-none"
                          title="Print or Export Field Dossier"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>DOSSIER</span>
                        </button>

                        <button
                          onClick={(e) => handleDelete(c.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-all"
                          title="Delete from local cache"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        href={`/field/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-mono text-xs font-semibold transition-all group-hover:translate-x-0.5 shadow-sm dark:shadow-none"
                      >
                        <span>VIEW CASE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* FIELD DOSSIER MODAL IF TRIGGERED */}
      {selectedCaseForDossier && (
        <FieldDossier
          result={selectedCaseForDossier.result}
          caseId={selectedCaseForDossier.id}
          isOpen={!!selectedCaseForDossier}
          onClose={() => setSelectedCaseForDossier(null)}
          rawInput={selectedCaseForDossier.rawInput}
        />
      )}
    </div>
  );
}
