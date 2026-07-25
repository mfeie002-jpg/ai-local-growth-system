import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { translations, Language } from './translations';
import { findRoutePair } from '@/lib/routePairs';

// Define a loose type for translations
type TranslationsType = typeof translations.de | typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationsType;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'itsfeierabend-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'de';
    return window.location.pathname === '/en' || window.location.pathname.startsWith('/en/')
      ? 'en'
      : 'de';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  // The URL is authoritative. Persisted preferences must never change the
  // language of a canonical DE/EN route.
  useEffect(() => {
    const next: Language =
      location.pathname === '/en' || location.pathname.startsWith('/en/')
        ? 'en'
        : 'de';
    setLanguageState(next);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    document.documentElement.lang = next === 'en' ? 'en' : 'de-CH';
  }, [location.pathname]);

  const t = translations[language];
  const isEnglish = language === 'en';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isEnglish }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper to get localized path
export function getLocalizedPath(path: string, language: Language): string {
  const pair = findRoutePair(path);
  if (pair) return language === 'en' ? pair.en : pair.de;

  if (path.startsWith('/audit/r/')) {
    return language === 'en'
      ? path.replace('/audit/r/', '/en/audit/r/')
      : path;
  }
  if (path.startsWith('/en/audit/r/')) {
    return language === 'de'
      ? path.replace('/en/audit/r/', '/audit/r/')
      : path;
  }

  return language === 'en'
    ? (path.startsWith('/en') ? path : `/en${path}`)
    : path.replace(/^\/en(?=\/|$)/, '') || '/';
}

// Get current page in other language
export function getAlternateLanguagePath(currentPath: string, currentLang: Language): string {
  const targetLang = currentLang === 'de' ? 'en' : 'de';
  return getLocalizedPath(currentPath, targetLang);
}
