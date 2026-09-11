"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles, Brain, FileSearch, ShieldCheck, AlertCircle, ListOrdered } from "lucide-react";

interface ProcessingStateProps {
  onComplete?: () => void;
}

const STAGES = [
  {
    step: "01",
    title: "Understanding your situation...",
    detail: "Analyzing context, reported details, and core needs",
    icon: Brain,
  },
  {
    step: "02",
    title: "Finding relevant information...",
    detail: "Exploring applicable government schemes, official pathways, and requirements",
    icon: FileSearch,
  },
  {
    step: "03",
    title: "Preparing your next steps...",
    detail: "Sequencing your prioritized action plan, documents, and immediate next step",
    icon: ListOrdered,
  },
];

export const ProcessingState: React.FC<ProcessingStateProps> = () => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-white/[0.08] mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 relative">
              <Sparkles
                className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400"
                style={{ animationDuration: "4s" }}
              />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-wide">
                SAHAAYA MULTIMODAL REASONING ENGINE
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Transforming unstructured input into verified action
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[11px] font-mono text-blue-600 dark:text-blue-400">
            <span>
              Stage {Math.min(currentStageIdx + 1, STAGES.length)} of {STAGES.length}
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-white/[0.06] h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStageIdx + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        {/* Step-by-Step Sequence */}
        <div className="space-y-3.5">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.step}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-600/10 border-blue-300 dark:border-blue-500/40 shadow-md dark:shadow-lg shadow-blue-500/5 translate-x-1"
                    : isDone
                    ? "bg-slate-50/80 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-90"
                    : "bg-transparent border-transparent opacity-40"
                }`}
              >
                {/* Step Indicator */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold transition-all ${
                    isDone
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40"
                      : isCurrent
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 animate-pulse"
                      : "bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/[0.05]"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{stage.step}</span>
                  )}
                </div>

                {/* Stage Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs sm:text-sm font-bold font-sans ${
                        isCurrent
                          ? "text-slate-900 dark:text-white font-semibold"
                          : isDone
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-500 dark:text-slate-500"
                      }`}
                    >
                      {stage.title}
                    </span>

                    {isCurrent && (
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 animate-pulse flex-shrink-0">
                        Analyzing...
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
          <span>Applying conservative urgency triage & zero-hallucination guardrails</span>
        </div>
      </div>
    </div>
  );
};
