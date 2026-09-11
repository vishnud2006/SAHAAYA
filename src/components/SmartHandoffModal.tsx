'use client';

import React, { useState } from 'react';
import { SahaayaAnalysis, HandoffRole, SupportedLanguage } from '@/types';
import { generateHandoffBriefing, formatBriefingAsPlainText } from '@/lib/handoffGenerator';
import { useLanguage } from '@/context/LanguageContext';

interface SmartHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: SahaayaAnalysis;
  originalInput?: string;
}

const ROLES: { id: HandoffRole; nameKey: string; defaultName: string; icon: string; descKey: string; defaultDesc: string }[] = [
  {
    id: 'healthcare',
    nameKey: 'role_healthcare',
    defaultName: 'Healthcare Professional',
    icon: '🏥',
    descKey: 'role_healthcare_desc',
    defaultDesc: 'Vitals, symptoms, timeline, clinical cautions & triage facts',
  },
  {
    id: 'emergency',
    nameKey: 'role_emergency',
    defaultName: 'Emergency Responder',
    icon: '🚨',
    descKey: 'role_emergency_desc',
    defaultDesc: 'Location, access hazards, immediate hazards & headcounts',
  },
  {
    id: 'volunteer',
    nameKey: 'role_volunteer',
    defaultName: 'Community Volunteer',
    icon: '🤝',
    descKey: 'role_volunteer_desc',
    defaultDesc: 'Shelter, food, non-clinical logistics & non-medical tasks',
  },
  {
    id: 'government',
    nameKey: 'role_government',
    defaultName: 'Government / Benefits Officer',
    icon: '🏛',
    descKey: 'role_government_desc',
    defaultDesc: 'Document checklist, eligibility criteria & official portals',
  },
  {
    id: 'family',
    nameKey: 'role_family',
    defaultName: 'Family / Caregiver',
    icon: '👨‍👩‍👧',
    descKey: 'role_family_desc',
    defaultDesc: 'Simple next steps, what to watch for & emergency contacts',
  },
];

export const SmartHandoffModal: React.FC<SmartHandoffModalProps> = ({
  isOpen,
  onClose,
  analysis,
  originalInput,
}) => {
  const { language, t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<HandoffRole>('healthcare');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const briefing = generateHandoffBriefing(
    analysis,
    selectedRole,
    originalInput,
    language as SupportedLanguage
  );

  const plainText = formatBriefingAsPlainText(briefing);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setShareFeedback(t('copied') || 'Brief copied to clipboard');
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 2500);
    } catch {
      setShareFeedback(t('copy_fail') || 'Could not copy to clipboard');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: briefing.title,
          text: plainText,
        });
        setShareFeedback(t('share_success') || 'Share sheet opened');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const priorityBadgeColors: Record<string, string> = {
    LOW: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    MEDIUM: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    HIGH: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    CRITICAL: 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 animate-pulse',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xl shadow-md shadow-cyan-900/30">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {t('smart_human_handoff') || 'Smart Human Handoff'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
                  Role-Adapted
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('handoff_subtitle') || 'Targeted briefing customized for specific human responders'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t('close') || 'Close'}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Role Selection Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">
              {t('select_recipient_role') || '1. Select Recipient Role'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{role.icon}</span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t(role.nameKey) || role.defaultName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 hidden sm:block">
                      {t(role.descKey) || role.defaultDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Handoff Briefing Preview Paper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('preview_briefing') || '2. Generated Briefing Preview'}
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                {t('facts_preserved') || 'Factual & Vitals Preserved'}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 font-sans space-y-4 shadow-inner">
              {/* Document Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ROLES.find((r) => r.id === selectedRole)?.icon}</span>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 tracking-wide">
                      {briefing.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Target Role: <strong className="text-slate-700 dark:text-slate-300">{briefing.roleName}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                      priorityBadgeColors[briefing.priority] || priorityBadgeColors.MEDIUM
                    }`}
                  >
                    {briefing.priority} PRIORITY
                  </span>
                </div>
              </div>

              {/* Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {briefing.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border ${
                      sec.title.includes('CAUTION') || sec.title.includes('WARNING')
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 col-span-1 md:col-span-2'
                        : sec.title.includes('IMMEDIATE') || sec.title.includes('ACTION')
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 font-semibold text-xs text-slate-800 dark:text-slate-300">
                      <span>{sec.icon}</span>
                      <span>{sec.title}</span>
                    </div>
                    {Array.isArray(sec.content) ? (
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                        {sec.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Statutory Disclaimer */}
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
                <p className="font-semibold text-slate-800 dark:text-slate-300 mb-0.5">⚠️ {t('disclaimer') || 'Verification Notice'}:</p>
                <p>{briefing.disclaimer}</p>
              </div>
            </div>
          </div>

          {/* Human Review Checkbox */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <input
              type="checkbox"
              id="review-consent"
              checked={hasReviewed}
              onChange={(e) => setHasReviewed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="review-consent" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">
                {t('i_have_reviewed_this') || 'I have reviewed this briefing'}
              </strong>
              {t('review_explanation') ||
                'I confirm that I have reviewed this synthesized summary and verify it is appropriate for sharing with this recipient.'}
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={!hasReviewed}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                hasReviewed
                  ? 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              }`}
            >
              🖨️ {t('print_briefing') || 'Print Briefing'}
            </button>
            {shareFeedback && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
                ✓ {shareFeedback}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              disabled={!hasReviewed}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                hasReviewed
                  ? copied
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              }`}
            >
              {copied ? '✓ ' + (t('copied') || 'Copied!') : '📋 ' + (t('copy_brief') || 'Copy Brief')}
            </button>

            <button
              onClick={handleShare}
              disabled={!hasReviewed}
              className={`px-4 py-2 text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 ${
                hasReviewed
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              📤 {t('share_handoff') || 'Share Handoff'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

