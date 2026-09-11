"use client";

import React from "react";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/70 dark:bg-[#05070a] py-12 text-slate-600 dark:text-slate-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/[0.06]">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-wider">
                SAHAAYA
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Messy human problems → verified actions that help.
              </p>
            </div>
          </div>

          {/* Quick Info & Tag */}
          <div className="flex items-center gap-4 text-slate-500 text-xs font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Powered by Gemini
            </span>
            <span>•</span>
            <span>Zero Data Selling</span>
            <span>•</span>
            <span>Vercel Edge Ready</span>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center sm:text-left max-w-2xl">
            <strong className="text-slate-700 dark:text-slate-400">Critical Notice:</strong> SAHAAYA provides structured situational decision-support. In immediate life-threatening situations or acute medical emergencies, always dial your local emergency services (911 / 112 / 108 / local dispatch) immediately.
          </p>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span>Built with care for public good</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

