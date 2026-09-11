"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";
import { useTheme, ThemeMode } from "@/context/ThemeContext";

interface ThemeToggleProps {
  variant?: "dropdown" | "segmented" | "compact";
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "dropdown",
  className = "",
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/60 dark:border-white/[0.08] animate-pulse ${className}`} />
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-300/80 dark:border-white/[0.08] transition-all flex items-center justify-center ${className}`}
        title={`Current: ${resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}. Click to toggle.`}
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="w-4 h-4 text-sky-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </button>
    );
  }

  if (variant === "segmented") {
    const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
      { mode: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
      { mode: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
      { mode: "system", label: "System", icon: <Laptop className="w-3.5 h-3.5" /> },
    ];

    return (
      <div className={`flex items-center bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl p-0.5 ${className}`}>
        {options.map((opt) => {
          const isActive = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
                isActive
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title={`${opt.label} Mode`}
            >
              {opt.icon}
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Dropdown Selector
  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-mono font-medium"
        aria-label="Theme selector"
        title="Theme settings"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="w-3.5 h-3.5 text-sky-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
        <span className="hidden sm:inline capitalize">
          {theme === "system" ? "System" : theme}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#0d101a] border border-slate-200 dark:border-white/[0.1] shadow-xl p-1.5 z-50 animate-fadeIn font-mono text-xs">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
              theme === "light"
                ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 font-bold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check className="w-3.5 h-3.5 text-blue-500" />}
          </button>

          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
              theme === "dark"
                ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 font-bold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check className="w-3.5 h-3.5 text-blue-500" />}
          </button>

          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all ${
              theme === "system"
                ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 font-bold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              <span>System</span>
            </div>
            {theme === "system" && <Check className="w-3.5 h-3.5 text-blue-500" />}
          </button>
        </div>
      )}
    </div>
  );
};
