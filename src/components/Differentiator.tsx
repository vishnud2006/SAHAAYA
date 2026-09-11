"use client";

import React from "react";
import { MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Zap } from "lucide-react";

export const Differentiator: React.FC = () => {
  return (
    <section id="comparison" className="py-16 md:py-20 border-t border-slate-200 dark:border-white/[0.06] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-3 font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>The SAHAAYA Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Not another chatbot.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Most AI systems give you an answer.
            <br />
            <strong className="text-slate-900 dark:text-white font-semibold">SAHAAYA turns an answer into a path forward.</strong>
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* 1. Standard Chatbot */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#090b12] border border-slate-200 dark:border-white/[0.07] shadow-sm flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    CONVERSATIONAL CHATBOT
                  </h3>
                  <p className="text-xs text-slate-500">Unstructured conversational responses</p>
                </div>
              </div>

              <div className="space-y-2.5 my-6 p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.04] text-xs font-mono text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span>Question / Panic input</span>
                </div>
                <div className="pl-4 text-slate-400 dark:text-slate-600">↓</div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span>Generic paragraph answer</span>
                </div>
                <div className="pl-4 text-slate-400 dark:text-slate-600">↓</div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400/80 italic">
                  Risks hallucinated phone numbers & unclear assumptions
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.05] text-[11px] text-slate-500 font-mono">
              Result: User remains overwhelmed with disorganized text
            </div>
          </div>

          {/* 2. SAHAAYA Decision Engine */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-blue-50/80 via-white to-indigo-50/50 dark:from-blue-950/40 dark:via-[#0d1120] dark:to-[#0d1120] border border-blue-300 dark:border-blue-500/40 shadow-sm dark:shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                      SAHAAYA ENGINE
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 font-bold">
                      Decision Support
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300/80">Structured real-world bridge</p>
                </div>
              </div>

              {/* SAHAAYA 6-Step Pipeline Flow */}
              <div className="space-y-2 my-5 p-4 rounded-2xl bg-white dark:bg-black/60 border border-blue-200 dark:border-blue-500/20 text-xs font-mono shadow-inner">
                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <span className="font-semibold">Messy situation</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Raw voice, photo, text</span>
                </div>
                <div className="text-blue-500 text-xs">↓</div>
                <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300">
                  <span className="font-semibold">Intent</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Underlying goal</span>
                </div>
                <div className="text-blue-500 text-xs">↓</div>
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                  <span className="font-semibold">Evidence</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Verified supported facts</span>
                </div>
                <div className="text-blue-500 text-xs">↓</div>
                <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
                  <span className="font-semibold">Uncertainty</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Needs confirmation</span>
                </div>
                <div className="text-blue-500 text-xs">↓</div>
                <div className="flex items-center justify-between text-rose-700 dark:text-rose-300">
                  <span className="font-semibold">Priority</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Conservative urgency</span>
                </div>
                <div className="text-blue-500 text-xs">↓</div>
                <div className="flex items-center justify-between text-blue-900 dark:text-white font-bold bg-blue-100 dark:bg-blue-600/30 p-1.5 rounded-lg border border-blue-300 dark:border-blue-500/40">
                  <span>Action</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-200 font-sans">Interactive checklist</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200 dark:border-blue-500/20 text-[11px] text-blue-700 dark:text-blue-300/80 font-mono flex items-center justify-between">
              <span>Result: Clear, verified, executable next steps</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

