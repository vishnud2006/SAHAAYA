"use client";

import React from "react";
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Share2,
  FileText,
} from "lucide-react";
import { SahaayaAnalysisResult, PriorityLevel } from "@/types";
import { getPriorityStyles } from "@/lib/utils";

interface FieldDossierProps {
  result: SahaayaAnalysisResult;
  caseId?: string;
  isOpen: boolean;
  onClose: () => void;
  rawInput?: string;
}

export const FieldDossier: React.FC<FieldDossierProps> = ({
  result,
  caseId = "CASE-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  isOpen,
  onClose,
  rawInput,
}) => {
  if (!isOpen) return null;

  const priorityStyles = getPriorityStyles(result.priority);
  const generatedAt = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const dossierContent = document.getElementById("field-dossier-document");
    if (!dossierContent) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SAHAAYA Field Briefing - ${caseId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #111; max-width: 800px; margin: 0 auto; padding: 24px; }
    .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: bold; text-transform: uppercase; border: 1px solid #000; margin-top: 6px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
    th { background: #f5f5f5; font-weight: 700; width: 35%; }
    .action-item { border: 1px solid #ddd; padding: 10px 14px; margin-bottom: 8px; border-radius: 4px; }
    .action-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
    .action-desc { font-size: 13px; color: #222; }
    .action-reason { font-size: 12px; color: #555; margin-top: 4px; font-style: italic; }
    .footer { margin-top: 30px; border-top: 1px solid #999; padding-top: 12px; font-size: 11px; color: #555; text-align: center; }
  </style>
</head>
<body>
  ${dossierContent.innerHTML}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SAHAAYA-Field-Briefing-${caseId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex items-center justify-center print:p-0 print:bg-white print:static animate-fadeIn">
      {/* Container Panel */}
      <div className="w-full max-w-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:rounded-none">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#0d101a] border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-bold uppercase tracking-wider">Emergency Field Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT DOSSIER</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-300 dark:border-white/[0.1] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm dark:shadow-none"
              title="Download Briefing Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Dossier Paper */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          <div
            id="field-dossier-document"
            className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl print:rounded-none print:p-0 shadow-lg print:shadow-none text-left"
          >
            {/* DOSSIER HEADER */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                    S
                  </div>
                  <span className="text-xl font-black tracking-tight uppercase font-mono text-slate-950">
                    SAHAAYA
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                  FIELD BRIEFING
                </h1>
                <div className="text-xs font-mono text-slate-600 mt-1">
                  CASE ID: <strong className="text-slate-900 font-bold">{caseId}</strong> • GENERATED:{" "}
                  <strong>{generatedAt}</strong>
                </div>
              </div>

              {/* Priority Stamp Badge */}
              <div className="self-start sm:self-auto text-right sm:text-right">
                <div
                  className={`inline-block px-3.5 py-1.5 rounded border-2 font-mono font-black text-xs uppercase tracking-wider ${
                    result.priority === "CRITICAL"
                      ? "border-rose-600 text-rose-700 bg-rose-50"
                      : result.priority === "HIGH"
                      ? "border-amber-600 text-amber-700 bg-amber-50"
                      : "border-blue-600 text-blue-700 bg-blue-50"
                  }`}
                >
                  {result.priority} PRIORITY
                </div>
                <div className="text-[11px] font-mono text-slate-600 mt-1 italic">
                  {priorityStyles.subtitle}
                </div>
              </div>
            </div>

            {/* 1. SITUATION */}
            <div className="mb-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                1. SITUATION OVERVIEW
              </h2>
              <p className="text-sm text-slate-800 leading-relaxed font-sans font-medium">
                {result.situation}
              </p>
            </div>

            {/* 2. USER INTENT */}
            <div className="mb-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                2. PRIMARY INTENT & GOAL
              </h2>
              <p className="text-sm text-slate-800 leading-relaxed font-sans">
                {result.intent}
              </p>
            </div>

            {/* 3. KEY INFORMATION TABLE */}
            {result.detectedInformation && result.detectedInformation.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  3. KEY DETECTED INFORMATION
                </h2>
                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-xs font-sans">
                    <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-300">
                      <tr>
                        <th className="py-2 px-3 text-left w-2/5 border-r border-slate-300 font-bold">
                          Information Field
                        </th>
                        <th className="py-2 px-3 text-left font-bold">Reported Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {result.detectedInformation.map((info, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                          <td className="py-2 px-3 font-mono font-semibold text-slate-800 border-r border-slate-300">
                            {info.label}
                          </td>
                          <td className="py-2 px-3 text-slate-900 font-medium">{info.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4 & 5. EVIDENCE SPLIT: SUPPORTED BY INPUT vs NEEDS CONFIRMATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* 4. USER REPORTED (SUPPORTED BY INPUT) */}
              <div className="p-4 rounded border border-emerald-300 bg-emerald-50/40">
                <div className="text-xs font-mono font-bold uppercase text-emerald-900 mb-1">
                  4. USER REPORTED (SUPPORTED BY INPUT)
                </div>
                <div className="text-[11px] font-mono text-emerald-700 mb-2 italic">
                  Based on information provided to SAHAAYA.
                </div>
                <ul className="space-y-1.5 text-xs text-slate-900">
                  {result.verified && result.verified.length > 0 ? (
                    result.verified.map((v, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-emerald-700">•</span>
                        <span>{v}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">No explicit verified metrics.</li>
                  )}
                </ul>
              </div>

              {/* 5. NEEDS CONFIRMATION */}
              <div className="p-4 rounded border border-amber-300 bg-amber-50/40">
                <div className="text-xs font-mono font-bold uppercase text-amber-900 mb-1">
                  5. NEEDS CONFIRMATION
                </div>
                <div className="text-[11px] font-mono text-amber-700 mb-2 italic">
                  Requires confirmation before relying on this information.
                </div>
                <ul className="space-y-1.5 text-xs text-slate-900">
                  {result.needsConfirmation && result.needsConfirmation.length > 0 ? (
                    result.needsConfirmation.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-700">•</span>
                        <span>{c}</span>
                      </li>
                    ))
                  ) : (
                    <li className="italic text-slate-500">No critical missing parameters noted.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 6. NEXT BEST ACTIONS */}
            <div className="mb-6">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                6. RECOMMENDED ACTIONS & IMMEDIATE NEXT STEP
              </h2>
              {result.recommendedNextStep && (
                <div className="mb-3 p-3 bg-blue-50 border-2 border-blue-600 rounded">
                  <div className="text-[11px] font-mono font-bold text-blue-900 uppercase">
                    ★ Immediate Priority Step
                  </div>
                  <div className="text-xs font-bold text-slate-950 mt-0.5">
                    {result.recommendedNextStep}
                  </div>
                </div>
              )}
              <div className="space-y-2.5">
                {result.actions.map((act, idx) => (
                  <div key={idx} className="p-3 border border-slate-300 rounded bg-slate-50/50">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-black text-xs text-slate-900">
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900">
                        {act.title}
                      </strong>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 pl-5 leading-relaxed">
                      {act.description}
                    </p>
                    <div className="text-[11px] text-slate-600 mt-1 pl-5 font-mono italic">
                      <strong>Why:</strong> {act.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6B. DOCUMENTS TO KEEP READY */}
            {result.documentsNeeded && result.documentsNeeded.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  DOCUMENTS TO PREPARE / KEEP READY
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.documentsNeeded.map((doc, idx) => (
                    <div key={idx} className="p-2 border border-slate-300 rounded flex items-center gap-2 text-xs bg-slate-50">
                      <span className="w-4 h-4 border border-slate-500 rounded inline-block flex-shrink-0" />
                      <span className="font-medium text-slate-800">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. POSSIBLE HELP & VERIFIED RESOURCE PATHWAYS */}
            {((result.whatMayHelp && result.whatMayHelp.length > 0) || (result.verifiedResources && result.verifiedResources.length > 0) || (result.resources && result.resources.length > 0)) && (
              <div className="mb-6">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  7. POSSIBLE ASSISTANCE PROGRAMS & OFFICIAL PATHWAYS
                </h2>
                {result.whatMayHelp && result.whatMayHelp.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {result.whatMayHelp.map((item, idx) => {
                      const itemTitle = typeof item === "string" ? item : item.title;
                      const itemCat = typeof item === "string" ? "Scheme / Support" : item.category;
                      const itemDesc = typeof item === "string" ? "" : item.description;
                      return (
                        <div key={idx} className="p-2.5 border border-slate-300 rounded bg-slate-50">
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-slate-950">{itemTitle}</strong>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase">
                              {itemCat}
                            </span>
                          </div>
                          {itemDesc && <p className="text-xs text-slate-700 mt-1">{itemDesc}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
                {result.verifiedResources && result.verifiedResources.length > 0 ? (
                  <div className="space-y-2.5">
                    {result.verifiedResources.map((vr, i) => (
                      <div key={i} className="p-3 border border-slate-300 rounded bg-slate-50/70 text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <strong className="font-bold text-slate-900">{vr.title}</strong>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-400 uppercase">
                            {vr.sourceType} • {vr.domain || "Official Domain"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed mb-1.5">
                          {vr.whyRelevant}
                        </p>
                        {vr.confirmed && vr.confirmed.length > 0 && (
                          <div className="text-[11px] text-emerald-900 mb-1">
                            <strong className="font-mono uppercase text-[10px] text-emerald-800">Source Confirms:</strong>{" "}
                            {vr.confirmed.join(" • ")}
                          </div>
                        )}
                        {vr.needsConfirmation && vr.needsConfirmation.length > 0 && (
                          <div className="text-[11px] text-amber-900">
                            <strong className="font-mono uppercase text-[10px] text-amber-800">Requires User Verification:</strong>{" "}
                            {vr.needsConfirmation.join(" • ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {result.resources.map((r, i) => (
                      <div key={i} className="p-2.5 border border-slate-200 rounded">
                        <div className="font-mono font-bold text-slate-900">{r.type}</div>
                        <div className="text-slate-600 text-[11px] mt-0.5">{r.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 8. WARNINGS */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="mb-6 p-3 rounded border border-rose-300 bg-rose-50/50">
                <div className="text-xs font-mono font-bold uppercase text-rose-900 mb-1">
                  8. SAFETY & REGULATORY WARNINGS
                </div>
                <ul className="space-y-1 text-xs text-rose-900">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* STATUTORY FOOTER */}
            <div className="border-t border-slate-300 pt-4 mt-8 text-center text-[10px] font-mono text-slate-500 leading-relaxed">
              SAHAAYA is an AI-assisted decision-support system. It does not replace qualified professionals, emergency responders, or official authorities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
