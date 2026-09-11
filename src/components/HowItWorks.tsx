"use client";

import React from "react";
import { Sparkles, FileText, CheckCircle2, ListOrdered, ShieldAlert, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "GIVE ANYTHING",
      description: "Speak, type, upload photos, or attach messy document fragments.",
      icon: FileText,
      color: "from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30",
    },
    {
      step: "02",
      title: "UNDERSTAND",
      description: "Gemini identifies intent and extracts relevant information & constraints.",
      icon: Sparkles,
      color: "from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30",
    },
    {
      step: "03",
      title: "SEPARATE",
      description: "Evidence is separated from assumptions and missing information.",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      step: "04",
      title: "PRIORITIZE",
      description: "The situation is conservatively assigned an appropriate priority.",
      icon: ShieldAlert,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    },
    {
      step: "05",
      title: "ACT",
      description: "The user receives structured, executable next best steps.",
      icon: ListOrdered,
      color: "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-20 border-t border-slate-200 dark:border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400 mb-3 font-bold uppercase tracking-wider">
            <span>The SAHAAYA Decision Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2 font-normal">
            Five clear stages turning unstructured reality into structured, life-supporting action.
          </p>
        </div>

        {/* 5-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 dark:bg-[#0d111c]/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/[0.07] shadow-sm hover:shadow-md dark:shadow-none hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xl font-black font-mono text-slate-300 dark:text-white/25 group-hover:text-blue-500/60 dark:group-hover:text-blue-400/50 transition-colors">
                      {s.step}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} border flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {s.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
