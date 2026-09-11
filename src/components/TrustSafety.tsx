"use client";

import React from "react";
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, Eye, Ban, HeartHandshake } from "lucide-react";

export const TrustSafety: React.FC = () => {
  const tenets = [
    {
      title: "Evidence is separated from assumptions",
      desc: "Information directly supported by user input is audited and displayed separately from unverified guesses.",
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Uncertainty is made visible",
      desc: "Critical missing details, ambiguous parameters, and gaps are highlighted under Needs Confirmation before acting.",
      icon: Eye,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Priority is communicated clearly",
      desc: "Conservative urgency triage (Critical, High, Medium, Low) prevents panic while alerting responders promptly.",
      icon: ShieldAlert,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "High-risk situations include safety guidance",
      desc: "Emergency, medical, and disaster inputs emphasize professional evaluation, evacuation, and dispatcher alerts.",
      icon: Shield,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "No invented facts, numbers, or schemes",
      desc: "SAHAAYA never hallucinates private phone numbers, fake addresses, medical diagnoses, or statutory welfare determinations.",
      icon: Ban,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <section id="safety" className="py-16 md:py-20 border-t border-slate-200 dark:border-white/[0.06] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-3 font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Safety & Responsibility Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            DESIGNED FOR RESPONSIBLE ACTION
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-2">
            Built from the ground up to support human decision-making with strict boundaries.
          </p>
        </div>

        {/* 5 Safety Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenets.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#0a0d16] border border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3.5 ${t.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {t.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Institutional Bridge Card */}
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-500/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Institutional Bridge Standard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                SAHAAYA connects human intent to certified systems (ambulance, hospital, disaster relief, welfare portals) without replacing licensed authority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
