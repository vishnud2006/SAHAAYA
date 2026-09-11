"use client";

import React from "react";
import {
  Type,
  Mic,
  Image as ImageIcon,
  FileText,
  CloudRain,
  Car,
  Newspaper,
  ShieldCheck,
  Brain,
  CheckCircle2,
  ListOrdered,
  Sparkles,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

export const AnythingInActionOut: React.FC = () => {
  const inputs = [
    { label: "Text", icon: Type, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
    { label: "Voice", icon: Mic, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { label: "Photo", icon: ImageIcon, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Documents", icon: FileText, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { label: "Weather", icon: CloudRain, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { label: "Traffic", icon: Car, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "News", icon: Newspaper, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  const outputs = [
    { step: "01", label: "Understand", desc: "Extract situational intent & raw facts", icon: Brain, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { step: "02", label: "Verify", desc: "Audit evidence vs unverified assumptions", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { step: "03", label: "Prioritize", desc: "Classify urgency & life-safety risks", icon: ShieldCheck, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { step: "04", label: "Act", desc: "Produce sequenced, executable checklist", icon: ListOrdered, color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  ];

  return (
    <section className="py-14 border-t border-slate-200 dark:border-white/[0.06] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400 mb-2.5 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Decision Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ANYTHING IN → ACTION OUT
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
            How SAHAAYA converts real-world human input into verified institutional next steps.
          </p>
        </div>

        {/* 3-Tier Architecture Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center max-w-5xl mx-auto">
          {/* 1. ANYTHING IN (Left Column) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06] mb-3.5">
              <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                ANYTHING IN
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Unstructured Intake</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {inputs.map((inp, idx) => {
                const Icon = inp.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium font-mono ${inp.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{inp.label}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 italic">
              Accepts fragments, recordings, crumpled photos, and raw narrative.
            </p>
          </div>

          {/* Center Connector: SAHAAYA Engine */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-500/40 shadow-sm dark:shadow-xl text-center relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-sm font-black font-mono tracking-wider text-slate-900 dark:text-white">
              SAHAAYA
            </span>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-300 mt-0.5">
              Gemini Multimodal Engine
            </span>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10">
              <span>Zero-Hallucination Gate</span>
            </div>
          </div>

          {/* 3. ACTION OUT (Right Column) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06] mb-3.5">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                ACTION OUT
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Verified Output</span>
            </div>

            <div className="space-y-2">
              {outputs.map((out, idx) => {
                const Icon = out.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs ${out.color}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold font-mono tracking-wide">{out.label}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 truncate">{out.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

