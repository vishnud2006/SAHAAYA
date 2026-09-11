'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/lib/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sahaaya_language') as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn')) {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sahaaya_language', lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    const value = langDict[key];
    if (typeof value === "string") {
      return value;
    }
    const enValue = TRANSLATIONS.en[key];
    if (typeof enValue === "string") {
      return enValue;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback if used outside provider
    return {
      language: 'en' as SupportedLanguage,
      setLanguage: () => {},
      t: (key: string) => TRANSLATIONS.en[key] || key,
    };
  }
  return context;
}
