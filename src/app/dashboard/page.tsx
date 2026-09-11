"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SavedCase, DashboardSummaryStats } from "@/types";
import { getPriorityStyles } from "@/lib/utils";
import {
  Sparkles,
  Plus,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
  HeartPulse,
  CloudRain,
  Building2,
  AlertOctagon,
  Flame,
  LifeBuoy,
  Radio,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [stats, setStats] = useState<DashboardSummaryStats>({
    totalAnalyses: 0,
    highPriority: 0,
    activeCases: 0,
    completedActions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard");
      return;
    }

    if (user) {
      Promise.all([
        fetch("/api/cases").then((res) => res.json()),
        fetch("/api/dashboard/stats").then((res) => res.json()),
      ])
        .then(([casesData, statsData]) => {
          if (casesData.success && Array.isArray(casesData.cases)) {
            setCases(casesData.cases);
          }
          if (statsData.success && statsData.stats) {
            setStats(statsData.stats);
          }
        })
        .catch((err) => console.error("Error loading dashboard data:", err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && loading)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern transition-colors duration-200">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-xs">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getCaseIcon = (priority: string, title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("medical") || lower.includes("bp") || lower.includes("health") || lower.includes("doctor")) {
      return HeartPulse;
    }
    if (lower.includes("flood") || lower.includes("water") || lower.includes("rain") || lower.includes("storm")) {
      return CloudRain;
    }
    if (lower.includes("benefit") || lower.includes("pension") || lower.includes("welfare") || lower.includes("widow")) {
      return Building2;
    }
    if (priority === "CRITICAL") return AlertOctagon;
    return LifeBuoy;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Dashboard Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-slate-200 dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400 mb-3 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Decision Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              WELCOME BACK, {user?.name?.toUpperCase() || "CITIZEN"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Turn your next messy situation into a clear next step.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/field"
              className="px-4 py-3.5 rounded-2xl bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.1] border border-slate-300 dark:border-white/[0.1] text-slate-800 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm dark:shadow-none"
            >
              <Radio className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>FIELD MODE</span>
            </Link>

            <Link
              href="/#workspace"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ NEW ANALYSIS</span>
            </Link>
          </div>
        </div>

        {/* 4 SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          {/* 1. TOTAL ANALYSES */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/[0.07] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                {stats.totalAnalyses}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">TOTAL ANALYSES</div>
            </div>
          </div>

          {/* 2. HIGH PRIORITY */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/[0.07] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-600/15 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-300 font-mono">
                {stats.highPriority}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">HIGH PRIORITY</div>
            </div>
          </div>

          {/* 3. ACTIVE CASES */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/[0.07] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-600/15 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-300 font-mono">
                {stats.activeCases}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">ACTIVE CASES</div>
            </div>
          </div>

          {/* 4. COMPLETED ACTIONS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/[0.07] shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-600/15 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-300 font-mono">
                {stats.completedActions}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">COMPLETED ACTIONS</div>
            </div>
          </div>
        </div>

        {/* RECENT ANALYSES FEED */}
        <div className="my-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">RECENT ANALYSES</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Your analyzed situations and verified action checklists.
              </p>
            </div>
            {cases.length > 0 && (
              <Link
                href="/cases"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1 transition-colors font-semibold"
              >
                <span>VIEW ALL CASES ({cases.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Fetching your analysis history...
            </div>
          ) : cases.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.06] text-center max-w-lg mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto mb-4">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">No cases yet.</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Give SAHAAYA a situation and we&apos;ll help turn it into a clear next step.
              </p>
              <div className="mt-6">
                <Link
                  href="/#workspace"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-blue-600/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>START YOUR FIRST ANALYSIS</span>
                </Link>
              </div>
            </div>
          ) : (
            /* LATEST 5 RECENT ANALYSES */
            <div className="space-y-3">
              {cases.slice(0, 5).map((c) => {
                const pStyles = getPriorityStyles(c.priority);
                const Icon = getCaseIcon(c.priority, c.title);
                const dateFormatted = new Date(c.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Link
                    key={c.id}
                    href={`/cases/${c.id}`}
                    className="block p-5 rounded-2xl bg-white dark:bg-[#090b14] hover:bg-slate-50/80 dark:hover:bg-[#0d101d] border border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all group shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Case Domain Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${pStyles.bg}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${pStyles.bg}`}
                            >
                              {pStyles.icon} {pStyles.level}
                            </span>

                            <span className="text-slate-500 text-xs font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dateFormatted}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors truncate">
                            {c.title}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 leading-relaxed">
                            {c.result?.situation || c.rawInput}
                          </p>
                        </div>
                      </div>

                      {/* Input Sources & CTA */}
                      <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          {c.inputSources?.map((src, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[10px] font-mono text-slate-600 dark:text-slate-400"
                            >
                              {src === "text" && "✍ Text"}
                              {src === "voice" && "🎙 Voice"}
                              {src === "image" && "📷 Image"}
                              {src === "document" && "📄 Doc"}
                            </span>
                          ))}
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
