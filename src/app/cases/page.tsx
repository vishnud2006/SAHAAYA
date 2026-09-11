"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SavedCase, PriorityLevel } from "@/types";
import { getPriorityStyles } from "@/lib/utils";
import {
  FolderOpen,
  Search,
  Clock,
  ChevronRight,
  Trash2,
  Plus,
  ArrowLeft,
  HeartPulse,
  CloudRain,
  Building2,
  AlertOctagon,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

export default function CasesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/cases");
      return;
    }

    if (user) {
      fetch("/api/cases")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.cases)) {
            setCases(data.cases);
          }
        })
        .catch((err) => console.error("Error fetching cases:", err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this case from your history?")) {
      return;
    }

    try {
      const res = await fetch(`/api/cases/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCases((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete case:", err);
    }
  };

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

  const filteredCases = cases.filter((c) => {
    const matchesPriority =
      selectedPriority === "ALL" || c.priority.toUpperCase() === selectedPriority;
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rawInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.result?.situation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Top Breadcrumb & New Analysis Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Dashboard</span>
          </Link>

          <Link
            href="/#workspace"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ New Analysis</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">MY CASES</h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Your previous situations and action plans.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.06] shadow-sm mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your cases..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/[0.08] focus:border-blue-500 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((priority) => (
              <button
                key={priority}
                onClick={() => setSelectedPriority(priority)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedPriority === priority
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.03] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.07]"
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Case List Feed */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading your saved cases...</span>
          </div>
        ) : cases.length === 0 ? (
          /* EMPTY STATE (Zero Cases) */
          <div className="p-16 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.06] text-center max-w-md mx-auto shadow-sm">
            <FolderOpen className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Nothing saved yet.</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Turn your first messy situation into a clear action plan.
            </p>
            <div className="mt-6">
              <Link
                href="/#workspace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-blue-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>START AN ANALYSIS</span>
              </Link>
            </div>
          </div>
        ) : filteredCases.length === 0 ? (
          /* SEARCH EMPTY STATE */
          <div className="p-16 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.06] text-center max-w-md mx-auto shadow-sm">
            <Search className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300">No matching cases</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search keywords or priority filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((c) => {
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
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#090b14] hover:bg-slate-50/80 dark:hover:bg-[#0d101d] border border-slate-200 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <Link href={`/cases/${c.id}`} className="flex items-start gap-3.5 flex-1 min-w-0">
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
                  </Link>

                  <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
                    <div className="flex items-center gap-1">
                      {c.inputSources?.map((src, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[10px] font-mono text-slate-600 dark:text-slate-400"
                        >
                          {src === "text" && "✍"}
                          {src === "voice" && "🎙"}
                          {src === "image" && "📷"}
                          {src === "document" && "📄"}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/cases/${c.id}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 dark:bg-blue-600/20 dark:hover:bg-blue-600 border border-blue-200 dark:border-blue-500/30 text-blue-700 hover:text-white dark:text-blue-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm dark:shadow-none"
                    >
                      <span>Open case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={(e) => handleDelete(e, c.id)}
                      title="Delete case"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/[0.03] dark:hover:bg-rose-500/20 text-slate-400 dark:text-slate-500 dark:hover:text-rose-400 border border-slate-200 dark:border-transparent hover:border-rose-300 dark:hover:border-rose-500/30 transition-all shadow-sm dark:shadow-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
