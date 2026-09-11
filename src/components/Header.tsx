"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  User,
  LogOut,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Menu,
  X,
  Radio,
  Wifi,
  WifiOff,
  Globe,
} from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onStartAnalysis?: () => void;
  onSelectScenario?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAnalysis, onSelectScenario }) => {
  const { user, logout } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStart = () => {
    if (onStartAnalysis) {
      onStartAnalysis();
    } else {
      window.location.href = "/#workspace";
    }
  };

  const languages: { code: SupportedLanguage; label: string; short: string }[] = [
    { code: "en", label: "English", short: "EN" },
    { code: "hi", label: "हिन्दी", short: "HI" },
    { code: "kn", label: "ಕನ್ನಡ", short: "KN" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-[#07090e]/90 border-b border-slate-200/80 dark:border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
              <div className="w-full h-full bg-white dark:bg-[#0b0e17] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                  SAHAAYA
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-mono tracking-wider">
                  Gemini
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider font-mono text-slate-600 dark:text-slate-300">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/#workspace"
                onClick={(e) => {
                  if (onStartAnalysis) {
                    e.preventDefault();
                    onStartAnalysis();
                  }
                }}
                className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>New Analysis</span>
              </Link>
              <Link
                href="/cases"
                className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>My Cases</span>
              </Link>
              <Link
                href="/field"
                className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06]"
              >
                <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Field Mode</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                  title={isOnline ? "Network Online" : "Field Mode Offline"}
                />
              </Link>
              <Link
                href="/profile"
                className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <>
              <a href="/#workspace" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Universal Input
              </a>
              <a href="/#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                How It Works
              </a>
              <a href="/#comparison" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Not a Chatbot
              </a>
              <Link
                href="/field"
                className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06]"
              >
                <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Field Mode</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                  title={isOnline ? "Network Online" : "Field Mode Offline"}
                />
              </Link>
            </>
          )}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Selector Toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl p-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg transition-all ${
                  language === lang.code
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
                title={lang.label}
              >
                {lang.short}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-700 dark:text-slate-200 transition-all"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold">{user.name.split(" ")[0]}</span>
              </Link>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition-all"
              >
                Sign up
              </Link>
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-1.5 text-xs font-bold font-mono px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start analyzing</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <ThemeToggle variant="compact" />

          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${
                  language === lang.code
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {lang.short}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-white dark:bg-[#090b14] border-b border-slate-200 dark:border-white/[0.08] space-y-3 font-mono text-xs shadow-xl animate-fadeIn">
          {user ? (
            <>
              <div className="pb-2 border-b border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Signed in as <strong className="text-slate-900 dark:text-white">{user.name}</strong></span>
                <ThemeToggle variant="segmented" />
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/#workspace"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleStart();
                }}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                New Analysis
              </Link>
              <Link
                href="/cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                My Cases
              </Link>
              <Link
                href="/field"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                <span>Field Mode</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                  {isOnline ? "● Online" : "○ Offline"}
                </span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                Profile
              </Link>
              <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left py-2 text-rose-600 dark:text-rose-400 font-bold"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="pb-2 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Appearance</span>
                <ThemeToggle variant="segmented" />
              </div>
              <a
                href="/#workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                Universal Input
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                How It Works
              </a>
              <a
                href="/#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                Not a Chatbot
              </a>
              <Link
                href="/field"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white"
              >
                <span>Field Mode</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                  {isOnline ? "● Online" : "○ Offline"}
                </span>
              </Link>
              <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

