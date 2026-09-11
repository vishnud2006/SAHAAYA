"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UniversalInput } from "@/components/UniversalInput";
import { AnythingInActionOut } from "@/components/AnythingInActionOut";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultDashboard } from "@/components/ResultDashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { Differentiator } from "@/components/Differentiator";
import { TrustSafety } from "@/components/TrustSafety";
import { ProductPrinciples } from "@/components/ProductPrinciples";
import { Footer } from "@/components/Footer";
import { SahaayaAnalysisResult, AttachedFile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SahaayaAnalysisResult | null>(null);
  const [rawInput, setRawInput] = useState<string>("");
  const [lastFiles, setLastFiles] = useState<AttachedFile[]>([]);
  const [lastScenarioId, setLastScenarioId] = useState<string | undefined>(undefined);
  const [lastSources, setLastSources] = useState<Array<"text" | "voice" | "image" | "document">>(["text"]);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (
    text: string,
    files: AttachedFile[] = [],
    scenarioId?: string,
    inputSources: Array<"text" | "voice" | "image" | "document"> = ["text"]
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setRawInput(text);
    setLastFiles(files);
    setLastScenarioId(scenarioId);
    setLastSources(inputSources);

    // Smooth scroll to processing workspace
    const workspaceElement = document.getElementById("workspace");
    if (workspaceElement) {
      workspaceElement.scrollIntoView({ behavior: "smooth" });
    }

    try {
      const preparedFiles = files.map((f) => ({
        data: f.base64 || "",
        mimeType: f.type,
        filename: f.name,
        extractedText: f.extractedText,
      }));

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: text,
          files: preparedFiles,
          scenarioId,
          inputSources,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "SAHAAYA couldn't complete the analysis right now.");
      }

      // Allow user to view the multi-stage reasoning pipeline smoothly
      setTimeout(() => {
        setAnalysisResult(data.data);
        setIsLoading(false);

        // Auto-save case if user is authenticated
        if (user) {
          fetch("/api/cases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: data.data.situation?.slice(0, 60) || "Case Analysis",
              rawInput: text,
              priority: data.data.priority,
              inputSources,
              result: data.data,
            }),
          }).catch((e) => console.warn("Background auto-save notice:", e));
        }

        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }, 1400);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMessage(
        err.message?.includes("couldn't complete")
          ? err.message
          : `SAHAAYA couldn't complete the analysis right now. ${err.message || ""}`.trim()
      );
      setIsLoading(false);
    }
  };

  const handleRefine = async (additionalDetails: string) => {
    if (!analysisResult) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const combinedQuery = `${rawInput}\n\n[Additional Details]: ${additionalDetails}`;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: combinedQuery,
          rawInput,
          previousAnalysis: analysisResult,
          inputSources: lastSources,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not refine analysis right now.");
      }

      setAnalysisResult(data.data);
      setRawInput(combinedQuery);

      // Auto-save refined case if user is authenticated
      if (user) {
        fetch("/api/cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.data.situation?.slice(0, 60) || "Refined Case Analysis",
            rawInput: combinedQuery,
            priority: data.data.priority,
            inputSources: lastSources,
            result: data.data,
          }),
        }).catch((e) => console.warn("Background auto-save notice:", e));
      }
    } catch (err: any) {
      console.error("Refine error:", err);
      setErrorMessage(err.message || "Failed to refine analysis.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleRetry = () => {
    if (rawInput || lastFiles.length > 0) {
      handleAnalyze(rawInput, lastFiles, lastScenarioId, lastSources);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setRawInput("");
    setErrorMessage(null);
    setTimeout(() => {
      const workspaceElement = document.getElementById("workspace");
      if (workspaceElement) {
        workspaceElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById("workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative transition-colors duration-200">
      {/* Navigation Header */}
      <Header
        onStartAnalysis={scrollToWorkspace}
        onSelectScenario={scrollToWorkspace}
      />

      <main className="flex-1">
        {analysisResult ? (
          /* RESULT EXPERIENCE */
          <ResultDashboard
            result={analysisResult}
            onReset={handleReset}
            rawInput={rawInput}
            onRefine={handleRefine}
            isRefining={isRefining}
          />
        ) : isLoading ? (
          /* ANALYSIS EXPERIENCE */
          <div className="py-12">
            <ProcessingState />
          </div>
        ) : (
          /* HOME SCREEN & WORKSPACE */
          <>
            <Hero
              onStartAnalysis={scrollToWorkspace}
              onSeeHowItWorks={() => {
                const el = document.getElementById("how-it-works");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Error & Retry Banner if analysis fails */}
            {errorMessage && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-fadeIn">
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                        SAHAAYA couldn&apos;t complete this analysis.
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300/90 mt-0.5">
                        {errorMessage || "Something went wrong while processing your input."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try again</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setLastFiles([]);
                        const workspace = document.getElementById("workspace");
                        if (workspace) workspace.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-3 py-2 rounded-xl text-xs text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-white hover:bg-rose-100 dark:hover:bg-white/[0.05] transition-all"
                    >
                      Use text instead
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Large Universal Input Workspace */}
            <UniversalInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* ANYTHING IN -> ACTION OUT Visual Infographic */}
            <AnythingInActionOut />

            {/* How It Works Pipeline */}
            <HowItWorks />

            {/* Differentiator: Not another chatbot */}
            <Differentiator />

            {/* Trust & Safety Standard */}
            <TrustSafety />

            {/* Product Principles Manifesto */}
            <ProductPrinciples />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
