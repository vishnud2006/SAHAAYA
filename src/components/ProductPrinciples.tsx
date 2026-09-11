"use client";

import React from "react";
import { ShieldCheck, UserCheck, AlertOctagon, Target, CheckCheck } from "lucide-react";

export const ProductPrinciples: React.FC = () => {
  const principles = [
    {
      title: "Zero Hallucination of Authority",
      desc: "SAHAAYA will never invent phone numbers, claim fake welfare eligibility, or simulate medical diagnoses.",
      icon: AlertOctagon,
      border: "border-rose-200 dark:border-rose-500/20",
      bg: "bg-rose-50/80 dark:bg-rose-500/5",
      text: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Separation of Fact vs Assumption",
      desc: "Every claim is audited. Directly supported input is marked verified; missing information is highlighted for human confirmation.",
      icon: CheckCheck,
      border: "border-emerald-200 dark:border-emerald-500/20",
      bg: "bg-emerald-50/80 dark:bg-emerald-500/5",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Conservative Urgency Triage",
      desc: "When life safety is involved, SAHAAYA estimates risk conservatively and directs users to certified emergency responders.",
      icon: ShieldCheck,
      border: "border-amber-200 dark:border-amber-500/20",
      bg: "bg-amber-50/80 dark:bg-amber-500/5",
      text: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Human Agency & Action-First",
      desc: "Outputs are sequenced checklists built for immediate execution, empowering citizens and caregivers with clarity.",
      icon: Target,
      border: "border-blue-200 dark:border-blue-500/20",
      bg: "bg-blue-50/80 dark:bg-blue-500/5",
      text: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <section id="principles" className="py-16 md:py-24 border-t border-slate-200 dark:border-white/[0.06] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Central Manifesto Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-4">
            <span>Product Philosophy</span>
          </div>
          
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-700 via-slate-900 to-indigo-800 dark:from-blue-300 dark:via-slate-100 dark:to-indigo-200 bg-clip-text leading-tight tracking-tight">
            “AI should not replace people or institutions.
            <br className="hidden sm:inline" /> It should make them easier to reach.”
          </blockquote>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-4 font-mono">
            — The SAHAAYA Architectural Standard
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${p.border} ${p.bg} backdrop-blur-md shadow-sm transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center flex-shrink-0 ${p.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

