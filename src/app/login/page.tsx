"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const urlError = searchParams.get("error");

  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (urlError) {
      if (urlError === "oauth_cancelled") {
        setError("Google sign-in was cancelled.");
      } else if (urlError === "google_oauth_not_configured") {
        setError("Google Sign-In is not configured on this deployment. Please sign in with email & password, or configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your server environment.");
      } else if (urlError === "invalid_oauth_state") {
        setError("Authentication session timed out. Please try again.");
      } else {
        setError("Google authentication could not be completed. Please try again or use email login.");
      }
    }
  }, [urlError]);

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, redirectPath, router]);

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setError(result.error || "Unable to sign in. Please verify your credentials.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b0e17] border border-slate-200 dark:border-white/[0.08] shadow-xl dark:shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4 shadow-lg shadow-blue-500/10">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Sign in to SAHAAYA</h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
          Access your verified decision dashboard & cases.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-800 dark:text-rose-300 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Continue with Google Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-100 text-slate-800 dark:text-slate-900 border border-slate-300 dark:border-transparent font-bold font-mono text-xs uppercase tracking-wider shadow-sm dark:shadow-lg transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-xs font-mono uppercase tracking-wider">
            <span className="bg-white dark:bg-[#0b0e17] px-3 text-slate-500">Or continue with email</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/[0.08] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/[0.08] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-6"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold underline underline-offset-4">
          Create account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative transition-colors duration-200">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense fallback={<div className="text-slate-500 dark:text-slate-400 text-xs">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
