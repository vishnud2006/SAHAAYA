import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getPriorityStyles(priority: string) {
  const p = priority?.toUpperCase() || "MEDIUM";
  switch (p) {
    case "CRITICAL":
      return {
        level: "CRITICAL",
        icon: "🚨",
        title: "CRITICAL PRIORITY",
        subtitle: "Immediate attention recommended",
        bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-300",
        badge: "bg-rose-600 text-white shadow-rose-600/30 font-bold",
        border: "border-rose-300 dark:border-rose-500/35",
        accent: "text-rose-600 dark:text-rose-400",
        glow: "shadow-[0_0_25px_rgba(244,63,94,0.15)]",
        ring: "ring-rose-500/20",
      };
    case "HIGH":
      return {
        level: "HIGH",
        icon: "⚠️",
        title: "HIGH PRIORITY",
        subtitle: "Prompt attention recommended",
        bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300",
        badge: "bg-amber-500 text-slate-950 shadow-amber-500/30 font-bold",
        border: "border-amber-300 dark:border-amber-500/35",
        accent: "text-amber-600 dark:text-amber-400",
        glow: "shadow-[0_0_25px_rgba(245,158,11,0.15)]",
        ring: "ring-amber-500/20",
      };
    case "MEDIUM":
      return {
        level: "MEDIUM",
        icon: "⚡",
        title: "MEDIUM PRIORITY",
        subtitle: "Action recommended",
        bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-300",
        badge: "bg-blue-600 text-white shadow-blue-600/30 font-bold",
        border: "border-blue-300 dark:border-blue-500/35",
        accent: "text-blue-600 dark:text-blue-400",
        glow: "shadow-[0_0_25px_rgba(59,130,246,0.15)]",
        ring: "ring-blue-500/20",
      };
    case "LOW":
    default:
      return {
        level: "LOW",
        icon: "ℹ️",
        title: "LOW PRIORITY",
        subtitle: "Informational / low urgency",
        bg: "bg-emerald-50 dark:bg-slate-500/10 border-emerald-200 dark:border-slate-500/25 text-emerald-900 dark:text-slate-300",
        badge: "bg-emerald-600 dark:bg-slate-700 text-white dark:text-slate-200 shadow-sm font-bold",
        border: "border-emerald-200 dark:border-slate-500/30",
        accent: "text-emerald-600 dark:text-slate-400",
        glow: "shadow-[0_0_25px_rgba(148,163,184,0.1)]",
        ring: "ring-slate-500/20",
      };
  }
}
