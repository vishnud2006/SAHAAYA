"use client";

import React from "react";
import { ArrowRight, Sparkles, ArrowDown, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

interface HeroProps {
  onStartAnalysis: () => void;
  onSeeHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAnalysis, onSeeHowItWorks }) => {
  return (
    <section className="relative pt-12 pb-14 md:pt-20 md:pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] backdrop-blur-md mb-8 hover:border-blue-500/40 transition-all cursor-default shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold tracking-wide">
            SAHAAYA • Gemini Intelligent Bridge
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
          <span className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-white dark:to-blue-200 bg-clip-text text-transparent">
            Turn messy situations
          </span>
          <span className="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
            into clear next actions.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed font-normal">
          SAHAAYA uses Gemini to understand real-world information, separate evidence from uncertainty, prioritize what matters, and guide people toward the next best action.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2.5 group hover:scale-[1.02] active:scale-[0.98] font-mono"
          >
            <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span>Start with anything</span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSeeHowItWorks}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-sm border border-slate-200 dark:border-white/[0.1] hover:border-slate-300 dark:hover:border-white/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] font-mono"
          >
            <span>See how it works</span>
            <ArrowDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Visual Pipeline Flow Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#090b14]/90 border border-slate-200 dark:border-white/[0.08] shadow-xl dark:shadow-2xl max-w-3xl mx-auto text-left backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
            {/* 1. ANYTHING IN */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05]">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                ANYTHING IN
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                Text • Voice • Photo • Documents
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Real-world context</div>
            </div>

            {/* 2. SAHAAYA + GEMINI */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-center">
              <div className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                SAHAAYA + GEMINI
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Decision Support Engine</span>
              </div>
              <div className="text-[11px] text-blue-600/80 dark:text-blue-300/80 mt-0.5">Evidence Grounding Bridge</div>
            </div>

            {/* 3. ACTION OUT */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05]">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                ACTION OUT
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                Understand • Verify • Prioritize • Act
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Actionable step plan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
