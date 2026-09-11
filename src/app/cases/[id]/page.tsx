"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultDashboard } from "@/components/ResultDashboard";
import { SavedCase } from "@/types";
import { ArrowLeft, AlertCircle, Calendar, ShieldCheck, Lock } from "lucide-react";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [savedCase, setSavedCase] = useState<SavedCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/cases/${resolvedParams.id}`);
      return;
    }

    if (user) {
      fetch(`/api/cases/${resolvedParams.id}`)
        .then((res) => {
          if (res.status === 401 || res.status === 403 || res.status === 404) {
            throw new Error("Case record not found or access unauthorized.");
          }
          if (!res.ok) throw new Error("Could not load case details.");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.case) {
            setSavedCase(data.case);
          } else {
            setError(data.error || "Case could not be loaded.");
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to load case");
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, resolvedParams.id, router]);

  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async (additionalDetails: string) => {
    if (!savedCase) return;
    setIsRefining(true);
    try {
      const combinedQuery = `${savedCase.rawInput}\n\n[Additional Details]: ${additionalDetails}`;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: combinedQuery,
          rawInput: savedCase.rawInput,
          previousAnalysis: savedCase.result,
          inputSources: savedCase.inputSources || ["text"],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not refine analysis right now.");
      }

      // Update case via PUT /api/cases/[id]
      const updateRes = await fetch(`/api/cases/${savedCase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.data.situation?.slice(0, 60) || savedCase.title,
          priority: data.data.priority,
          result: data.data,
        }),
      });

      if (updateRes.ok) {
        const updateData = await updateRes.json();
        if (updateData.success && updateData.case) {
          setSavedCase(updateData.case);
        } else {
          setSavedCase({ ...savedCase, rawInput: combinedQuery, result: data.data });
        }
      } else {
        setSavedCase({ ...savedCase, rawInput: combinedQuery, result: data.data });
      }
    } catch (err: any) {
      console.error("Refinement error on saved case:", err);
      alert(err.message || "Failed to refine case.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative transition-colors duration-200">
      <Header />

      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading case record...</span>
          </div>
        ) : error || !savedCase ? (
          /* Error / Unauthorized Card */
          <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-600/15 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Case Not Available</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {error || "This case could not be found or you do not have permission to view it."}
            </p>
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-blue-600/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Cases</span>
            </Link>
          </div>
        ) : (
          <div className="py-6">
            <ResultDashboard
              result={savedCase.result}
              rawInput={savedCase.rawInput}
              caseId={savedCase.id}
              onReset={() => router.push("/cases")}
              onDelete={() => router.push("/cases")}
              onRefine={handleRefine}
              isRefining={isRefining}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
